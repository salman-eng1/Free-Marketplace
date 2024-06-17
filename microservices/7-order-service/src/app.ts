import express, { Express } from "express";
import { config } from "@order/config";
import { databaseConnection } from "@order/database"
import { start } from "@order/server";

const initialize = (): void => {
    databaseConnection()
    config.cloudinaryConfig()
    const app: Express = express()
    start(app)
}

initialize();