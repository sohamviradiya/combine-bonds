import mongoose, { Schema } from "mongoose";

import { BOT_STRATEGIES } from "@/types/bot.interface";


const BotSchema = new Schema({
    strategy: {
        type: Schema.Types.String,
        required: true,
        enum: Object.values(BOT_STRATEGIES),
    },
    trade_period: {
        type: Schema.Types.Number,
        required: true,
    },
    portfolio: {
        type: Schema.Types.ObjectId,
        ref: "Portfolio",
        required: true,
    },
    parameters: {
        investment_amount_per_slot: {
            balance: {
                type: Schema.Types.Number,
                required: true,
            },
            market_sentiment: {
                type: Schema.Types.Number,
                required: true,
            },
        },
        bundle: {
            value: {
                type: Schema.Types.Number,
                required: true,
            },
            trending: {
                value: {
                    type: Schema.Types.Number,
                    required: true,
                },
                weights: {
                    type: [
                        {
                            type: Schema.Types.Number,
                            required: true,
                        },
                    ],
                },
            },
            predicted: {
                value: {
                    type: Schema.Types.Number,
                    required: true,
                },
                weights: {
                    type: [
                        {
                            type: Schema.Types.Number,
                            required: true,
                        },
                    ],
                },
            },
            random: {
                value: {
                    type: Schema.Types.Number,
                    required: true,
                },
                weights: {
                    type: [
                        {
                            type: Schema.Types.Number,
                            required: true,
                        },
                    ],
                },
            },
        },
        loss_aversion: {
            type: Schema.Types.Number,
            required: true,
        },
        stock_clearance: {
            type: Schema.Types.Number,
            required: true,
        },
    },
});

const BotModel = mongoose.models["Bot"] ?? mongoose.model("Bot", BotSchema);

export default BotModel;
