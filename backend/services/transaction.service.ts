import PortfolioInterface, {
	Transaction,
} from "backend/interfaces/portfolio.interface";
import StockModel from "backend/models/stock.schema";

const TransactionService = (() => {
	const buyStock = async (
		portfolio: PortfolioInterface,
		transaction: Transaction
	): Promise<PortfolioInterface> => {
		if (!transaction.stock) throw new Error("Stock not found");
		if (portfolio.currentBalance < transaction.amount)
			throw new Error("Insufficient funds");
		
		const stockIndex = portfolio.investments.findIndex((investment) => investment.stock === transaction.stock);
		const stock_price = await StockModel.findById(transaction.stock, {
				price: 1,
          }).exec();
          if (stockIndex === -1) {
			const stock_quantity = Math.round(transaction.amount / stock_price.price);
			portfolio.investments.push({stock: transaction.stock,quantity: stock_quantity });
		} else {
			portfolio.investments[stockIndex].quantity += Math.round(
				transaction.amount / stock_price.price
			);
          }
          portfolio.currentBalance -= transaction.amount;
		return portfolio;
     };
     
     const sellStock = async (
          portfolio: PortfolioInterface,
          transaction: Transaction
     ): Promise<PortfolioInterface> => {
          if (!transaction.stock) throw new Error("Stock not found");
          const stockIndex = portfolio.investments.findIndex((investment) => investment.stock === transaction.stock);
          if (stockIndex === -1) throw new Error("Stock not found in portfolio");
          const stock_price = await StockModel.findById(transaction.stock, {
               price: 1,
          }).exec();
          const stock_quantity = Math.round(transaction.amount / stock_price.price);
          if (portfolio.investments[stockIndex].quantity < stock_quantity) throw new Error("Insufficient stocks");
          portfolio.investments[stockIndex].quantity -= stock_quantity;
          portfolio.currentBalance += transaction.amount;
          return portfolio;
     };

     const deposit = async(
          portfolio: PortfolioInterface,
          transaction: Transaction
     ): Promise<PortfolioInterface> => {
          portfolio.currentBalance += transaction.amount;
          return portfolio;
     };

     const withdraw = async(
          portfolio: PortfolioInterface,
          transaction: Transaction
     ): Promise<PortfolioInterface> => {
          if (portfolio.currentBalance < transaction.amount) throw new Error("Insufficient funds");
          portfolio.currentBalance -= transaction.amount;
          return portfolio;
     };
     return {
          buyStock,
          sellStock,
          deposit,
          withdraw,
     };
})();

export default TransactionService;
