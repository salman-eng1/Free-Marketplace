import { signupSchema } from "@auth/schemes/signup";
import { getUserByUsernameOrEmail } from "@auth/services/auth.service";
import { BadRequestError, IAuthDocument } from "@salman-eng1/marketplace-shared";
import { Request, Response } from "express";
import { v4 as uuidV4} from 'uuid'

export async function create(req: Request, res: Response): Promise<void>{

    const {error}=await Promise.resolve(signupSchema.validate(req.body))

    if(error?.details){
        throw new BadRequestError(error.details[0].message,'SignUp() create method error')
    }
    const {username,email,password,country,profilePicture} =req.body;
    const checkIfUserExist: IAuthDocument=await getUserByUsernameOrEmail(username,email)
    if(checkIfUserExist){
        throw new BadRequestError('Invalid Credentials. Email or Password','SignUp() createn method error')
    }
    const profilePublicId=uuidV4()
}