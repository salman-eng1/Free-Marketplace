import { Application } from "express";
import { authRoutes } from "@auth/routes/auth";
import { searchRoutes } from "@auth/routes/search";
import { verifyGatewayRequest } from "@salman-eng1/marketplace-shared";
import { currentUserRoutes } from "@auth/routes/current-user";
import { healthRoutes } from "@auth/routes/health";
import { seedRoutes } from "@auth/routes/seed";


const BASE_PATH='/api/v1/auth'
export function appRoutes(app: Application): void{
    app.use('', healthRoutes())
    app.use(BASE_PATH, searchRoutes())
    app.use(BASE_PATH, seedRoutes());

 app.use(BASE_PATH,verifyGatewayRequest,authRoutes())
 app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());

}