import PortfolioInterface, {
	createPortfolioDTO,
	Transaction,
	PortfolioInterfaceWithID,
	PORTFOLIO_STARTING_BALANCE,
} from "backend/interfaces/portfolio.interface";
import PortfolioModel from "backend/models/portfolio.schema";
import TransactionService from "./transaction.service";
import StockModel from "backend/models/stock.schema";
import StockService from "./stock.service";
import MarketService from "./market.service";

const PortfolioService = (() => {
	const add = async (portfolio: createPortfolioDTO): Promise<PortfolioInterface> => {
		return await new PortfolioModel({
			...portfolio,
			transactions: [],
			currentBalance: PORTFOLIO_STARTING_BALANCE,
			netWorth: [
				{
					value: PORTFOLIO_STARTING_BALANCE,
					date: 0,
				},
			],
			investments: [],
		}).save();
	};

	const getAll = async (): Promise<PortfolioInterface[]> => {
		return await PortfolioModel.find().exec();
	};

	const get = async (portfolio_id: string): Promise<PortfolioInterface> => {
		return await PortfolioModel.findById(portfolio_id).exec();
	};

	const performTransactions = async (id: string, transactions: Transaction[]): Promise<PortfolioInterfaceWithID> => {
		let portfolio = await get(id);
		for (let transaction of transactions) {
			try {
				if (transaction.class === "ACCOUNT DEPOSIT") portfolio = TransactionService.deposit(portfolio, transaction);
				else if (transaction.class === "ACCOUNT WITHDRAWAL")
					portfolio = TransactionService.withdraw(portfolio, transaction);
				else if (transaction.class === "STOCK PURCHASE")
					portfolio = await TransactionService.buyStock(id, portfolio, transaction);
				else if (transaction.class === "STOCK SALE")
					portfolio = await TransactionService.sellStock(id, portfolio, transaction);
				else throw new Error("Invalid transaction class");
			} catch (err) {
				throw err;
			}
			portfolio.transactions.push(transaction);
		}
		return await PortfolioModel.findByIdAndUpdate(id, portfolio, { new: true }).exec();
	};

	const evaluate = async (portfolio_id: string) => {
		const portfolio = await get(portfolio_id);
		const investments = portfolio.investments;
		const new_stock_amounts = await Promise.all(
			investments.map(async (investment) => {
				const data = await StockModel.findById(investment.stock).exec();
				return investment.quantity * data.price;
			})
		);
		const new_net_worth = portfolio.currentBalance + new_stock_amounts.reduce((a, b) => a + b, 0);
		portfolio.netWorth.push({
			value: new_net_worth,
			date: portfolio.netWorth.length,
		});
	};

	const dump = async (portfolio_id: string) => {
		const portfolio = await get(portfolio_id);
		const investments = portfolio.investments;
		const transactions: Transaction[] = [];
		investments.forEach(async (investment) => {
			transactions.push({
				class: "STOCK SALE",
				stock: investment.stock,
				amount: investment.quantity * (await StockService.getValue(investment.stock)).price,
				date: await MarketService.getDate(),
			});
		});
		return await performTransactions(portfolio_id, transactions);
	};

	return { evaluate, add, getAll, get, performTransactions, dump };
})();

export default PortfolioService;
