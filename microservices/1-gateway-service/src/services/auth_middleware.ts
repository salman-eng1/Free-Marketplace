import { config } from "@gateway/config"
import { BadRequestError, IAuthPayload, NotAuthorizedError } from "@salman-eng1/marketplace-shared"
import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"



class AuthMiddleware {
    public verifyUser(req: Request, res: Response, next: NextFunction): void {
        if (!req.session?.jwt) {
            throw new NotAuthorizedError('Token is not available, please login again', 'Gateway Service verifyUser() method error')
        }
        try {
            const payload: IAuthPayload = verify(req.session?.jwt, `${config.JWT_TOKEN}`) as IAuthPayload
            req.currentUser = payload;

        } catch (err) {
            throw new NotAuthorizedError('Token is not available, please login again', 'Gateway Service verifyUser() method invalid session error')
        }
        next()

    }

    public checkAuthentication(req: Request, res: Response, next: NextFunction): void {
        if (!req.currentUser) {
            throw new BadRequestError('Authentication is required to access this route', 'Gateway Service checkAuthentication() method')
        }
        next()
    }
}

export const authMiddleware = new AuthMiddleware()