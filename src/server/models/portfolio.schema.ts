import mongoose, { Model, Schema } from "mongoose";
import PortfolioInterface, { TRANSACTION_TYPES } from "@/types/portfolio.interface";

const PortfolioSchema = new Schema<PortfolioInterface>({
    user: {
        type: {
            name: {
                type: Schema.Types.String,
                required: true,
                unique: true,
            },
            bio: {
                type: Schema.Types.String,
                required: false,
            },
            password: {
                type: Schema.Types.String,
                required: true,
            },
        },
        required: false,
    },
    transactions: [
        {
            type: {
                type: Schema.Types.String,
                required: true,
                enum: Object.values(TRANSACTION_TYPES),
            },
            stock: {
                type: Schema.Types.ObjectId,
                ref: "Stock",
                required: false,
            },
            amount: {
                type: Schema.Types.Number,
                required: true,
            },
            date: {
                type: Schema.Types.Number,
                required: true,
            },
        },
    ],
    balance: {
        type: Schema.Types.Number,
        required: true,
    },
    timeline: {
        type: [
            {
                value: {
                    type: Schema.Types.Number,
                    required: true,
                },
                date: {
                    type: Schema.Types.Number,
                    required: true,
                },
            },
        ],
    },
    investments: {
        type: [
            {
                stock: {
                    type: Schema.Types.ObjectId,
                    ref: "Stock",
                },
                quantity: {
                    type: Schema.Types.Number,
                },
            },
        ],
    },
});

const PortfolioModel =
    mongoose.models["Portfolio"] as Model<PortfolioInterface> ?? mongoose.model<PortfolioInterface>("Portfolio", PortfolioSchema);

export default PortfolioModel;
