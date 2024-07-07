import { winstonLogger } from "@salman-eng1/marketplace-shared";
import { error, Logger } from "winston";
import { config } from "@order/config";
import mongoose from "mongoose";



const log:Logger=winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'orderDatabaseServer','debug')


const databaseConnection=async (): Promise<void> => {
try{
await mongoose.connect(`${config.DATABASE_URL}`)

log.info(`Order Service successfully connected to database `)
}catch{
    log.log(`error`, 'OrderService databaseConnection method error:', error)
}

}

export {databaseConnection};
