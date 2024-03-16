import { authService } from "@gateway/services/api/auth.service";
import { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";



export class Search{
    public async gigById(req:Request, res:Response): Promise<void>{
        const response: AxiosResponse = await authService.getGig(req.params.gigId)
        res.status(StatusCodes.OK).json({message: response.data.message, gig: response.data.gig})
    }
}