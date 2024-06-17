import { StatusCodes } from "http-status-codes";
import { Request,Response } from "express";


const health=(_req: Request, res: Response): void=>{
res.status(StatusCodes.OK).send('Users Service is Healthy and OK');
    
}

export{health}