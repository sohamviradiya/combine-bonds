enum TRANSACTION_CLASS {
	"ACCOUNT WITHDRAWAL",
	"ACCOUNT DEPOSIT",
	"STOCK PURCHASE",
	"STOCK SALE",
}

export type Transaction = {
	class: keyof typeof TRANSACTION_CLASS;
	stock?: string;
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
	investments: {
			stock: string;
			quantity: number;
		}[];
};

export type createPortfolioDTO = Omit<
	PortfolioInterface,
	"transactions" | "netWorth" | "investments" | "currentBalance"
>;

export type PortfolioInterfaceWithID = PortfolioInterface & {
	_id: string;
};

export default PortfolioInterface;
