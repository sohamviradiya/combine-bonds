import { SessionInterface } from "@/types/session.interface";
import mongoose, { Model, Schema } from "mongoose";


const SessionSchema = new Schema<SessionInterface>(
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
    mongoose.models["Session"] as Model<SessionInterface> ?? mongoose.model<SessionInterface>("Session", SessionSchema);

export default SessionModel;