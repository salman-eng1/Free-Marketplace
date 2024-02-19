import express, { Router } from 'express'
import { CurrentUser } from '@gateway/controllers/auth/current-user';
import { authMiddleware } from '@gateway/services/auth_middleware';
import { Refresh } from '@gateway/controllers/auth/refresh-token';

class CurrentUserRoutes {
    private router: Router;
    constructor() {
        this.router = express.Router();
    }

    public routes() {
        this.router.get('/auth/refresh-token/:username',authMiddleware.checkAuthentication, Refresh.prototype.token)
        this.router.get('/auth/currentuser',authMiddleware.checkAuthentication, CurrentUser.prototype.read)
        this.router.get('/auth/resend-email',authMiddleware.checkAuthentication, CurrentUser.prototype.resendEmail)
        return this.router
    }


}

export const currentUserRoutes: CurrentUserRoutes = new CurrentUserRoutes()