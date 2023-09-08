import { PortfolioInterfaceWithID, Transaction, } from "@/types/portfolio.interface";
import { getStockById, pushTrader } from "@/server/services/stock.service";


export const buyStock = async (portfolio: PortfolioInterfaceWithID, transaction: Transaction) => {
    if (transaction.type != "STOCK_PURCHASE" || transaction.amount < 0 || transaction.amount > portfolio.balance)
        return portfolio;
    console.log(transaction);

    const stock = await getStockById(transaction.stock);
    const price = stock.timeline[stock.timeline.length - 1].price;

    const stock_quantity = transaction.amount / price;

    if (portfolio.balance < transaction.amount)
        return portfolio;

    const stockIndex = portfolio.investments.findIndex((investment) => String(investment.stock) == String(transaction.stock));


    if (stockIndex === -1) {
        portfolio.investments.push({
            stock: transaction.stock,
            quantity: stock_quantity,
        });
        await pushTrader(transaction.stock, portfolio._id);
    } else 
        portfolio.investments[stockIndex].quantity += stock_quantity;
    portfolio.balance -= transaction.amount;
    return portfolio;
};

export const sellStock = async (portfolio: PortfolioInterfaceWithID, transaction: Transaction) => {
    if (transaction.type != "STOCK_SALE")
        return portfolio;
    console.log(transaction);
    const stock = await getStockById(transaction.stock);
    const price = stock.timeline[stock.timeline.length - 1].price;

    const stockIndex = portfolio.investments.findIndex((investment) => String(investment.stock) == String(transaction.stock));

    if (stockIndex === -1) return portfolio;

    let stock_quantity = transaction.amount / price;

    if (portfolio.investments[stockIndex].quantity < stock_quantity)
        stock_quantity = portfolio.investments[stockIndex].quantity;

    portfolio.balance += transaction.amount;
    portfolio.investments[stockIndex].quantity -= stock_quantity;

    return portfolio;
};

export const dividend = async (portfolio: PortfolioInterfaceWithID, transaction: Transaction) => {
    portfolio.balance += transaction.amount;
    return portfolio;
};

