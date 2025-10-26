import mongoose,{Schema,model} from "mongoose"

const passwordResetTokenSchema=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    token:{
        type:String,
        required:true
    },
    expiresAt:{
        type:Date,
        required:true
    },
})

export const ResetToken=model("PasswordResetToken",passwordResetTokenSchema)
