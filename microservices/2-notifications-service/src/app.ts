import { winstonLogger } from "@salman-eng1/marketplace-shared";
import { Logger } from "winston";
import {config} from '@notifications/config'
import express,{Express} from "express";
import {start} from '@notifications/server'



const log: Logger = winstonLogger(`${config.ELASTIC_SEARCH_URL}`, 'notificationElasticSearchServer', 'debug');

 function initialize(): void{
    const app: Express=express()
    start(app)
    log.info('Notification Service Initialized')
}

initialize()