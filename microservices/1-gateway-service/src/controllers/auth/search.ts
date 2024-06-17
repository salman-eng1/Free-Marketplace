import { authService } from "@gateway/services/api/auth.service";
import { AxiosResponse } from "axios";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";



export class Search{
    public async gigById(req: Request, res: Response): Promise<void> {
        const response: AxiosResponse = await authService.getGig(req.params.gigId)
        res.status(StatusCodes.OK).json({message: response.data.message,total: response.data.total ,gig: response.data.gig})
    }
    public async gigs(req:Request, res:Response): Promise<void>{
        const {from , size, type}= req.params
        let query='';
        const objectList=Object.entries(req.query);
        const lastItemIndex= objectList.length -1;
        objectList.forEach(([key,value],index) => {
            query+= `${key}=${value}${index !== lastItemIndex ? '&' : ''}`;
        })
        const response: AxiosResponse = await authService.getGigs(`${query}`, from, size, type)
        res.status(StatusCodes.OK).json({message: response.data.message,total: response.data.total ,gigs: response.data.gigs})
    }
}