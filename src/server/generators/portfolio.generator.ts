import { faker } from "@faker-js/faker";
import { createPortfolioDTO } from "types/portfolio.interface";
import { addPortfolio } from "@/server/services/portfolio.service";

const NUM_OF_PORTFOLIOS = 20;

const generatePortfolio = (): createPortfolioDTO => {
    return {
        user: {
            name: faker.internet.userName(),
            bio: faker.lorem.paragraph(),
            password: faker.internet.password({ length: 12 }),
        },
    };
};

const PortfolioGenerator = async () => {
    for (let i = 0; i < NUM_OF_PORTFOLIOS; i++) {
        const portfolio = generatePortfolio();
        await addPortfolio(portfolio);
    }
};

export default PortfolioGenerator;
