import BotInterface, { BOT_STRATEGIES } from "@/types/bot.interface";
import { addBot } from "@/server/services/bot.service";
import { getAllPortfolios } from "@/server/services/portfolio.service";

const BotGenerator = async () => {
    const portfolio_ids = await getAllPortfolios();

    await Promise.all(portfolio_ids.map(async (portfolio_id): Promise<void> => {
        const bot = generateBot(portfolio_id.toString(), 1);
        await addBot(bot);
    })
    );
};

const generateWeights = (num: number) => {
    let weights = [];
    for (let i = 0; i < num; i++) {
        weights.push((0.9 * Math.random() + 0.1));
    }
    weights.sort((a, b) => b - a);
    let sum = weights.reduce((a, b) => a + b, 0);
    weights = weights.map((w) => w / sum);
    return weights;
};

const generateBot = (portfolio_id: string, trade_period: number): BotInterface => {
    const bot_class = Object.values(BOT_STRATEGIES)[Math.floor(Math.random() * 4)];
    let investment_amount_per_slot = {} as BotInterface["parameters"]["investment_amount_per_slot"];
    let bundle = {} as BotInterface["parameters"]["bundle"];
    let loss_aversion = 0;
    let stock_clearance = 0;

    if (bot_class == "Safe") {
        investment_amount_per_slot = {
            balance: 0.3 + Math.random() * 0.1,
            market_sentiment: 0,
        };
        bundle = {
            value: 0.2 + Math.random() * 0.1,
            trending: {
                value: 0.3 + Math.random() * 0.1,
                weights: generateWeights(1),
            },
            predicted: {
                value: 0.3 + Math.random() * 0.1,
                weights: generateWeights(1),
            },
            random: {
                value: 0,
                weights: generateWeights(0),
            },
        };
        loss_aversion = 0.05 + Math.random() * 0.1;
        stock_clearance = 0.3 + Math.random() * 0.1;
    } else if (bot_class == "Aggressive") {
        investment_amount_per_slot = {
            balance: 0.5 + Math.random() * 0.1,
            market_sentiment: 0,
        };
        bundle = {
            value: 0.4 + Math.random() * 0.1,
            trending: {
                value: 0.3 + Math.random() * 0.1,
                weights: generateWeights(3),
            },
            predicted: {
                value: 0.3 + Math.random() * 0.1,
                weights: generateWeights(3),
            },
            random: {
                value: 0,
                weights: generateWeights(2),
            },
        };
        loss_aversion = 0.1 + Math.random() * 0.1;
        stock_clearance = 0.35 + Math.random() * 0.1;
    } else if (bot_class == "Speculative") {
        investment_amount_per_slot = {
            balance: 0.4 + Math.random() * 0.1,
            market_sentiment: 0.6 + Math.random() * 0.1,
        };
        bundle = {
            value: 0.2 + Math.random() * 0.1,
            trending: {
                value: 0.4 + Math.random() * 0.1,
                weights: generateWeights(2),
            },
            predicted: {
                value: 0.4 + Math.random() * 0.1,
                weights: generateWeights(2),
            },
            random: {
                value: 0.2 + Math.random() * 0.1,
                weights: generateWeights(1),
            },
        };
        loss_aversion = 0.15 + Math.random() * 0.1;
        stock_clearance = 0.25 + Math.random() * 0.1;
    } else if (bot_class == "Random") {
        investment_amount_per_slot = {
            balance: 0.5 + Math.random() * 0.1,
            market_sentiment: 0.5 + Math.random() * 0.1,
        };
        bundle = {
            value: 0.5 + Math.random() * 0.1,
            trending: {
                value: 0,
                weights: generateWeights(0),
            },
            predicted: {
                value: 0,
                weights: generateWeights(0),
            },
            random: {
                value: 1,
                weights: generateWeights(5),
            },
        };
        loss_aversion = 0.2 + Math.random() * 0.1;
        stock_clearance = 0.1 + Math.random() * 0.1;
    } else throw new Error("Bot class not found");

    investment_amount_per_slot.market_sentiment = 1 - investment_amount_per_slot.balance;
    bundle.random.value = 1 - bundle.trending.value - bundle.predicted.value;

    return {
        portfolio: portfolio_id,
        trade_period: trade_period,
        strategy: bot_class,
        parameters: {
            investment_amount_per_slot: investment_amount_per_slot,
            bundle,
            loss_aversion,
            stock_clearance,
        },
    };
};

export default BotGenerator;
