import mongoose, { Schema } from "mongoose";

const AgencySchema = new Schema({
    type: {
        type: Schema.Types.String,
        required: true,
        enum: ["Steady", "Trendy", "Random", "Aggressive"],
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
const AgencyModel = mongoose.models["Agency"] ?? mongoose.model("Agency", AgencySchema);
export default AgencyModel;
