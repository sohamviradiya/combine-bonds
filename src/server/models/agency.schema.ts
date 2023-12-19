import mongoose, { Model, Schema } from "mongoose";

import AgencyInterface, { AGENCY_TYPES } from "@/types/agency.interface";


const AgencySchema = new Schema<AgencyInterface>({
    type: {
        type: Schema.Types.String,
        required: true,
        enum: Object.values(AGENCY_TYPES),
    },
    stock: {
        type: Schema.Types.ObjectId,
        ref: "Stock",
        required: true,
    },
    parameters: {
        steady_increase: {
            type: Schema.Types.Number,
            required: true,
        },
        random_fluctuation: {
            type: Schema.Types.Number,
            required: true,
        },
        market_sentiment: {
            type: Schema.Types.Number,
            required: true,
        },
        market_volume: {
            type: Schema.Types.Number,
            required: true,
        },
        dividend: {
            type: Schema.Types.Number,
            required: true,
        },
    },
});
const AgencyModel = mongoose.models["Agency"] as Model<AgencyInterface> ?? mongoose.model<AgencyInterface>("Agency", AgencySchema);
export default AgencyModel;
