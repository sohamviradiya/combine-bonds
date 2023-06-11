enum TRANSACTION_CLASS {
	"ACCOUNT WITHDRAWAL",
	"ACCOUNT DEPOSIT",
	"STOCK PURCHASE",
	"STOCK SALE",
}

export type Investment = {
	stock: string;
	quantity: number;
};

export type Transaction = (
	| { class: "ACCOUNT WITHDRAWAL" | "ACCOUNT DEPOSIT" }
	| {
			class: "STOCK PURCHASE" | "STOCK SALE";
			stock: string;
	  }
) & {
	amount: number;
	date: number;
};

type PortfolioInterface = {
	user?: {
		name: string;
		bio?: string;
	};
	transactions: Transaction[];
	currentBalance: number;
	netWorth: {
		value: number;
		date: number;
	}[];
	investments: Investment[];
};

export type createPortfolioDTO = Omit<
	PortfolioInterface,
	"transactions" | "netWorth" | "investments" | "currentBalance"
>;

export type PortfolioInterfaceWithID = PortfolioInterface & {
	_id: string;
};

export const PORTFOLIO_STARTING_BALANCE = 100000;
export const DUMP_THRESHOLD = 10;
export default PortfolioInterface;
