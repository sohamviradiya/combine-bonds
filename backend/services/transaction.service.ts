import PortfolioInterface, { Transaction } from "backend/interfaces/portfolio.interface";
import StockModel from "backend/models/stock.schema";
import StockService from "./stock.service";
const TransactionService = (() => {
	const buyStock = async (portfolio: PortfolioInterface, transaction: Transaction): Promise<PortfolioInterface> => {
		if (!transaction.stock) throw new Error("Stock not found");
		if (portfolio.currentBalance < transaction.amount) throw new Error("Insufficient funds");
		const stockIndex = portfolio.investments.findIndex((investment) => investment.stock == transaction.stock);
		const { price }: { price: number } = await StockModel.findById(transaction.stock, { price: 1 }).exec();
		if (stockIndex === -1) {
			const stock_quantity = transaction.amount / price;
			await StockService.changeVolume(transaction.stock, stock_quantity);
			portfolio.investments.push({ stock: transaction.stock, quantity: stock_quantity });
		} else portfolio.investments[stockIndex].quantity += Math.round(transaction.amount / price);

		portfolio.currentBalance -= transaction.amount;
		return portfolio;
	};
	const sellStock = async (portfolio: PortfolioInterface, transaction: Transaction): Promise<PortfolioInterface> => {
		if (!transaction.stock) throw new Error("Stock not found");
		const stockIndex = portfolio.investments.findIndex((investment) => investment.stock == transaction.stock);

		if (stockIndex === -1) throw new Error("Stock not found in portfolio");
		const { price }: { price: number } = await StockModel.findById(transaction.stock, { price: 1 }).exec();

		const stock_quantity = transaction.amount / price;
		await StockService.changeVolume(transaction.stock, -stock_quantity /* negative due to sell */);
		if (portfolio.investments[stockIndex].quantity < stock_quantity)
			throw new Error("Insufficient stocks");
		
		portfolio.currentBalance += transaction.amount;
		portfolio.investments[stockIndex].quantity -= stock_quantity;
		
		if (portfolio.investments[stockIndex].quantity < 0.1) {
			portfolio.currentBalance += portfolio.investments[stockIndex].quantity * price;
			portfolio.investments.splice(stockIndex, 1);
		}
		
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
