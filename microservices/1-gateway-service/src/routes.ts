import {Application} from 'express'
import { healthRoutes } from './routes/health'

export const appRoutes=(app: Application)=> {
    app.use('', healthRoutes.routes())
}

