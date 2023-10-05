import PortfolioInterface, { User, Transaction, PortfolioInterfaceWithID, NetWorth, Investment, } from "@/types/portfolio.interface";
import PortfolioModel from "@/server/models/portfolio.schema";

import { buyStock, sellStock, dividend } from "@/server/services/transaction.service";

import { getStockAnalytics, getStockBasicInfo, pullTrader } from "@/server/services/stock.service";

import { DATE_LIMIT, PORTFOLIO_STARTING_BALANCE, STOCK_DUMP_THRESHOLD } from "@/global.config";
import { getDate } from "@/server/services/market.service";

export const addPortfolio = async (user: User): Promise<{ message: string, portfolio: PortfolioInterfaceWithID | null }> => {
    try {
        const date = await getDate();
        const portfolio = await new PortfolioModel({
            user,
            transactions: [],
            balance: PORTFOLIO_STARTING_BALANCE,
            timeline: [
                {
                    value: PORTFOLIO_STARTING_BALANCE,
                    date,
                },
            ],
            investments: [],
        } as PortfolioInterface).save();
        return {
            message: "Success",
            portfolio: castPortfolio(portfolio),
        };
    }
    catch (err: any) {
        if (err.code === 11000) return {
            message: "User already exists",
            portfolio: null,
        }
        else
            return {
                message: err.message,
                portfolio: null,
            }
    };
};

function castPortfolio(portfolio: any): PortfolioInterfaceWithID {
    return {
        _id: String(portfolio._id),
        timeline: portfolio.timeline.map((point: any) => ({
            date: point.date,
            value: point.value,
        })),
        transactions: portfolio.transactions.map((transaction: any) => ({
            type: transaction.type,
            stock: String(transaction.stock),
            amount: transaction.amount,
            date: transaction.date,
        })),
        investments: portfolio.investments.map((investment: any) => ({
            stock: String(investment.stock),
            quantity: investment.quantity,
        })),
        balance: portfolio.balance,
        user: {
            name: portfolio.user.name,
            password: portfolio.user.password,
        },
    }
}

export const verifyIDPassword = async (name: string, password: string) => {
    const portfolio: PortfolioInterfaceWithID = await PortfolioModel.findOne({ "user.name": name }, { user: true }).exec();
    if (!portfolio?.user)
        return {
            message: "User not found",
        };

    if (portfolio?.user?.password !== password)
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

export const getPosition = async (stock_id: string, portfolio_id: string) => {
    if (!stock_id || !portfolio_id) return null;
    const stock = await getStockBasicInfo(stock_id);
    const { investments, balance }: { investments: Investment[], balance: number } = await PortfolioModel.findById(portfolio_id, { investments: 1, balance: 1 }).exec();
    const spending_limit = Math.max(balance / 10, Math.min(100, balance));
    const investment = investments.find((investment) => String(investment.stock) === stock_id);
    if (!investment) return {
        amount: 0,
        balance: spending_limit,
        price: stock.price,
    };
    return {
        amount: investment.quantity * stock.price,
        balance: spending_limit,
        price: stock.price,
    }
};

export const getPortfolioById = async (portfolio_id: string): Promise<PortfolioInterfaceWithID> => {
    return castPortfolio(await PortfolioModel.findById(portfolio_id).exec());
};

export const getPortfolioTransactions = async (portfolio_id: string, page: number = 0) => {
    const portfolio = await getPortfolioById(portfolio_id);
    const transactions = portfolio.transactions;
    const start = page * 4;
    const end = start + 4;
    const date = await getDate();
    transactions.sort((a, b) => b.date == a.date ? b.amount - a.amount : b.date - a.date);
    return transactions.slice(start, end).map((transaction) => ({
        ...transaction,
        date: date - transaction.date,
    }));
};

export const getPortfolioInvestments = async (portfolio_id: string, page: number = 0) => {
    const portfolio = await getPortfolioById(portfolio_id);
    const investments = portfolio.investments;
    const start = page * 4;
    const end = start + 4;
    const paginated_investments = investments.slice(start, end);
    const populated_investments = await Promise.all(
        paginated_investments.map(async (investment) => {
            const stock = await getStockBasicInfo(investment.stock);
            return {
                stock: stock._id,
                quantity: investment.quantity,
                amount: investment.quantity * stock.price,
                change: stock.slope * stock.price * investment.quantity,
            }
        }));
    return populated_investments.sort((a, b) => b.amount - a.amount);
};

export const performTransactions = async (id: string, transactions: Transaction[]): Promise<PortfolioInterfaceWithID> => {
    const date = await getDate();
    let portfolio = await getPortfolioById(id);
    for (let transaction of transactions) {
        if (transaction.type === "STOCK_PURCHASE")
            portfolio = await buyStock(portfolio, transaction);
        else if (transaction.type === "STOCK_SALE")
            portfolio = await sellStock(portfolio, transaction);
        else if (transaction.type === "STOCK_DIVIDEND")
            portfolio = await dividend(portfolio, transaction);
        else throw new Error("Invalid transaction class");
        portfolio.transactions.push({
            ...transaction,
            date
        });
    }

    return await PortfolioModel.findByIdAndUpdate(id,
        {
            balance: portfolio.balance,
            investments: portfolio.investments,
            transactions: portfolio.transactions,
        },
        { new: true }
    ).exec();
};

export const evaluatePortfolio = async (portfolio_id: string) => {
    const portfolio = await getPortfolioById(portfolio_id);
    const investments = portfolio.investments;
    const timeline = portfolio.timeline;
    timeline.sort((a, b) => a.date - b.date);
    const date = timeline[timeline.length - 1].date + 1;
    let gross_amount = 0;
    const dumped_stocks: string[] = [];
    const transactions: Transaction[] = [];

    await Promise.all(
        investments.map(async (investment) => {
            const stock = await getStockAnalytics(investment.stock);

            const amount = investment.quantity * stock.price;
            gross_amount += amount;


            if (amount < STOCK_DUMP_THRESHOLD) {
                await pullTrader(investment.stock, portfolio_id);
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

    portfolio.timeline.push({ value: portfolio.balance + gross_amount, date });

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

export async function getPortfolioTimelines(): Promise<{ timeline: NetWorth[]; }[]> {
    return await PortfolioModel.find({}, { timeline: 1 }).exec();
}


