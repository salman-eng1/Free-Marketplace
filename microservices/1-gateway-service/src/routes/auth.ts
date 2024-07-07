import { SignIn } from '@gateway/controllers/auth/signin';
import { SignUp } from '@gateway/controllers/auth/signup';
import { VerifyEmail } from '@gateway/controllers/auth/verify-email';
import { Password } from '@gateway/controllers/auth/password';
import express, { Router } from 'express'
import { AuthSeed } from '@gateway/controllers/auth/seed';

class AuthRoutes {
    private router: Router;
    constructor() {
        this.router = express.Router();
    }

    public routes() {
        this.router.post('/auth/signin', SignIn.prototype.read)
        this.router.post('/auth/signup', SignUp.prototype.create)
        this.router.put('/auth/verify-email', VerifyEmail.prototype.update)
        this.router.put('/auth/forgot-password', Password.prototype.forgotPassword);
        this.router.put('/auth/reset-password/:token', Password.prototype.resetPassword);
        this.router.put('/auth/change-password', Password.prototype.changePassword);
        this.router.put('/auth/seed/:count', AuthSeed.prototype.create);

        return this.router
    }


}

export const authRoutes: AuthRoutes = new AuthRoutes()