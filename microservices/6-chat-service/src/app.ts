import express, { Express } from "express";
import { config } from "@chat/config";
import { databaseConnection } from "@chat/database"
import { start } from "@chat/server";

const initialize = (): void => {
    databaseConnection()
    config.cloudinaryConfig()
    const app: Express = express()
    start(app)
}

initialize();