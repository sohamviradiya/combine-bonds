import { Investment, Transaction, } from "@/types/portfolio.interface";
import { dumpPortfolio, performTransactions, getPortfolioById } from "@/server/services/portfolio.service";

import BotModel from "@/server/models/bot.schema";
import BotInterface from "@/types/bot.interface";

import { getRelativeCumulativeMarketCapitalization } from "@/server/services/market.service";

import { getStockAnalytics, getRandomStocks, getHighDoubleSlopeStocks, getHighSlopeStocks } from "@/server/services/stock.service";

import { PORTFOLIO_MINIMUM_BALANCE, BOT_INVESTMENT, BOT_LOSS_AVERSION, BOT_STOCK_CLEARANCE } from "@/server/global.config";

const addBot = async (bot: BotInterface) => {
    const newBot = new BotModel({ ...bot, });
    return await newBot.save();
};

const getAllBots = async () => {
    return (await BotModel.find({}, { _id: 1 }).exec()).map((bot) => bot._id);
};

const getBotById = async (bot_id: string) => {
    return await BotModel.findById(bot_id).exec();
};

const updateBundle = async (
    bundle: Investment[],
    loss_aversion: number,
    stock_clearance: number,
    date: number
): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    for (let investment of bundle) {
        const { fall_since_peak, price, rise_since_trough } = await getStockAnalytics(investment.stock);
        if (
            fall_since_peak >= loss_aversion * BOT_LOSS_AVERSION ||
            rise_since_trough >= stock_clearance * BOT_STOCK_CLEARANCE
        ) {
            transactions.push({
                stock: investment.stock,
                amount: investment.quantity * price,
                type: "STOCK SALE",
                date,
            });
        }
    }
    return transactions;
};


const randomInvest = async (
    budget: number,
    weightss: BotInterface["parameters"]["bundle_expansion"]["random"]["weights"],
    date: number
): Promise<Transaction[]> => {
    const n = weightss.length;
    const transactions: Transaction[] = [];
    const stocks = await getRandomStocks(n);
    for (let i = 0; i < n; i++) {

        transactions.push({
            stock: stocks[i]._id,
            amount: budget * weightss[i],
            type: "STOCK PURCHASE",
            date,
        });
    }
    return transactions;
};

const highRaiseInvest = async (
    budget: number,
    weightss: BotInterface["parameters"]["bundle_expansion"]["trending"]["weights"],
    date: number
): Promise<Transaction[]> => {
    const n = weightss.length;
    const transactions: Transaction[] = [];
    const stocks = await getHighSlopeStocks(n);
    for (let i = 0; i < n; i++) {

        transactions.push({
            stock: stocks[i],
            amount: budget * weightss[i],
            type: "STOCK PURCHASE",
            date,
        });
    }

    return transactions;
};

const lowRiseInvest = async (
    budget: number,
    weightss: BotInterface["parameters"]["bundle_expansion"]["predicted"]["weights"],
    date: number
): Promise<Transaction[]> => {
    const n = weightss.length;
    const transactions: Transaction[] = [];
    const stocks = await getHighDoubleSlopeStocks(n);
    for (let i = 0; i < Math.min(n, stocks.length); i++) {
        transactions.push({
            stock: stocks[i],
            amount: budget * weightss[i],
            type: "STOCK PURCHASE",
            date,
        });
    }
    return transactions;
};

const expandBundle = async (
    bundle: Investment[],
    parameter: BotInterface["parameters"]["bundle_expansion"],
    budget: number,
    date: number
): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    transactions.push(
        ...(await randomInvest(
            budget * parameter.random.value,
            parameter.random.weights,
            date
        ))
    );
    transactions.push(
        ...(await highRaiseInvest(
            budget * parameter.trending.value,
            parameter.trending.weights,
            date
        ))
    );
    transactions.push(
        ...(await lowRiseInvest(
            budget * parameter.predicted.value,
            parameter.predicted.weights,
            date
        ))
    );
    return transactions.filter((transaction) => {
        return (
            transaction.type === "STOCK PURCHASE" &&
            bundle.findIndex(
                (investment) => String(investment.stock) === String(transaction.stock)
            ) === -1
        );
    });
};

const evaluateBot = async (bot_id: string, date: number) => {
    const {
        portfolio: portfolio_id,
        parameters,
    }: { portfolio: string; parameters: BotInterface["parameters"] } = await BotModel.findById(bot_id, { portfolio: 1, parameters: 1 }).exec();

    const portfolio = await getPortfolioById(portfolio_id);

    if (portfolio.balance < PORTFOLIO_MINIMUM_BALANCE) {
        await dumpPortfolio(portfolio_id, date);
        return 0;
    }

    const transactions: Transaction[] = [];

    transactions.push(
        ...(await updateBundle(
            portfolio.investments,
            parameters.loss_aversion,
            parameters.stock_clearance,
            date
        ))
    );
    let relative_net_worth_change = 0.01;
    if (portfolio.timeline.length >= 2) {
        relative_net_worth_change = (portfolio.timeline[portfolio.timeline.length - 1].value - portfolio.timeline[portfolio.timeline.length - 2].value) / portfolio.timeline[portfolio.timeline.length - 2].value;
    }

    const balance_component = parameters.investment_amount_per_slot.balance * relative_net_worth_change;

    const market_sentience_component = Math.max(parameters.investment_amount_per_slot.market_sentiment * (await getRelativeCumulativeMarketCapitalization()), 0);

    const total_investment_amount = BOT_INVESTMENT * portfolio.balance * (balance_component + market_sentience_component);

    const budget_expansion_amount = total_investment_amount * parameters.bundle_expansion.value;

    transactions.push(
        ...(await expandBundle(
            portfolio.investments,
            parameters.bundle_expansion,
            budget_expansion_amount,
            date
        ))
    );
    await performTransactions(portfolio_id, transactions);
    return total_investment_amount;
};


export { addBot, getAllBots, getBotById, evaluateBot };

