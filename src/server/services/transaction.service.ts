import { PortfolioInterfaceWithID, Transaction } from "@/server/types/portfolio.interface";
import { StockInterfaceWithID } from "@/server/types/stock.interface";
import StockModel from "@/server/models/stock.schema";
const TransactionService = (() => {
	const buyStock = async (id: string, portfolio: PortfolioInterfaceWithID, transaction: Transaction) => {
		if (transaction.class != "STOCK PURCHASE") throw new Error("Invalid transaction class");
		if (!transaction.stock) throw new Error("Stock not found");
		const data = await StockModel.findById(transaction.stock).exec();
		const stock = {
			...data._doc,
			price: data.price,
		} as StockInterfaceWithID;

		if (portfolio.currentBalance < transaction.amount) throw new Error("Insufficient funds");

		const stockIndex = portfolio.investments.findIndex(
			(investment) => String(investment.stock) == String(transaction.stock)
		);
		const stock_quantity: number = transaction.amount / stock.price;
		if (stockIndex === -1) {
			portfolio.investments.push({ stock: transaction.stock, quantity: stock_quantity });
			stock.traders.push(id);
		} else {
			portfolio.investments[stockIndex].quantity += stock_quantity;
		}

		stock.timeline[stock.timeline.length - 1].volume_in_market += stock_quantity;

		await StockModel.findByIdAndUpdate(transaction.stock, stock);
		portfolio.currentBalance -= transaction.amount;
		return portfolio;
	};

	const sellStock = async (id: string, portfolio: PortfolioInterfaceWithID, transaction: Transaction) => {
		if (transaction.class != "STOCK SALE") throw new Error("Invalid transaction class");
		if (!transaction.stock) throw new Error("Stock not found");
		const data = await StockModel.findById(transaction.stock).exec();
		const stock = {
			...data._doc,
			price: data.price,
		} as StockInterfaceWithID;
		const stockIndex = portfolio.investments.findIndex(
			(investment) => String(investment.stock) == String(transaction.stock)
		);

		if (stockIndex === -1) throw new Error("Stock not found in portfolio");

		let stock_quantity = transaction.amount / stock.price;
		stock.timeline[stock.timeline.length - 1].volume_in_market += stock_quantity;

		if (portfolio.investments[stockIndex].quantity < stock_quantity)
			stock_quantity = portfolio.investments[stockIndex].quantity;

		portfolio.currentBalance += transaction.amount;
		portfolio.investments[stockIndex].quantity -= stock_quantity;

		await StockModel.findByIdAndUpdate(transaction.stock, stock);
		return portfolio;
	};

	const deposit = (portfolio: PortfolioInterfaceWithID, transaction: Transaction) => {
		portfolio.currentBalance += transaction.amount;
		portfolio.netWorth[portfolio.netWorth.length - 1].value += transaction.amount;
		return portfolio;
	};
	const withdraw = (portfolio: PortfolioInterfaceWithID, transaction: Transaction) => {
		if (portfolio.currentBalance < transaction.amount) throw new Error("Insufficient funds");
		portfolio.currentBalance -= transaction.amount;
		portfolio.netWorth[portfolio.netWorth.length - 1].value -= transaction.amount;
		return portfolio;
	};
	return { buyStock, sellStock, deposit, withdraw };
})();
export default TransactionService;
