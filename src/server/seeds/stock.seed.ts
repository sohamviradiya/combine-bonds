import { faker } from "@faker-js/faker";

import { addStock } from "@/server/services/stock.service";
import { createStockDto, StockInterface, COMPANY_FORMS, COMPANY_FIELDS } from "@/types/stock.interface";
import { NUM_OF_STOCKS } from "@/global.config";

const StockGenerator = async () => {
    const stockPromises = [];
    for (let i = 0; i < NUM_OF_STOCKS; i++) {
        const stockPromise = createRandomStock().then((stock) => addStock(stock));
        stockPromises.push(stockPromise);
    }
    await Promise.all(stockPromises);
};


const createRandomStock = async (): Promise<createStockDto> => {
    const name = getName();
    const gross_volume = Math.floor((0.1 + Math.random()) * Math.pow(10, 5 + 3 * Math.random()));
    const price = (0.1 + Math.random()) * 100;
    return {
        symbol: "$" + name.toLocaleUpperCase().slice(0, 3),
        gross_volume,
        timeline: [
            {
                date: 0,
                price,
                volume: 0,
                dividend: 0,
            },
        ],
        company: generateCompany(name),
    } as createStockDto;
};

const company_names = new Set<string>();

company_names.add("");

const getName = () => {
    let name = "";
    while (company_names.has(name.substr(0, 3))) {
        name = faker.person.lastName() + " " + faker.commerce.department() + " " + faker.company.companySuffix();
    }
    company_names.add(name.substr(0, 3));
    return name;
};

const generateCompany = (name: string) => {
    const field = Object.values(COMPANY_FIELDS)[Math.floor(Math.random() * 14)];
    const form = Object.values(COMPANY_FORMS)[Math.floor(Math.random() * 7)];
    const established = faker.date.past();
    const employees = Math.floor(1 + Math.random() * 100000);
    const headquarters = faker.location.street() + ", " + faker.location.city();
    const assets = Math.floor((0.1 + Math.random()) * 100000000);
    return {
        name: name,
        field,
        form,
        established,
        description: `${name} is a renowned company in the ${field} industry, established in ${established}. As a ${faker.company.buzzVerb()} ${form} company, it focuses on ${faker.company.buzzPhrase()}. It's main target is ${faker.company.catchPhrase()}. It has ${employees} employees and its headquarters are located in ${headquarters}. It has assets worth ${assets} dollars.`,
        assets,
        headquarters,
        employees,
    } as StockInterface["company"];
};

export default StockGenerator;