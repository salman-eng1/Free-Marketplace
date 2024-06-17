import express,{Express} from "express";
import { config } from "./config";
import { databaseConnection } from "@users/database"
import { start } from "@users/server";

const initialize=(): void => {
    databaseConnection()
config.cloudinaryConfig()
const app:Express=express()
start(app)
}

initialize();