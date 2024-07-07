import { Health } from '@gateway/controllers/health';
import express, {Router} from 'express'

class HealthRoutes{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.get('/gateway-health',Health.prototype.health)
        return this.router
    }


}

export const healthRoutes: HealthRoutes=new HealthRoutes()