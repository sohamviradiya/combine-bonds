import { Investment, Transaction, } from "@/types/portfolio.interface";
import { dumpPortfolio, performTransactions, getPortfolioById } from "@/server/services/portfolio.service";

import BotModel from "@/server/models/bot.schema";
import BotInterface from "@/types/bot.interface";

import { getRelativeCumulativeMarketCapitalization, getTrendingStocks, getPredictedStocks } from "@/server/services/market.service";

import { getStockAnalytics, getRandomStocks } from "@/server/services/stock.service";

import { PORTFOLIO_MINIMUM_BALANCE, BOT_INVESTMENT, BOT_LOSS_AVERSION, BOT_STOCK_CLEARANCE } from "@/server/global.config";


export const addBot = async (bot: BotInterface) => {
    const newBot = new BotModel({ ...bot, });
    return await newBot.save();
};

export const getAllBots = async () => {
    return (await BotModel.find({}, { _id: 1 }).exec()).map((bot) => bot._id);
};

export const getBotById = async (bot_id: string) => {
    return await BotModel.findById(bot_id).exec();
};

const updateBundle = async (bundle: Investment[], loss_aversion: number, stock_clearance: number, date: number): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    for (let investment of bundle) {
        const { fall_since_peak, price, rise_since_trough } = await getStockAnalytics(investment.stock);
        if (fall_since_peak >= loss_aversion * BOT_LOSS_AVERSION || rise_since_trough >= stock_clearance * BOT_STOCK_CLEARANCE) {
            transactions.push({
                stock: investment.stock,
                amount: investment.quantity * price,
                type: "STOCK_SALE",
                date,
            });
        }
    }
    return transactions;
};


const investRandom = async (budget: number, weights: BotInterface["parameters"]["bundle"]["random"]["weights"], date: number): Promise<Transaction[]> => {
    const n = weights.length;
    const transactions: Transaction[] = [];
    const stocks = await getRandomStocks(n);
    for (let i = 0; i < stocks.length; i++) {
        transactions.push({
            stock: stocks[i]._id,
            amount: budget * weights[i],
            type: "STOCK_PURCHASE", date,
        });
    }
    return transactions;
};

const investTrending = async (budget: number, weights: BotInterface["parameters"]["bundle"]["trending"]["weights"], date: number): Promise<Transaction[]> => {
    const n = weights.length;
    const transactions: Transaction[] = [];
    const stocks = await getTrendingStocks(n);
    for (let i = 0; i < stocks.length; i++) {
        transactions.push({
            stock: stocks[i],
            amount: budget * weights[i],
            type: "STOCK_PURCHASE", date,
        });
    }

    return transactions;
};

const investPredicted = async (budget: number, weights: BotInterface["parameters"]["bundle"]["predicted"]["weights"], date: number): Promise<Transaction[]> => {
    const n = weights.length;
    const transactions: Transaction[] = [];
    const stocks = await getPredictedStocks(n);
    for (let i = 0; i < stocks.length; i++) {
        transactions.push({
            stock: stocks[i],
            amount: budget * weights[i],
            type: "STOCK_PURCHASE", date,
        });
    }
    return transactions;
};

const expandBundle = async (parameter: BotInterface["parameters"]["bundle"], budget: number, date: number): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];

    transactions.push(...(await investRandom(budget * parameter.random.value, parameter.random.weights, date)));

    transactions.push(...(await investTrending(budget * parameter.trending.value, parameter.trending.weights, date)));

    transactions.push(...(await investPredicted(budget * parameter.predicted.value, parameter.predicted.weights, date)));

    return transactions;
};

export const evaluateBot = async (bot_id: string, date: number) => {
    const { portfolio: portfolio_id, parameters, }: { portfolio: string; parameters: BotInterface["parameters"] } = await BotModel.findById(bot_id, { portfolio: 1, parameters: 1 }).exec();

    const portfolio = await getPortfolioById(portfolio_id);

    if (portfolio.balance < PORTFOLIO_MINIMUM_BALANCE) {
        await dumpPortfolio(portfolio_id, date);
        return 0;
    }

    const transactions: Transaction[] = [];

    transactions.push(...(await updateBundle(portfolio.investments, parameters.loss_aversion, parameters.stock_clearance, date)));

    let relative_net_worth_change = 0.01;
    if (portfolio.timeline.length >= 2)
        relative_net_worth_change = (portfolio.timeline[portfolio.timeline.length - 1].value - portfolio.timeline[portfolio.timeline.length - 2].value) / portfolio.timeline[portfolio.timeline.length - 2].value;

    const balance_component = parameters.investment_amount_per_slot.balance * relative_net_worth_change;

    const market_sentience_component = Math.max(parameters.investment_amount_per_slot.market_sentiment * (await getRelativeCumulativeMarketCapitalization()), 0);

    const total_investment_amount = BOT_INVESTMENT * portfolio.balance * (balance_component + market_sentience_component);

    const budget_expansion_amount = total_investment_amount * parameters.bundle.value;

    transactions.push(...(await expandBundle(parameters.bundle, budget_expansion_amount, date)));
    await performTransactions(portfolio_id, transactions);
    return total_investment_amount;
};


