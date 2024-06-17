import { StatusCodes } from "http-status-codes";
import { Request,Response } from "express";


export function health(_req: Request, res: Response){
res.status(StatusCodes.OK).send('Auth Service is Healthy and OK');
    
}