import { health } from "@users/controllers/health";
import exporess,{ Router} from "express";


const router: Router= exporess.Router();

const healthRoutes = (): Router =>{
    router.get('/user-health', health)


    return router
}


export {healthRoutes}