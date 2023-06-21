import { Investment, PORTFOLIO_MINIMUM_BALANCE, PORTFOLIO_STARTING_BALANCE, Transaction } from "types/portfolio.interface";
import BotModel from "@/server/models/bot.schema";
import PortfolioService from "./portfolio.service";
import BotInterface, {
	BOT_INVESTMENT_PARAMETER,
	BOT_LOSS_AVERSION_PARAMETER,
	BOT_STOCK_CLEARANCE_PARAMETER,
} from "types/bot.interface";
import MarketService from "./market.service";
import StockService from "./stock.service";
import { exit } from "process";

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

	const updateBundle = async (
		bundle: Investment[],
		loss_aversion_parameter: number,
		stock_clearance_parameter: number,
		date: number
	): Promise<Transaction[]> => {
		const transactions: Transaction[] = [];
		for (let investment of bundle) {
			const { fall_since_peak, price, rise_since_trough } =
				await StockService.getValue(investment.stock);
			if (
				fall_since_peak >=
					loss_aversion_parameter * BOT_LOSS_AVERSION_PARAMETER ||
				rise_since_trough >=
					stock_clearance_parameter * BOT_STOCK_CLEARANCE_PARAMETER
			) {
				if (!investment.stock) {
					console.log("updateBundle: stock is null");
					exit(1);
				}
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
					const { slope } = await StockService.getValue(investment.stock);
					return { stock: investment.stock, slope };
				})
			)
		)
			.sort((a, b) => b.slope - a.slope)
			.splice(0, n);

		for (let i = 0; i < n; i++) {
			if (!stocks_data[i].stock) {
				console.log("fillBundle: stock is null");
				exit(1);
			}
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
		const stocks = await StockService.getRandom(n);
		for (let i = 0; i < n; i++) {
			if (!stocks[i]._id) {
				console.log("randomInvest: stock is null");
				exit(1);
			}

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
			if (!stocks[i]) {
				console.log("highRaiseInvest: stock is null");
				exit(1);
			}

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
		for (let i = 0; i < Math.min(n, stocks.length); i++) {
			if (!stocks[i]) {
				console.log("lowRiseInvest: stock is null", stocks);
				exit(1);
			}
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

	const evaluate = async (bot_id: string, date: number) => {
		const {
			portfolio,
			parameters,
		}: { portfolio: string; parameters: BotInterface["parameters"] } =
			await BotModel.findById(bot_id, { portfolio: 1, parameters: 1 }).exec();

		const portfolio_data = await PortfolioService.get(portfolio);

		if (portfolio_data.currentBalance < PORTFOLIO_MINIMUM_BALANCE) {
			await PortfolioService.dump(portfolio, date);
			return 0;
		}
		
		const transactions: Transaction[] = [];

		transactions.push(
			...(await updateBundle(
				portfolio_data.investments,
				parameters.loss_aversion_parameter,
				parameters.stock_clearance_parameter,
				date
			))
		);
		let relative_netWorth_change = 0;
		if (portfolio_data.netWorth.length >= 2) {
			relative_netWorth_change =
				(portfolio_data.netWorth[portfolio_data.netWorth.length - 1].value -
					portfolio_data.netWorth[portfolio_data.netWorth.length - 2].value) /
				portfolio_data.netWorth[portfolio_data.netWorth.length - 2].value;
		}

		const balance_component =
			parameters.investment_amount_per_slot.balance_dependence_parameter *
			relative_netWorth_change;
		const market_sentience_component =
			parameters.investment_amount_per_slot
				.market_sentiment_dependence_parameter *
			(await MarketService.getRelativeCumulativeMarketCapitalization());

		const total_investment_amount =
			BOT_INVESTMENT_PARAMETER *
			portfolio_data.currentBalance *
			(balance_component + market_sentience_component);

		const bundle_filling_amount =
			total_investment_amount * parameters.bundle_filling_parameter.value;

		transactions.push(
			...(await fillBundle(
				portfolio_data.investments,
				parameters.bundle_filling_parameter.weight_distribution,
				bundle_filling_amount,
				date
			))
		);

		const budget_expansion_amount =
			total_investment_amount * parameters.bundle_expansion_parameter.value;

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
