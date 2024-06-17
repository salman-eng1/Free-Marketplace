import { winstonLogger } from "@salman-eng1/marketplace-shared";
import { error, Logger } from "winston";
import { config } from "@users/config";
import mongoose from "mongoose";



const log:Logger=winstonLogger(`${config.ELASTIC_SEARCH_URL}`,'userDatabaseServer','debug')


const databaseConnection=async (): Promise<void> => {
try{
await mongoose.connect(`${config.DATABASE_URL}`)

log.info(`User Service successfully connected to database `)
}catch{
    log.log(`error`, 'UserService databaseConnection method error:', error)
}

}

export {databaseConnection};
