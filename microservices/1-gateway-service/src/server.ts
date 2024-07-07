import  'express-async-errors'
import { Application, NextFunction, Request, Response, json, urlencoded } from 'express';
import { IErrorResponse, winstonLogger, CustomError } from '@salman-eng1/marketplace-shared';
import { Logger } from 'winston';
import cookieSession from 'cookie-session';
import cors from 'cors'
import hpp from 'hpp';
import helmet from 'helmet'
import { StatusCodes } from 'http-status-codes';
import compression from 'compression';
import http from 'http';
import { config } from '@gateway/config';
import { elasticSearch } from '@gateway/elastcsearch';
import { appRoutes } from '@gateway/routes';
import { axiosAuthInstance } from '@gateway/services/api/auth.service';
import { axiosBuyerInstance } from '@gateway/services/api/buyer.service';
import { axiosSellerInstance } from '@gateway/services/api/seller.service';
import { axiosGigInstance } from '@gateway/services/api/gig.service';
import {Server} from 'socket.io'
import { createClient } from 'redis';
import { createAdapter } from '@socket.io/redis-adapter';
import { SocketIOAppHandler } from '@gateway/sockets/socket';
import { axiosMessageInstance } from '@gateway/services/api/message.service';
import { axiosOrderInstance } from '@gateway/services/api/order.service';
import { axiosReviewInstance } from '@gateway/services/api/review.service';

const SERVER_PORT = 4000;
const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, "apiGatewayServer", "");
export let socketIO: Server

export class GatewayServer {
    private app: Application;

    constructor(app: Application) {
        this.app = app;
    }
    public start(): void {
        this.securityMiddleware(this.app)
        this.standardMiddleware(this.app)
        this.routesMiddleware(this.app)
        this.startElasticSearch()
        this.errorHandler(this.app)
        this.startServer(this.app)
    }
    private securityMiddleware(app: Application): void {
        app.set('trust proxy', 1);
        app.use(
          cookieSession({
            name: 'session',
            keys: [`${config.SECRET_KEY_ONE}`, `${config.SECRET_KEY_TWO}`],
            maxAge: 24 * 7 * 3600000,
            secure: config.NODE_ENV !== 'development',
            ...(config.NODE_ENV !== 'development' && {
              sameSite: 'none'
            })
          })
        );
        app.use(hpp())
        app.use(helmet())
        app.use(cors({
            origin: `${config.CLIENT_URL}`,
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
        }
        ))
        app.use((req:Request, _res:Response, next: NextFunction) => {
            if (req.session?.jwt){
                axiosAuthInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwt}`;
                axiosBuyerInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwt}`
                axiosSellerInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwt}`
                axiosGigInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwt}`
                axiosMessageInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwt}`,
                axiosOrderInstance.defaults.headers['Authorization']= `Bearer ${req.session?.jwt}`
                axiosReviewInstance.defaults.headers['Authorization'] = `Bearer ${req.session?.jwt}`;

            }
            next();

        })
    }

    private standardMiddleware(app: Application): void {
        app.use(compression())
        app.use(json({ limit: '200mb' }));
        app.use(urlencoded({ extended: true, limit: '200mb' }))  //allows client to send form request "application/x-www-form-urlencoded"
    }
    private routesMiddleware(app: Application): void {
appRoutes(app)
    }
    private startElasticSearch(): void {
        elasticSearch.checkConnection()
    }
    private errorHandler(app: Application): void {


        //reject unhandeld routes
        app.use('*', (req: Request, res: Response, next: NextFunction) => {
            const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
            log.log('error', `${fullUrl} endpoint does not exist`, '')
            res.status(StatusCodes.NOT_FOUND).json({ message: 'The endpoint called does not exist' })
            next()
        });


        app.use((error: IErrorResponse, _req: Request, res: Response, next: NextFunction) => {
            log.log('error', `GatewayService`, `${error.comingFrom}: `, error)
            if (error instanceof CustomError) {
                res.status(error.statusCode).json(error.serializeErrors())
            }
            next()
        });

    }


    private async startServer(app: Application): Promise<void> {
        try {
            const httpServer: http.Server = new http.Server(app)
            const socketIO:Server=await this.createSocketIO(httpServer)
            this.startHttpServer(httpServer)
            //create socket.io connection
            this.socketIOConnections(socketIO)
        } catch (error) {
            log.log('error', `GatewayService startServer() error method`, error)
        }
    }

    //create socket.io server
    private async createSocketIO(httpServer: http.Server): Promise<Server> {
        const io: Server = new Server(httpServer, {
          cors: {
            origin: `${config.CLIENT_URL}`,
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
          }
        });
        const pubClient = createClient({ url: config.REDIS_HOST });
        const subClient = pubClient.duplicate();
        await Promise.all([pubClient.connect(), subClient.connect()]);
        io.adapter(createAdapter(pubClient, subClient));
        socketIO = io;
        return io;
      }

    private async startHttpServer(httpServer: http.Server): Promise<void> {
        try {
            log.info(`Gateway server has started with process id ${process.pid}`)
            httpServer.listen(SERVER_PORT, () => {
                log.info(`Gateway server is running on port ${SERVER_PORT}`)

            })
        } catch (error) {
            log.log('error', `GatewayService startServer() error method`, error)
        }
    }


    private socketIOConnections(io: Server): void {
        const socketIoApp = new SocketIOAppHandler(io);
        socketIoApp.listen();
      }
    }