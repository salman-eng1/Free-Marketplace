import { IBuyerDocument } from "@salman-eng1/marketplace-shared";
import { getBuyerByEmail, getBuyerByUsername } from "@users/services/buyer.service";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

const email= async (req: Request, res: Response): Promise<void>=>{
    const buyer: IBuyerDocument | null= await getBuyerByEmail(req.currentUser!.email)
    res.status(StatusCodes.OK).json({message: 'Buyer Profile', buyer});   
}

const currentUsername= async (req: Request, res: Response): Promise<void>=>{
    const buyer: IBuyerDocument | null= await getBuyerByUsername(req.currentUser!.username)
    res.status(StatusCodes.OK).json({message: 'Buyer profile', buyer})
}

const username= async (req: Request, res: Response): Promise<void>=>{
    const buyer: IBuyerDocument | null= await getBuyerByUsername(req.params.username)
    res.status(StatusCodes.OK).json({message: 'Buyer profile', buyer})
}


export {email, currentUsername, username}