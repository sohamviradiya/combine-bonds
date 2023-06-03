import PortfolioInterface, {
	createPortfolioDTO,
	Transaction,
	PortfolioInterfaceWithID,
} from "backend/interfaces/portfolio.interface";
import PortfolioModel from "backend/models/portfolio.schema";
import TransactionService from "./transaction.service";
import StockService from "./stock.service";
const PortfolioService = (() => {
	const addPortfolio = async (portfolio: createPortfolioDTO): Promise<PortfolioInterface> => {
		return await new PortfolioModel({
			...portfolio,
			transactions: [],
			currentBalance: 100000,
			netWorth: [
				{
					value: 100000,
					date: 0,
				},
			],
			investments: [],
		}).save();
	};

	const getPortfolios = async (): Promise<PortfolioInterface[]> => {
		return await PortfolioModel.find().exec();
	};

	const getPortfolio = async (portfolio_id: string): Promise<PortfolioInterface> => {
		return await PortfolioModel.findById(portfolio_id).exec();
	};

	const updatePortfolio = async (portfolio: PortfolioInterface, id: string): Promise<PortfolioInterfaceWithID> => {
		return await PortfolioModel.findByIdAndUpdate(id, portfolio, {
			new: true,
		}).exec();
	};

	const performTransaction = async (id: string, transaction: Transaction): Promise<PortfolioInterfaceWithID> => {
		let portfolio = await getPortfolio(id);
		try {
			if (transaction.class === "ACCOUNT DEPOSIT") portfolio = TransactionService.deposit(portfolio, transaction);
			else if (transaction.class === "ACCOUNT WITHDRAWAL")
				portfolio = TransactionService.withdraw(portfolio, transaction);
			else if (transaction.class === "STOCK PURCHASE")
				portfolio = await TransactionService.buyStock(portfolio, transaction);
			else if (transaction.class === "STOCK SALE")
				portfolio = await TransactionService.sellStock(portfolio, transaction);
			else throw new Error("Invalid transaction class");
		} catch (err) {
			throw err;
		}
		portfolio.transactions.push(transaction);
		return await updatePortfolio(portfolio, id);
	};

	const evaluatePortfolio = async (portfolio_id: string) => {
		const portfolio = await getPortfolio(portfolio_id);
		const investments = portfolio.investments;
		const new_stock_amounts = await Promise.all(
			investments.map(async (investment) => {
				const stock_price = (await StockService.getStock(investment.stock)).price;
				return investment.quantity * stock_price;
			})
		);
		const new_net_worth = portfolio.currentBalance + new_stock_amounts.reduce((a, b) => a + b, 0);
		portfolio.netWorth.push({
			value: new_net_worth,
			date: portfolio.netWorth.length,
		});
	};

	return {
		evaluatePortfolio,
		addPortfolio,
		getPortfolios,
		getPortfolio,
		performTransaction,
	};
})();

export default PortfolioService;
