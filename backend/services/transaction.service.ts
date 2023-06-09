import PortfolioInterface, { Transaction } from "backend/interfaces/portfolio.interface";
import { StockInterfaceWithID } from "backend/interfaces/stock.interface";
import StockModel from "backend/models/stock.schema";
const TransactionService = (() => {
	const buyStock = async (
		id: string,
		portfolio: PortfolioInterface,
		transaction: Transaction
	): Promise<PortfolioInterface> => {
		if (transaction.class != "STOCK PURCHASE" && transaction.class != "STOCK SALE")
			throw new Error("Invalid transaction class");
		if (!transaction.stock) throw new Error("Stock not found");
		const data = await StockModel.findById(transaction.stock).exec();
		const stock = {
			...data._doc,
			price: data.price,
		} as StockInterfaceWithID;

		if (portfolio.currentBalance < transaction.amount) throw new Error("Insufficient funds");

		const stockIndex = portfolio.investments.findIndex((investment) => investment.stock == transaction.stock);
		const stock_quantity = transaction.amount / stock.price;
		if (stockIndex === -1) {
			portfolio.investments.push({ stock: transaction.stock, quantity: stock_quantity });
			// Add portfolio to stock.traders
			stock.traders.push(id);
		} else {
			portfolio.investments[stockIndex].quantity += stock_quantity;
		}
		stock.timeline[stock.timeline.length - 1].volume_in_market += stock_quantity;

		await StockModel.findByIdAndUpdate(transaction.stock, stock);
		portfolio.currentBalance -= transaction.amount;
		return portfolio;
	};

	const sellStock = async (
		id: string,
		portfolio: PortfolioInterface,
		transaction: Transaction
	): Promise<PortfolioInterface> => {
		if (transaction.class != "STOCK PURCHASE" && transaction.class != "STOCK SALE")
			throw new Error("Invalid transaction class");
		if (!transaction.stock) throw new Error("Stock not found");
		const data = await StockModel.findById(transaction.stock).exec();
		const stock = {
			...data._doc,
			price: data.price,
		} as StockInterfaceWithID;

		const stockIndex = portfolio.investments.findIndex((investment) => investment.stock == transaction.stock);

		if (stockIndex === -1) throw new Error("Stock not found in portfolio");

		const stock_quantity = transaction.amount / stock.price;
		stock.timeline[stock.timeline.length - 1].volume_in_market -= stock_quantity;

		if (portfolio.investments[stockIndex].quantity < stock_quantity) throw new Error("Insufficient stocks");

		// Adjust Balance and quantity
		portfolio.currentBalance += transaction.amount;
		portfolio.investments[stockIndex].quantity -= stock_quantity;

		// Remove stock from portfolio if quantity is less than 0.1
		if (portfolio.investments[stockIndex].quantity < 0.25) {
			portfolio.currentBalance += portfolio.investments[stockIndex].quantity * stock.price;
			stock.timeline[stock.timeline.length - 1].volume_in_market -= portfolio.investments[stockIndex].quantity;
			portfolio.investments.splice(stockIndex, 1);
			stock.traders = stock.traders.filter((trader) => trader != id);
		}

		await StockModel.findByIdAndUpdate(transaction.stock, stock);
		return portfolio;
	};
	const deposit = (portfolio: PortfolioInterface, transaction: Transaction): PortfolioInterface => {
		portfolio.currentBalance += transaction.amount;
		portfolio.netWorth[portfolio.netWorth.length - 1].value += transaction.amount;
		return portfolio;
	};
	const withdraw = (portfolio: PortfolioInterface, transaction: Transaction): PortfolioInterface => {
		if (portfolio.currentBalance < transaction.amount) throw new Error("Insufficient funds");
		portfolio.currentBalance -= transaction.amount;
		portfolio.netWorth[portfolio.netWorth.length - 1].value -= transaction.amount;
		return portfolio;
	};
	return { buyStock, sellStock, deposit, withdraw };
})();
export default TransactionService;
