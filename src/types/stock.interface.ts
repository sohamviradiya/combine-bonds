import { ObjectId } from "mongoose";

export type ValuePoint = {
    date: number;
    price: number;
    volume: number;
    dividend: number;
};

export enum COMPANY_FIELDS {
    "Agriculture" = "Agriculture",
    "Mining" = "Mining",
    "Construction" = "Construction",
    "Manufacturing" = "Manufacturing",
    "Transportation" = "Transportation",
    "Communication" = "Communication",
    "Entertainment" = "Entertainment",
    "Utilities" = "Utilities",
    "Finance" = "Finance",
    "Real_Estate" = "Real_Estate",
    "Insurance" = "Insurance",
    "Wholesale" = "Wholesale",
    "Retail" = "Retail",
    "Public_Administration" = "Public_Administration",
}

export enum COMPANY_FORMS {
    "Sole_Proprietorship" = "Sole_Proprietorship",
    "Partnership" = "Partnership",
    "Corporation" = "Corporation",
    "Cooperative" = "Cooperative",
    "Franchise" = "Franchise",
    "Joint_Venture" = "Joint_Venture",
    "Other" = "Other",
}

export type COMPANY_FIELD = keyof typeof COMPANY_FIELDS;
export type COMPANY_FORM = keyof typeof COMPANY_FORMS;
export interface StockInterface {
    symbol: string;
    gross_volume: number;
    timeline: ValuePoint[];
    issued: Date;
    traders: string[];
    company: {
        name: string;
        field: COMPANY_FIELD;
        form: COMPANY_FORM;
        established?: Date;
        description?: string;
        assets?: number;
        headquarters?: string;
        employees?: number;
    }
};

export type StockInterfaceWithId = StockInterface &
{
    _id: string | ObjectId;
};

export type StockValues = {
    _id: string;
    slope: number;
    timeline: ValuePoint[];
    market_valuation: number;
    double_slope: number;
    fall_since_peak: number;
    rise_since_trough: number;
    last_value_point: ValuePoint;
};


export type createStockDto = Omit<StockInterface, "issued" | "traders">;
