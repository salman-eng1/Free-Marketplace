import express, { Router } from 'express'
import { Get } from '@gateway/controllers/users/buyer/get';
import { authMiddleware } from '@gateway/services/auth_middleware';

class BuyerRoutes {
    private router: Router;
    constructor() {
        this.router = express.Router();
    }

    public routes() {

this.router.get('/buyer/email',authMiddleware.checkAuthentication,Get.prototype.email)
this.router.get('/buyer/username',authMiddleware.checkAuthentication,Get.prototype.currentUsername)
this.router.get('/buyer/:username',authMiddleware.checkAuthentication,Get.prototype.username)

        return this.router
    }


}

export const buyerRoutes: BuyerRoutes = new BuyerRoutes ()