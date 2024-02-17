import {Application} from 'express'
import { healthRoutes } from '@gateway/routes/health'
import { authRoutes } from '@gateway/routes/auth'

const BASE_PATH = '/api/gateway/v1';
export const appRoutes=(app: Application)=> {
    app.use('', healthRoutes.routes())
    app.use(BASE_PATH, authRoutes.routes())
}

