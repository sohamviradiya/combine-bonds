import BotInterface from "backend/interfaces/bot.interface";
import { Investment, Transaction } from "backend/interfaces/portfolio.interface";
import BotModel from "backend/models/bot.schema";
import PortfolioService from "./portfolio.service";
import { BOT_PARAMETER } from "backend/interfaces/bot.interface";
import PortfolioModel from "backend/models/portfolio.schema";
import MarketService from "./market.service";
import { MARKET_BASE } from "backend/interfaces/market.interface";
import StockService from "./stock.service";
import StockModel from "backend/models/stock.schema";

const BotService = (() => {
	const add = async (bot: BotInterface) => {
		const newBot = new BotModel({
			...bot,
		});
		return await newBot.save();
	};

	const getAll = async () => {
		return (await BotModel.find({}, { _id: 1 }).exec()).map((bot) => bot._id);
	};
	
	const get = async (bot_id: string) => {
		return await BotModel.findById(bot_id).exec();
	};

	const avertLoss = async (
		bundle: Investment[],
		loss_aversion_parameter: number,
		date: number
	): Promise<Transaction[]> => {
		const transactions: Transaction[] = [];
		for (let investment of bundle) {
			const { three_day_slope, price } = await StockService.getValue(investment.stock);
			if (three_day_slope < -loss_aversion_parameter) {
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
		const stocks = (
			await Promise.all(
				bundle.map(async (investment) => {
					const { slope } = await StockService.getValue(investment.stock);
					return { stock: investment.stock, slope };
				})
			)
		)
			.sort((a, b) => b.slope - a.slope)
			.splice(0, n);

		for (let i = 0; i < n; i++) {
			transactions.push({
				stock: stocks[i].stock,
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
		const stocks = await StockModel.find({}).limit(n).exec();
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
		const stocks = await StockService.getHighSlope(n);
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
		const stocks = await StockService.getHighDoubleSlope(n);
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
		return transactions;
	};

	const evaluate = async (bot_id: string) => {
		const { portfolio, parameters }: { portfolio: string; parameters: BotInterface["parameters"] } =
			await BotModel.findById(bot_id, { portfolio: 1, parameters: 1 }).exec();
		const date = await MarketService.getDate();

		const portfolio_data = await PortfolioModel.findById(portfolio).exec();

		const transactions: Transaction[] = [];

		transactions.push(...(await avertLoss(portfolio_data.investments, parameters.loss_aversion_parameter, date)));

		const balance_component =
			parameters.investment_amount_per_slot.balance_dependence_parameter * portfolio_data.currentBalance;
		const market_market_component =
			parameters.investment_amount_per_slot.market_sentiment_dependence_parameter *
			(await MarketService.getRelativeCumulativeMarketCapitalization()) *
			MARKET_BASE;

		const total_investment_amount = BOT_PARAMETER * (balance_component + market_market_component);

		transactions.push(...(await avertLoss(portfolio_data.investments, parameters.loss_aversion_parameter, date)));

		const bundle_filling_amount = total_investment_amount * parameters.bundle_filling_parameter.value;

		transactions.push(
			...(await fillBundle(
				portfolio_data.investments,
				parameters.bundle_filling_parameter.weight_distribution,
				bundle_filling_amount,
				date
			))
		);

		const budget_expansion_amount = total_investment_amount * parameters.bundle_expansion_parameter.value;

		transactions.push(
			...(await expandBundle(
				portfolio_data.investments,
				parameters.bundle_expansion_parameter,
				budget_expansion_amount,
				date
			))
		);

		await PortfolioService.performTransactions(portfolio, transactions);
		return total_investment_amount;
	};

	return { add, getAll, get, evaluate };
})();

export default BotService;
