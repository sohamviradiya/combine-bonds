import { faker } from "@faker-js/faker";
import { createPortfolioDTO } from "server/types/portfolio.interface";
import PortfolioService from "server/services/portfolio.service";

const NUM_OF_PORTFOLIOS = 100;

const generatePortfolio = (): createPortfolioDTO => {
	return {
		user: {
			name: faker.internet.userName(),
			bio: faker.lorem.paragraph(),
		},
	};
};

const PortfolioGenerator = async () => {
	for (let i = 0; i < NUM_OF_PORTFOLIOS; i++) {
		const portfolio = generatePortfolio();
		await PortfolioService.add(portfolio);
	}
};

export default PortfolioGenerator;
