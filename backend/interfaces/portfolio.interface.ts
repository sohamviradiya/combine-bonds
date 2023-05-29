enum TRANSACTION_CLASS {
	"ACCOUNT WITHDRAWAL",
	"ACCOUNT DEPOSIT",
	"STOCK PURCHASE",
	"STOCK SALE",
	"STOCK DIVIDEND",
}

type PortfolioInterface = {
	user?: {
		name: String;
		bio?: String;
	};
	transactions: [
		{
			class: TRANSACTION_CLASS;
			stock?: String;
			amount: Number;
			date: Number;
		}
	];
	currentBalance: Number;
	netWorth: [
		{
			value: Number;
			date: Number;
		}
	];
	investments: [
		{
			stock: String;
			quantity: Number;
		}
	];
};

export default PortfolioInterface;
