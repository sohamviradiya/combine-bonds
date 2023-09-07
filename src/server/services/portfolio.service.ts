import { User, Transaction, PortfolioInterfaceWithID, } from "@/types/portfolio.interface";
import PortfolioModel from "@/server/models/portfolio.schema";

import { buyStock, sellStock, deposit, withdraw, dividend } from "@/server/services/transaction.service";

import StockModel from "@/server/models/stock.schema";
import { getStockAnalytics } from "@/server/services/stock.service";

import { DATE_LIMIT, PORTFOLIO_STARTING_BALANCE, STOCK_DUMP_THRESHOLD } from "@/server/global.config";


export const addPortfolio = async (user: User,): Promise<PortfolioInterfaceWithID> => {
    return await new PortfolioModel({
        user,
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

export const verifyIDPassWord = async (name: string, password: string) => {
    const portfolio: PortfolioInterfaceWithID = await PortfolioModel.findOne({ "user.name": name, }).exec();

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

export const getAllPortfolios = async () => {
    return (await PortfolioModel.find({}, { _id: 1 }).exec()).map((portfolio) => portfolio._id) as string[];
};

export const getPortfolioById = async (portfolio_id: string): Promise<PortfolioInterfaceWithID> => {
    return await PortfolioModel.findById(portfolio_id).exec();
};

export const performTransactions = async (id: string, transactions: Transaction[]): Promise<PortfolioInterfaceWithID> => {
    let portfolio = await getPortfolioById(id);
    for (let transaction of transactions) {
        if (transaction.type === "ACCOUNT_DEPOSIT")
            portfolio = deposit(portfolio, transaction);
        else if (transaction.type === "ACCOUNT_WITHDRAWAL")
            portfolio = withdraw(portfolio, transaction);
        else if (transaction.type === "STOCK_PURCHASE")
            portfolio = await buyStock(portfolio, transaction);
        else if (transaction.type === "STOCK_SALE")
            portfolio = await sellStock(portfolio, transaction);
        else if (transaction.type === "STOCK_DIVIDEND")
            portfolio = await dividend(portfolio, transaction);
        else throw new Error("Invalid transaction class");

        portfolio.transactions.push(transaction);
    }

    return await PortfolioModel.findByIdAndUpdate(id,
        {
            currentBalance: portfolio.balance,
            investments: portfolio.investments,
            transactions: portfolio.transactions,
        },
        { new: true }
    ).exec();
};

export const evaluatePortfolio = async (portfolio_id: string, date: number) => {
    const portfolio = await getPortfolioById(portfolio_id);
    const investments = portfolio.investments;
    let gross_amount = 0;
    const dumped_stocks: string[] = [];
    const transactions: Transaction[] = [];

    await Promise.all(
        investments.map(async (investment) => {
            const stock = await getStockAnalytics(investment.stock);
            const amount = investment.quantity * stock.price;
            gross_amount += amount;
            if (amount < STOCK_DUMP_THRESHOLD) {
                await StockModel.findByIdAndUpdate(investment.stock, {
                    $pull: { traders: String(portfolio_id) },
                }).exec();

                dumped_stocks.push(String(investment.stock));

                transactions.push({
                    type: "STOCK_SALE",
                    stock: investment.stock,
                    amount,
                    date,
                });
            } else {

                transactions.push({
                    type: "STOCK_DIVIDEND",
                    stock: investment.stock,
                    amount: investment.quantity * stock.dividend,
                    date,
                });
            }
        })
    );
    await performTransactions(portfolio_id, transactions);

    portfolio.transactions = portfolio.transactions.filter((transaction) => transaction.date > date - DATE_LIMIT);

    portfolio.timeline = portfolio.timeline.filter((value) => value.date > date - DATE_LIMIT);

    portfolio.timeline.push({ value: portfolio.balance + gross_amount, date, });

    portfolio.investments = portfolio.investments.filter((investment) => !dumped_stocks.includes(String(investment.stock)));

    await PortfolioModel.findByIdAndUpdate(
        portfolio_id,
        {
            timeline: portfolio.timeline,
            investments: portfolio.investments,
            transactions: portfolio.transactions,
        },
        { new: true }
    ).exec();

    return portfolio.timeline[portfolio.timeline.length - 1];
};

export const dumpPortfolio = async (portfolio_id: string, date: number) => {
    const portfolio = await getPortfolioById(portfolio_id);
    const investments = portfolio.investments;
    const transactions: Transaction[] = [];
    await Promise.all(
        investments.map(async (investment) => {
            const stock_price = (await getStockAnalytics(investment.stock)).price;
            transactions.push({
                type: "STOCK_SALE",
                stock: investment.stock,
                amount: investment.quantity * stock_price,
                date,
            });
        })
    );
    return await performTransactions(portfolio_id, transactions);
};
