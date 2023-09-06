import {
    PortfolioInterfaceWithID,
    Transaction,
} from "@/types/portfolio.interface";
import { getStockById } from "./stock.service";

export const buyStock = async (
    id: string,
    portfolio: PortfolioInterfaceWithID,
    transaction: Transaction
) => {
    if (transaction.type != "STOCK PURCHASE")
        return portfolio;
    if (!transaction.stock) {
        console.log(transaction);
        return portfolio;
    }
    const stock = await getStockById(transaction.stock);
    const price = stock.timeline[stock.timeline.length - 1].price;

    if (portfolio.balance < transaction.amount)
        return portfolio;

    const stockIndex = portfolio.investments.findIndex(
        (investment) => String(investment.stock) == String(transaction.stock)
    );
    const stock_quantity: number = transaction.amount / price;
    if (stockIndex === -1) {
        portfolio.investments.push({
            stock: transaction.stock,
            quantity: stock_quantity,
        });
    } else {
        portfolio.investments[stockIndex].quantity += stock_quantity;
    }
    portfolio.balance -= transaction.amount;
    return portfolio;
};

export const sellStock = async (
    portfolio: PortfolioInterfaceWithID,
    transaction: Transaction
) => {
    if (transaction.type != "STOCK SALE")
        return portfolio;
    if (!transaction.stock) return portfolio;
    const stock = await getStockById(transaction.stock);
    const price = stock.timeline[stock.timeline.length - 1].price;

    const stockIndex = portfolio.investments.findIndex(
        (investment) => String(investment.stock) == String(transaction.stock)
    );

    if (stockIndex === -1) return portfolio;

    let stock_quantity = transaction.amount / price;

    if (portfolio.investments[stockIndex].quantity < stock_quantity)
        stock_quantity = portfolio.investments[stockIndex].quantity;

    portfolio.balance += transaction.amount;
    portfolio.investments[stockIndex].quantity -= stock_quantity;

    return portfolio;
};

export const deposit = (
    portfolio: PortfolioInterfaceWithID,
    transaction: Transaction
) => {
    portfolio.balance += transaction.amount;
    portfolio.timeline[portfolio.timeline.length - 1].value += transaction.amount;
    return portfolio;
};

export const withdraw = (
    portfolio: PortfolioInterfaceWithID,
    transaction: Transaction
) => {
    if (portfolio.balance < transaction.amount)
        return portfolio;
    portfolio.balance -= transaction.amount;
    portfolio.timeline[portfolio.timeline.length - 1].value -= transaction.amount;
    return portfolio;
};

export const dividend = async (
    portfolio: PortfolioInterfaceWithID,
    transaction: Transaction
) => {
    portfolio.balance += transaction.amount;
    portfolio.timeline[portfolio.timeline.length - 1].value +=
        transaction.amount;
    return portfolio;
};

