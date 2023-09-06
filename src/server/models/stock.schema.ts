import {
    COMPANY_FIELDS,
    COMPANY_FORMS,
    ValuePoint,
} from "@/types/stock.interface";
import mongoose, { Schema } from "mongoose";

const stockSchema = new Schema(
    {
        symbol: {
            type: Schema.Types.String,
            required: true,
        },
        gross_volume: {
            type: Schema.Types.Number,
            required: true,
        },
        timeline: {
            type: [
                {
                    date: {
                        type: Schema.Types.Number,
                        required: true,
                    },
                    price: {
                        type: Schema.Types.Number,
                        required: true,
                    },
                    volume: {
                        type: Schema.Types.Number,
                        required: true,
                    },
                    dividend: {
                        type: Schema.Types.Number,
                        required: true,
                    },
                },
            ],
        },
        issued: {
            type: Schema.Types.Date,
            required: false,
        },
        company: {
            name: {
                type: Schema.Types.String,
                required: true,
            },
            field: {
                type: Schema.Types.String,
                required: true,
                enum: Object.values(COMPANY_FIELDS),
            },
            form: {
                type: Schema.Types.String,
                required: true,
                enum: Object.values(COMPANY_FORMS),
            },
            established: {
                type: Schema.Types.Date,
                required: false,
            },
            description: {
                type: Schema.Types.String,
                required: false,
            },
            assets: {
                type: Schema.Types.Number,
                required: false,
            },
            headquarters: {
                type: Schema.Types.String,
                required: false,
            },
            employees: {
                type: Schema.Types.Number,
                required: false,
            }
        },
        traders: {
            type: [
                {
                    type: Schema.Types.ObjectId,
                    ref: "Portfolio",
                    required: true,
                },
            ],
        },
    },
    { toJSON: { virtuals: true } }
);

stockSchema.virtual("market_valuation").get(function (this: any) {
    if (this.timeline.length < 1) return 0;
    const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
    return last_point.price * this.gross_volume;
});

stockSchema.virtual("slope").get(function (this: any) {
    if (this.timeline.length < 2) return 0;
    const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
    const second_last_point: ValuePoint = this.timeline[this.timeline.length - 2];
    const diff = last_point.price - second_last_point.price;
    return diff / second_last_point.price;
});

stockSchema.virtual("double_slope").get(function (this: any) {
    if (this.timeline.length < 3) return 0;
    const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
    const second_last_point: ValuePoint = this.timeline[this.timeline.length - 2];
    const last_diff = last_point.price - second_last_point.price;

    const last_slope = last_diff / second_last_point.price;

    const third_last_point: ValuePoint = this.timeline[this.timeline.length - 3];
    const second_last_diff = second_last_point.price - third_last_point.price;
    const second_last_slope = second_last_diff / third_last_point.price;
    const slope_diff = last_slope - second_last_slope;
    return slope_diff / second_last_slope;
});

stockSchema.virtual("fall_since_peak").get(function (this: any) {
    if (this.timeline.length < 2) return 0;
    const latest_market_valuation =
        this.timeline[this.timeline.length - 1].market_valuation;
    let k = this.timeline.length - 2;
    while (
        k >= 0 &&
        this.timeline[k].market_valuation >= this.timeline[k + 1].market_valuation
    ) k--;
    const diff = latest_market_valuation - this.timeline[k + 1].market_valuation;
    return -diff / this.timeline[k + 1].market_valuation;
});

stockSchema.virtual("rise_since_trough").get(function (this: any) {
    if (this.timeline.length < 2) return 0;
    const latest_market_valuation =
        this.timeline[this.timeline.length - 1].market_valuation;
    let k = this.timeline.length - 2;
    while (
        k >= 0 &&
        this.timeline[k].market_valuation <= this.timeline[k + 1].market_valuation
    )
        k--;
    const diff = latest_market_valuation - this.timeline[k + 1].market_valuation;
    return diff / this.timeline[k + 1].market_valuation;
});

const StockModel = mongoose.models["Stock"] ?? mongoose.model("Stock", stockSchema);

export default StockModel;