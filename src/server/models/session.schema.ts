import mongoose, { Schema } from "mongoose";


const SessionSchema = new Schema(
    {
        portfolio: {
            type: Schema.Types.ObjectId,
            ref: "Portfolio",
            required: true,
            unique: true,
        },
        expiration: {
            type: Schema.Types.Date,
            required: true,
        }
    });


const SessionModel =
    mongoose.models["Session"] ?? mongoose.model("Session", SessionSchema);

export default SessionModel;