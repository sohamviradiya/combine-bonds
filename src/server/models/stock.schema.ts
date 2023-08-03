import {
    COMPANY_FIELDS,
    COMPANY_FORMS,
    STOCK_CLASS,
    ValuePoint,
} from "types/stock.interface";
import mongoose, { Schema } from "mongoose";

const stockSchema = new Schema(
    {
        name: {
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
                    market_valuation: {
                        type: Schema.Types.Number,
                        required: true,
                    },
                    volume_in_market: {
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
        class: {
            type: Schema.Types.String,
            required: true,
            enum: Object.values(STOCK_CLASS),
        },
        createdAt: {
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

stockSchema.virtual("price").get(function (this: any) {
    if (this.timeline.length < 1) return 0;
    const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
    return last_point.market_valuation / this.gross_volume;
});

stockSchema.virtual("slope").get(function (this: any) {
    if (this.timeline.length < 2) return 0;
    const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
    const second_last_point: ValuePoint = this.timeline[this.timeline.length - 2];
    const diff = last_point.market_valuation - second_last_point.market_valuation;
    return diff / second_last_point.market_valuation;
});

stockSchema.virtual("double_slope").get(function (this: any) {
    if (this.timeline.length < 3) return 0;
    const last_point: ValuePoint = this.timeline[this.timeline.length - 1];
    const second_last_point: ValuePoint = this.timeline[this.timeline.length - 2];
    const last_diff = last_point.market_valuation - second_last_point.market_valuation;

    const last_slope = last_diff / second_last_point.market_valuation;

    const third_last_point: ValuePoint = this.timeline[this.timeline.length - 3];
    const second_last_diff = second_last_point.market_valuation - third_last_point.market_valuation;
    const second_last_slope = second_last_diff / third_last_point.market_valuation;
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