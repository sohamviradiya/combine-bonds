export enum TRANSACTION_TYPES {
    "STOCK_PURCHASE" = "STOCK_PURCHASE",
    "STOCK_SALE" = "STOCK_SALE",
    "STOCK_DIVIDEND" = "STOCK_DIVIDEND",
}

export type Investment = {
    stock: string;
    quantity: number;
};

export type PopulatedInvestment = Investment & {
    amount: number;
    change: number;
};

export type Transaction = {
    type: keyof typeof TRANSACTION_TYPES;
    stock: string;
    amount: number;
    date: number;
};

export type NetWorth = {
    value: number;
    date: number;
};

export type User = {
    name: string;
    bio?: string;
    password: string;
};

interface PortfolioInterface {
    user?: User;
    transactions: Transaction[];
    balance: number;
    timeline: NetWorth[];
    investments: Investment[];
};

export type PortfolioInterfaceWithID = PortfolioInterface & {
    _id: string;
};

export default PortfolioInterface;
