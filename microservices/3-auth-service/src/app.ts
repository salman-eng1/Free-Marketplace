import express,{Express} from "express";
import {start} from '@auth/server'
import { databaseConnection } from "./database";

const initialize=():void =>{
const app:Express=express();
databaseConnection()
start(app)
}

initialize()