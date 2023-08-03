export enum TRANSACTION_CLASS {
    "ACCOUNT WITHDRAWAL",
    "ACCOUNT DEPOSIT",
    "STOCK PURCHASE",
    "STOCK SALE",
    "STOCK DIVIDEND",
}

export type Investment = {
    stock: string;
    quantity: number;
};

export type Transaction = (
    { class: "ACCOUNT WITHDRAWAL" | "ACCOUNT DEPOSIT" }
    | {
        class: "STOCK PURCHASE" | "STOCK SALE" | "STOCK DIVIDEND";
        stock: string;
    }
) & {
    amount: number;
    date: number;
};

export type NetWorthPoint = {
    value: number;
    date: number;
};

type PortfolioInterface = {
    user?: {
        name: string;
        bio?: string;
        password: string;
    };
    transactions: Transaction[];
    currentBalance: number;
    netWorth: NetWorthPoint[];
    investments: Investment[];
};

export type createPortfolioDTO = Omit<
    PortfolioInterface,
    "transactions" | "netWorth" | "investments" | "currentBalance"
>;

export type PortfolioInterfaceWithID = PortfolioInterface & {
    _id: string;
};

export default PortfolioInterface;
