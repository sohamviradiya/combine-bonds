import { faker } from "@faker-js/faker";
import { createPortfolioDTO } from "backend/interfaces/portfolio.interface";
import PortfolioService from "backend/services/portfolio.service";
const generateRandomPortfolio = (): createPortfolioDTO => {
	return {
		user: {
			name: faker.internet.userName(),
			bio: faker.lorem.paragraph(),
		},
	};
};


const PortfolioGenerator = async () => {
	for(let i = 0; i < 10; i++) {
		await PortfolioService.addPortfolio(generateRandomPortfolio());
	}
};

export default PortfolioGenerator;