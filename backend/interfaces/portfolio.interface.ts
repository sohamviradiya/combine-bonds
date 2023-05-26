enum TRANSACTION_CLASS {
	"ACCOUNT WITHDRAWAL",
	"ACCOUNT DEPOSIT",
	"STOCK PURCHASE",
	"STOCK SALE",
	"STOCK DIVIDEND",
}

type portfolioInterface = {
	user?: {
		name: String;
		bio?: String;
	};
	transactions: [
		{
			class: TRANSACTION_CLASS;
			stock?: String;
			amount: Number;
			date: Date;
		}
	];
	currentBalance: Number;
	netWorth: [
		{
			value: Number;
			date: Date;
		}
	];
	investments: [
		{
			stock: String;
			quantity: Number;
		}
	];
};

export default portfolioInterface;
