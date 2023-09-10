import { faker } from "@faker-js/faker";

import { User } from "@/types/portfolio.interface";

import { addPortfolio } from "@/server/services/portfolio.service";
import { NUM_OF_PORTFOLIOS } from "@/server/global.config";


const PortfolioGenerator = async () => {
    const portfolioPromises = [];

    for (let i = 0; i < NUM_OF_PORTFOLIOS; i++) {
        const portfolio = generateUser();
        const portfolioPromise = addPortfolio(portfolio);
        portfolioPromises.push(portfolioPromise);
    }

    await Promise.all(portfolioPromises);
};

const generateUser = (): User => {
    return {
        name: faker.internet.userName(),
        bio: faker.lorem.paragraph(),
        password: faker.internet.password({ length: 12 }),
    };
};



export default PortfolioGenerator;
