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
    "Real Estate" = "Real Estate",
    "Insurance" = "Insurance",
    "Wholesale" = "Wholesale",
    "Retail" = "Retail",
    "Public Administration" = "Public Administration",
}

export enum COMPANY_FORMS {
    "Sole Proprietorship" = "Sole Proprietorship",
    "Partnership" = "Partnership",
    "Corporation" = "Corporation",
    "Cooperative" = "Cooperative",
    "Franchise" = "Franchise",
    "Joint Venture" = "Joint Venture",
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
    _id: string;
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


export type createStockDto = Omit<StockInterface, "createdAt" | "traders">;
