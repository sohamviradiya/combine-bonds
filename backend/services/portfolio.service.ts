import PortfolioInterface, {
	createPortfolioDTO,
	Transaction,
	PortfolioInterfaceWithID,
} from "backend/interfaces/portfolio.interface";
import { faker } from "@faker-js/faker";
import PortfolioModel from "backend/models/portfolio.schema";
import TransactionService from "./transaction.service";
const PortfolioService = (() => {
	const generateRandomPortfolio = (): createPortfolioDTO => {
		return {
			user: {
				name: faker.internet.userName(),
				bio: faker.lorem.paragraph(),
			},
		};
	};

	const addPortfolio = async (
		portfolio: createPortfolioDTO
	): Promise<PortfolioInterface> => {
		return await new PortfolioModel({
			...portfolio,
			transactions: [],
			currentBalance: 100000,
			netWorth: [
				{
					value: 100000,
					date: 0,
				},
			],
			investments: [],
		}).save();
	};

	const getPortfolios = async (): Promise<PortfolioInterface[]> => {
		return await PortfolioModel.find().exec();
	};

	const getPortfolio = async (
		portfolio_id: string
	): Promise<PortfolioInterface> => {
		return await PortfolioModel.findById(portfolio_id).exec();
	};

	const updatePortfolio = async (
		portfolio: PortfolioInterface,
		id: string
	): Promise<PortfolioInterfaceWithID> => {
		return await PortfolioModel.findByIdAndUpdate(id, portfolio, {
			new: true,
		}).exec();
	};

	const performTransaction = async (
		id: string,
		transaction: Transaction
	): Promise<PortfolioInterfaceWithID> => {
		let portfolio = await getPortfolio(id);
		if (transaction.class === "ACCOUNT DEPOSIT")
			portfolio = TransactionService.deposit(portfolio, transaction);
		else if (transaction.class === "ACCOUNT WITHDRAWAL")
			portfolio = TransactionService.withdraw(portfolio, transaction);
		else if (transaction.class === "STOCK PURCHASE")
			portfolio = await TransactionService.buyStock(portfolio, transaction);
		else if (transaction.class === "STOCK SALE")
			portfolio = await TransactionService.sellStock(portfolio, transaction);
		else throw new Error("Invalid transaction class");
		return await updatePortfolio(portfolio, id);
	};

	return {
		generateRandomPortfolio,
		addPortfolio,
		getPortfolios,
		getPortfolio,
		performTransaction,
	};
})();

export default PortfolioService;
