import { faker } from "@faker-js/faker";
import { User } from "@/types/portfolio.interface";
import { addPortfolio } from "@/server/services/portfolio.service";

const NUM_OF_PORTFOLIOS = 20;

const generateUser = (): User => {
    return {
            name: faker.internet.userName(),
            bio: faker.lorem.paragraph(),
            password: faker.internet.password({ length: 12 }),
    };
};

const PortfolioGenerator = async () => {
    for (let i = 0; i < NUM_OF_PORTFOLIOS; i++) {
        const portfolio = generateUser();
        await addPortfolio(portfolio);
    }
};

export default PortfolioGenerator;
