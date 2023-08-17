export type ValuePoint = {
    date: number;
    market_valuation: number;
    volume_in_market: number;
    dividend: number;
};

export enum STOCK_CLASS {
    "Voting" = "Voting",
    "Non-Voting" = "Non-Voting",
    "Bond" = "Bond",
    "Debenture" = "Debenture",
}

export const STOCK_CLASS_VALUES = Object.values(STOCK_CLASS);

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

export type STOCK_CLASS_TYPE = keyof typeof STOCK_CLASS;
export type COMPANY_FIELDS_TYPE = keyof typeof COMPANY_FIELDS;
export type COMPANY_FORMS_TYPE = keyof typeof COMPANY_FORMS;
export type StockInterface = {
    symbol: string;
    class: STOCK_CLASS_TYPE;
    gross_volume: number;
    timeline: ValuePoint[];
    createdAt: Date;
    traders: string[];
    company: {
        name: string;
        field: COMPANY_FIELDS_TYPE;
        form: COMPANY_FORMS_TYPE;
        established?: Date;
        description?: string;
        assets?: number;
        headquarters?: string;
        employees?: number;
    }
};

export type StockInterfaceWithId = StockInterface &
    Omit<StockValues, "last_value_point">;

export type StockValues = {
    _id: string;
    slope: number;
    price: number;
    double_slope: number;
    fall_since_peak: number;
    rise_since_trough: number;
    last_value_point: ValuePoint;
};


export type createStockDto = Omit<StockInterface, "createdAt" | "traders">;
