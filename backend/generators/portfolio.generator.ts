import { faker } from "@faker-js/faker";
import { createPortfolioDTO } from "backend/interfaces/portfolio.interface";
import PortfolioService from "backend/services/portfolio.service";
const generatePortfolio = (): createPortfolioDTO => {
	return {
		user: {
			name: faker.internet.userName(),
			bio: faker.lorem.paragraph(),
		},
	};
};

const PortfolioGenerator = async () => {
	for (let i = 0; i < 100; i++) {
		const portfolio = generatePortfolio();
		await PortfolioService.add(portfolio);
		console.log("Added portfolio " + portfolio.user?.name);
	}
};

export default PortfolioGenerator;
