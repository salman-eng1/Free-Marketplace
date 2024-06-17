import { winstonLogger } from "@salman-eng1/marketplace-shared";
import { error, Logger } from "winston";
import { config } from "@chat/config";
import mongoose from "mongoose";



const log:Logger=winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'chatDatabaseServer','debug')


const databaseConnection=async (): Promise<void> => {
try{
await mongoose.connect(`${config.DATABASE_URL}`)

log.info(`Chat Service successfully connected to database `)
}catch{
    log.log(`error`, 'ChatService databaseConnection method error:', error)
}

}

export {databaseConnection};
