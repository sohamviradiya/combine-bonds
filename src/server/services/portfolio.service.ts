import PortfolioInterface, {
	createPortfolioDTO,
	Transaction,
	PortfolioInterfaceWithID,
	PORTFOLIO_STARTING_BALANCE,
	STOCK_DUMP_THRESHOLD,
} from "@/server/types/portfolio.interface";
import PortfolioModel from "@/server/models/portfolio.schema";
import TransactionService from "./transaction.service";
import StockModel from "@/server/models/stock.schema";
import StockService from "./stock.service";
import { DATE_LIMIT } from "@/server/types/market.interface";

const PortfolioService = (() => {
	const add = async (
		portfolio: createPortfolioDTO
	): Promise<PortfolioInterface> => {
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

	const verify = async (name: string, password: string) => {
		const portfolio: PortfolioInterfaceWithID = await PortfolioModel.findOne({
			"user.name": name,
		}).exec();
		if (!portfolio.user)
			return {
				message: "User not found",
			};
		if (portfolio.user.password !== password)
			return {
				message: "Incorrect password",
			};
		return {
			message: "Success",
			portfolio: portfolio._id,
		};
	};

	const getAll = async () => {
		return (await PortfolioModel.find({}, { _id: 1 }).exec()).map(
			(portfolio) => portfolio._id
		) as string[];
	};

	const get = async (
		portfolio_id: string
	): Promise<PortfolioInterfaceWithID> => {
		return await PortfolioModel.findById(portfolio_id).exec();
	};

	const performTransactions = async (
		id: string,
		transactions: Transaction[]
	): Promise<PortfolioInterfaceWithID> => {
		let portfolio = await get(id);
		for (let transaction of transactions) {
			try {
				if (transaction.class === "ACCOUNT DEPOSIT")
					portfolio = TransactionService.deposit(portfolio, transaction);
				else if (transaction.class === "ACCOUNT WITHDRAWAL")
					portfolio = TransactionService.withdraw(portfolio, transaction);
				else if (transaction.class === "STOCK PURCHASE")
					portfolio = await TransactionService.buyStock(
						id,
						portfolio,
						transaction
					);
				else if (transaction.class === "STOCK SALE")
					portfolio = await TransactionService.sellStock(
						portfolio,
						transaction
					);
				else if (transaction.class === "STOCK DIVIDEND")
					portfolio = await TransactionService.dividend(portfolio, transaction);
				else throw new Error("Invalid transaction class");
			} catch (err) {
				throw err;
			}
			portfolio.transactions.push(transaction);
		}
		return await PortfolioModel.findByIdAndUpdate(
			id,
			{
				currentBalance: portfolio.currentBalance,
				investments: portfolio.investments,
				transactions: portfolio.transactions,
			},
			{ new: true }
		).exec();
	};

	const evaluate = async (portfolio_id: string, date: number) => {
		const portfolio = await get(portfolio_id);
		const investments = portfolio.investments;
		let gross_amount = 0;
		const dumped_stocks: string[] = [];
		const transactions: Transaction[] = [];
		await Promise.all(
			investments.map(async (investment) => {
				const stock = await StockService.getValue(investment.stock);
				const amount = investment.quantity * stock.price;
				gross_amount += amount;
				if (amount < STOCK_DUMP_THRESHOLD) {
					await StockModel.findByIdAndUpdate(investment.stock, {
						$pull: { traders: portfolio_id },
					}).exec();
					dumped_stocks.push(String(investment.stock));
					transactions.push({
						class: "STOCK SALE",
						stock: investment.stock,
						amount,
						date,
					});
				} else {
					transactions.push({
						class: "STOCK DIVIDEND",
						stock: investment.stock,
						amount: investment.quantity * stock.last_value_point.dividend,
						date,
					});
				}
			})
		);
		await performTransactions(portfolio_id, transactions);

		portfolio.transactions.filter(
			(transaction) => transaction.date > date - DATE_LIMIT
		);

		portfolio.netWorth = portfolio.netWorth.filter(
			(value) => value.date > date - DATE_LIMIT
		);
		portfolio.netWorth.push({
			value: portfolio.currentBalance + gross_amount,
			date,
		});

		portfolio.investments = portfolio.investments.filter(
			(investment) => !dumped_stocks.includes(String(investment.stock))
		);

		await PortfolioModel.findByIdAndUpdate(
			portfolio_id,
			{
				netWorth: portfolio.netWorth,
				investments: portfolio.investments,
			},
			{ new: true }
		).exec();
		return portfolio.netWorth[portfolio.netWorth.length - 1];
	};

	const dump = async (portfolio_id: string, date: number) => {
		const portfolio = await get(portfolio_id);
		const investments = portfolio.investments;
		const transactions: Transaction[] = [];
		await Promise.all(
			investments.map(async (investment) => {
				const stock_price = (await StockService.getValue(investment.stock))
					.price;
				transactions.push({
					class: "STOCK SALE",
					stock: investment.stock,
					amount: investment.quantity * stock_price,
					date,
				});
			})
		);
		return await performTransactions(portfolio_id, transactions);
	};

	return { evaluate, add, getAll, get, performTransactions, dump, verify };
})();

export default PortfolioService;
