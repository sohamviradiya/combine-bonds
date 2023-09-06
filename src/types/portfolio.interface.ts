export enum TRANSACTION_TYPES {
    "ACCOUNT WITHDRAWAL" = "ACCOUNT WITHDRAWAL",
    "ACCOUNT DEPOSIT" = "ACCOUNT DEPOSIT",
    "STOCK PURCHASE" = "STOCK PURCHASE",
    "STOCK SALE" = "STOCK SALE",
    "STOCK DIVIDEND" = "STOCK DIVIDEND",
}

export type Investment = {
    stock: string;
    quantity: number;
};

export type Transaction = (
    { type: "ACCOUNT WITHDRAWAL" | "ACCOUNT DEPOSIT" }
    | {
        type: "STOCK PURCHASE" | "STOCK SALE" | "STOCK DIVIDEND";
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
