import { IBuyerDocument } from "@salman-eng1/marketplace-shared";
import mongoose, { model, Model, Schema } from "mongoose";

const buyerSchema: Schema=new Schema(
    {
        username: {
        type: String,
        required: true,
        index: true
    },
    
        email: {
        type: String,
        required: true,
        index: true
    },
    profilePicture:{
        type: String,
        required: true,
    },
    country: {
        type: String,
        required: true,
    },
    isSeller: {
        type: Boolean,
        default: false
    },
    purchasedGigs: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Gig'
    }],
    creayedAt:{
        type: Date
    }
},
{
    versionKey: false
}

);

const BuyerModel: Model<IBuyerDocument>= model<IBuyerDocument>('Buyer',buyerSchema,'Buyer')

export {BuyerModel}