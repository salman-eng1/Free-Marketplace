import {Application} from 'express'
import { healthRoutes } from '@gateway/routes/health'
import { authRoutes } from '@gateway/routes/auth'
import { currentUserRoutes } from './routes/current-user';
import { authMiddleware } from './services/auth_middleware';

const BASE_PATH = '/api/gateway/v1';
export const appRoutes=(app: Application)=> {
    app.use('', healthRoutes.routes())
    app.use(BASE_PATH, authRoutes.routes())
    app.use(BASE_PATH, authMiddleware.verifyUser,currentUserRoutes.routes())
}

