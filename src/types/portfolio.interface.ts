export enum TRANSACTION_TYPES {
    "ACCOUNT_WITHDRAWAL" = "ACCOUNT_WITHDRAWAL",
    "ACCOUNT_DEPOSIT" = "ACCOUNT_DEPOSIT",
    "STOCK_PURCHASE" = "STOCK_PURCHASE",
    "STOCK_SALE" = "STOCK_SALE",
    "STOCK_DIVIDEND" = "STOCK_DIVIDEND",
}

export type Investment = {
    stock: string;
    quantity: number;
};

export type Transaction = (
    { type: "ACCOUNT_WITHDRAWAL" | "ACCOUNT_DEPOSIT" }
    | {
        type: "STOCK_PURCHASE" | "STOCK_SALE" | "STOCK_DIVIDEND";
        stock: string;
    }
) & {
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
