import { gigUpdateSchema } from "@gig/schemes/gig";
import { updateActiveGigProp, updateGig } from "@gig/services/gig.service";
import { BadRequestError, isDataURL, ISellerGig, uploads } from "@salman-eng1/marketplace-shared";
import { UploadApiResponse } from "cloudinary";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";


const gigUpdate = async (req: Request, res: Response): Promise<void> => {
    const { error } = await Promise.resolve(gigUpdateSchema.validate(req.body))
    if (error?.details) {
        throw new BadRequestError(error.details[0].message, 'Update gig() method')
    }
    const isDataUrl = isDataURL(req.body.coverImage)
    let coverImage = ''
    if (isDataUrl) {
        const result: UploadApiResponse = await uploads(req.body.coverImage) as UploadApiResponse

        if (!result.public_id) {
            throw new BadRequestError('File upload error. Try again later', 'update gig() method')
        }
        coverImage=result?.secure_url
    }else{
        coverImage= req.body.coverImage
    }
    const gig: ISellerGig = {
        title: req.body.title,
        description: req.body.description,
        categories: req.body.categories,
        subCategories: req.body.subCategories,
        price: req.body.price,
        tags: req.body.tags,
        expectedDelivery: req.body.expectedDelivery,
        basicTitle: req.body.basicTitle,
        basicDescription: req.body.basicDescription,
        coverImage,
    }
    const updatedGigUpdate: ISellerGig = await updateGig(req.params.gigId,gig)

    res.status(StatusCodes.OK).json({ message: 'gig updated successfully.', gig: updatedGigUpdate })
}




const gigUpdateActive = async (req: Request, res: Response): Promise<void> => {
    const updatedGig: ISellerGig = await updateActiveGigProp(req.params.gigId, req.body.active);
    res.status(StatusCodes.OK).json({ message: 'Gig updated successfully.', gig: updatedGig });
  };
export { gigUpdate,gigUpdateActive }
