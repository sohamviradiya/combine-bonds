import {
	PortfolioInterfaceWithID,
	Transaction,
} from "types/portfolio.interface";
import { StockInterfaceWithId } from "types/stock.interface";
import StockModel from "@/server/models/stock.schema";
const TransactionService = (() => {
	const buyStock = async (
		id: string,
		portfolio: PortfolioInterfaceWithID,
		transaction: Transaction
	) => {
		if (transaction.class != "STOCK PURCHASE")
			return portfolio;
		if (!transaction.stock) {
			console.log(transaction);
			return portfolio;
		}
		const data = await StockModel.findById(transaction.stock).exec();
		const stock = {
			...data._doc,
			price: data.price,
		} as StockInterfaceWithId;

		if (portfolio.currentBalance < transaction.amount)
			return portfolio;

		const stockIndex = portfolio.investments.findIndex(
			(investment) => String(investment.stock) == String(transaction.stock)
		);
		const stock_quantity: number = transaction.amount / stock.price;
		if (stockIndex === -1) {
			portfolio.investments.push({
				stock: transaction.stock,
				quantity: stock_quantity,
			});
			stock.traders.push(id);
		} else {
			portfolio.investments[stockIndex].quantity += stock_quantity;
		}

		stock.timeline[stock.timeline.length - 1].volume_in_market +=
			stock_quantity;

		await StockModel.findByIdAndUpdate(transaction.stock, stock);
		portfolio.currentBalance -= transaction.amount;
		return portfolio;
	};

	const sellStock = async (
		portfolio: PortfolioInterfaceWithID,
		transaction: Transaction
	) => {
		if (transaction.class != "STOCK SALE")
			return portfolio;
		if (!transaction.stock)return portfolio;
		const data = await StockModel.findById(transaction.stock).exec();
		const stock = {
			...data._doc,
			price: data.price,
		} as StockInterfaceWithId;
		const stockIndex = portfolio.investments.findIndex(
			(investment) => String(investment.stock) == String(transaction.stock)
		);

		if (stockIndex === -1) return portfolio;

		let stock_quantity = transaction.amount / stock.price;

		if (portfolio.investments[stockIndex].quantity < stock_quantity)
			stock_quantity = portfolio.investments[stockIndex].quantity;

		portfolio.currentBalance += transaction.amount;
		portfolio.investments[stockIndex].quantity -= stock_quantity;

		stock.timeline[stock.timeline.length - 1].volume_in_market -=
			stock_quantity;

		await StockModel.findByIdAndUpdate(transaction.stock, stock);
		return portfolio;
	};

	const deposit = (
		portfolio: PortfolioInterfaceWithID,
		transaction: Transaction
	) => {
		portfolio.currentBalance += transaction.amount;
		portfolio.netWorth[portfolio.netWorth.length - 1].value +=
			transaction.amount;
		return portfolio;
	};

	const withdraw = (
		portfolio: PortfolioInterfaceWithID,
		transaction: Transaction
	) => {
		if (portfolio.currentBalance < transaction.amount)
			return portfolio;
		portfolio.currentBalance -= transaction.amount;
		portfolio.netWorth[portfolio.netWorth.length - 1].value -=
			transaction.amount;
		return portfolio;
	};

	const dividend = async (
		portfolio: PortfolioInterfaceWithID,
		transaction: Transaction
	) => {
		portfolio.currentBalance += transaction.amount;
		portfolio.netWorth[portfolio.netWorth.length - 1].value +=
			transaction.amount;
		return portfolio;
	};

	return { buyStock, sellStock, deposit, withdraw, dividend };
})();
export default TransactionService;
