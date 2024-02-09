import {SignUp} from '@gateway/controllers/auth/signup';
import express, {Application, Router} from 'express'

class AuthRoutes{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.get('/auth/signup',SignUp.prototype.create)
        return this.router
    }


}

export const authRoutes: AuthRoutes=new AuthRoutes()