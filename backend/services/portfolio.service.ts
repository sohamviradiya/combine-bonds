import PortfolioInterface, {
	createPortfolioDTO,
	Transaction,
	PortfolioInterfaceWithID,
	PORTFOLIO_STARTING_BALANCE,
	DUMP_THRESHOLD,
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

	const getAll = async () => {
		return (await PortfolioModel.find({}, { _id: 1 }).exec()).map((portfolio) => portfolio._id);
	};

	const get = async (portfolio_id: string): Promise<PortfolioInterfaceWithID> => {
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
		console.log("Evaluating portfolio", portfolio_id);
		const portfolio = await get(portfolio_id);
		const investments = portfolio.investments;
		const date = portfolio.netWorth[portfolio.netWorth.length - 1].date + 1;
		let gross_amount = 0;
		const dumped_stocks: string[] = [];
		const transactions: Transaction[] = [];
		for (let investment of investments) {
			const value = await StockService.getValue(investment.stock);
			const amount = investment.quantity * value.price;
			if (amount < DUMP_THRESHOLD) {
				await StockModel.findByIdAndUpdate(investment.stock, { $pull: { traders: portfolio_id } }).exec();
				dumped_stocks.push(investment.stock);
				transactions.push({
					class: "STOCK SALE",
					stock: investment.stock,
					amount,
					date,
				});
			}
			gross_amount += amount;
		}
		
		await performTransactions(portfolio_id, transactions);

		portfolio.netWorth.push({
			value: portfolio.currentBalance + gross_amount,
			date,
		});

		portfolio.investments = portfolio.investments.filter((investment) => dumped_stocks.includes(investment.stock));

		await PortfolioModel.findByIdAndUpdate(portfolio_id, portfolio, { new: true }).exec();
	};

	const dump = async (portfolio_id: string) => {
		const portfolio = await get(portfolio_id);
		const investments = portfolio.investments;
		const transactions: Transaction[] = [];
		for (let investment of investments) {
			transactions.push({
				class: "STOCK SALE",
				stock: investment.stock,
				amount: investment.quantity * (await StockService.getValue(investment.stock)).price,
				date: await MarketService.getDate(),
			});
		}
		return await performTransactions(portfolio_id, transactions);
	};

	return { evaluate, add, getAll, get, performTransactions, dump };
})();

export default PortfolioService;
