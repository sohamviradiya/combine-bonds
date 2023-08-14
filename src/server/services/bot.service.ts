import {
    Investment,
    Transaction,
} from "@/types/portfolio.interface";
import {
    PORTFOLIO_MINIMUM_BALANCE,
} from "@/server/global.config";
import BotModel from "@/server/models/bot.schema";
import { dumpPortfolio, performTransactions, getPortfolioById } from "@/server/services/portfolio.service";
import BotInterface from "@/types/bot.interface";
import {
    BOT_INVESTMENT_PARAMETER,
    BOT_LOSS_AVERSION_PARAMETER,
    BOT_STOCK_CLEARANCE_PARAMETER
} from "@/server/global.config";
import { getRelativeCumulativeMarketCapitalization } from "@/server/services/market.service";
import { getStockValue, getRandomStocks, getHighDoubleSlopeStocks, getHighSlopeStocks } from "@/server/services/stock.service";

const addBot = async (bot: BotInterface) => {
    const newBot = new BotModel({
        ...bot,
    });
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
    loss_aversion_parameter: number,
    stock_clearance_parameter: number,
    date: number
): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    for (let investment of bundle) {
        const { fall_since_peak, price, rise_since_trough } =
            await getStockValue(investment.stock);
        if (
            fall_since_peak >=
            loss_aversion_parameter * BOT_LOSS_AVERSION_PARAMETER ||
            rise_since_trough >=
            stock_clearance_parameter * BOT_STOCK_CLEARANCE_PARAMETER
        ) {
            transactions.push({
                stock: investment.stock,
                amount: investment.quantity * price,
                class: "STOCK SALE",
                date,
            });
        }
    }
    return transactions;
};

const fillBundle = async (
    bundle: Investment[],
    weight_distributions: BotInterface["parameters"]["bundle_filling_parameter"]["weight_distribution"],
    budget: number,
    date: number
): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    const n = Math.min(weight_distributions.length, bundle.length);
    const stocks_data = (
        await Promise.all(
            bundle.map(async (investment) => {
                const { slope } = await getStockValue(investment.stock);
                return { stock: investment.stock, slope };
            })
        )
    )
        .sort((a, b) => b.slope - a.slope)
        .splice(0, n);

    for (let i = 0; i < n; i++) {
        transactions.push({
            stock: stocks_data[i].stock,
            amount: budget * weight_distributions[i],
            class: "STOCK PURCHASE",
            date,
        });
    }

    return transactions;
};

const randomInvest = async (
    budget: number,
    weight_distributions: BotInterface["parameters"]["bundle_expansion_parameter"]["random_investment_parameters"]["weight_distribution"],
    date: number
): Promise<Transaction[]> => {
    const n = weight_distributions.length;
    const transactions: Transaction[] = [];
    const stocks = await getRandomStocks(n);
    for (let i = 0; i < n; i++) {

        transactions.push({
            stock: stocks[i]._id,
            amount: budget * weight_distributions[i],
            class: "STOCK PURCHASE",
            date,
        });
    }
    return transactions;
};

const highRaiseInvest = async (
    budget: number,
    weight_distributions: BotInterface["parameters"]["bundle_expansion_parameter"]["high_raise_investment_parameters"]["weight_distribution"],
    date: number
): Promise<Transaction[]> => {
    const n = weight_distributions.length;
    const transactions: Transaction[] = [];
    const stocks = await getHighSlopeStocks(n);
    for (let i = 0; i < n; i++) {

        transactions.push({
            stock: stocks[i],
            amount: budget * weight_distributions[i],
            class: "STOCK PURCHASE",
            date,
        });
    }

    return transactions;
};

const lowRiseInvest = async (
    budget: number,
    weight_distributions: BotInterface["parameters"]["bundle_expansion_parameter"]["lows_rising_investment_parameters"]["weight_distribution"],
    date: number
): Promise<Transaction[]> => {
    const n = weight_distributions.length;
    const transactions: Transaction[] = [];
    const stocks = await getHighDoubleSlopeStocks(n);
    for (let i = 0; i < Math.min(n, stocks.length); i++) {
        transactions.push({
            stock: stocks[i],
            amount: budget * weight_distributions[i],
            class: "STOCK PURCHASE",
            date,
        });
    }
    return transactions;
};

const expandBundle = async (
    bundle: Investment[],
    parameter: BotInterface["parameters"]["bundle_expansion_parameter"],
    budget: number,
    date: number
): Promise<Transaction[]> => {
    const transactions: Transaction[] = [];
    transactions.push(
        ...(await randomInvest(
            budget * parameter.random_investment_parameters.value,
            parameter.random_investment_parameters.weight_distribution,
            date
        ))
    );
    transactions.push(
        ...(await highRaiseInvest(
            budget * parameter.high_raise_investment_parameters.value,
            parameter.high_raise_investment_parameters.weight_distribution,
            date
        ))
    );
    transactions.push(
        ...(await lowRiseInvest(
            budget * parameter.lows_rising_investment_parameters.value,
            parameter.lows_rising_investment_parameters.weight_distribution,
            date
        ))
    );
    return transactions.filter((transaction) => {
        return (
            transaction.class === "STOCK PURCHASE" &&
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
    }: { portfolio: string; parameters: BotInterface["parameters"] } =
        await BotModel.findById(bot_id, { portfolio: 1, parameters: 1 }).exec();

    const portfolio = await getPortfolioById(portfolio_id);

    if (portfolio.currentBalance < PORTFOLIO_MINIMUM_BALANCE) {
        await dumpPortfolio(portfolio_id, date);
        return 0;
    }

    const transactions: Transaction[] = [];

    transactions.push(
        ...(await updateBundle(
            portfolio.investments,
            parameters.loss_aversion_parameter,
            parameters.stock_clearance_parameter,
            date
        ))
    );
    let relative_netWorth_change = 0.01;
    if (portfolio.netWorth.length >= 2) {
        relative_netWorth_change =
            (portfolio.netWorth[portfolio.netWorth.length - 1].value -
                portfolio.netWorth[portfolio.netWorth.length - 2].value) /
            portfolio.netWorth[portfolio.netWorth.length - 2].value;
    }

    const balance_component =
        parameters.investment_amount_per_slot.balance_dependence_parameter *
        relative_netWorth_change;

    const market_sentience_component = Math.max(
        parameters.investment_amount_per_slot
            .market_sentiment_dependence_parameter *
        (await getRelativeCumulativeMarketCapitalization()),
        0
    );

    const total_investment_amount =
        BOT_INVESTMENT_PARAMETER *
        portfolio.currentBalance *
        (balance_component + market_sentience_component);

    const bundle_filling_amount =
        total_investment_amount * parameters.bundle_filling_parameter.value;

    transactions.push(
        ...(await fillBundle(
            portfolio.investments,
            parameters.bundle_filling_parameter.weight_distribution,
            bundle_filling_amount,
            date
        ))
    );

    const budget_expansion_amount =
        total_investment_amount * parameters.bundle_expansion_parameter.value;

    transactions.push(
        ...(await expandBundle(
            portfolio.investments,
            parameters.bundle_expansion_parameter,
            budget_expansion_amount,
            date
        ))
    );
    await performTransactions(portfolio_id, transactions);
    return total_investment_amount;
};


export { addBot, getAllBots, getBotById, evaluateBot };

