import { addStock } from "@/server/services/stock.service";
import { createStockDto, StockInterface, COMPANY_FORMS, COMPANY_FIELDS } from "@/types/stock.interface";
import { ChemicalElement, faker } from "@faker-js/faker";

const NUM_OF_STOCKS = 40;
const StockGenerator = async () => {
    for (let i = 0; i < NUM_OF_STOCKS; i++) {
        const stock = await createRandomStock();
        await addStock(stock);
    }
};

const createRandomStock = async (): Promise<createStockDto> => {
    const element = getElement();
    const gross_volume = Math.floor((0.1 + Math.random()) * Math.pow(10, 5 + 3 * Math.random()));
    const market_valuation = gross_volume * (0.1 + Math.random()) * 100;
    return {
        symbol: "$" + element.name.toLocaleUpperCase().slice(0, 3),
        gross_volume,
        timeline: [
            {
                date: 0,
                price: market_valuation,
                volume: 0,
                dividend: 0,
            },
        ],
        company: generateCompany(element),
    } as createStockDto;
};

const company_names = [] as ChemicalElement[];

const getElement = () => {
    let element = faker.science.chemicalElement();
    while (company_names.includes(element))
        element = faker.science.chemicalElement();
    return {
        name: element.name,
        symbol: element.symbol,
    }
};


const generateCompany = (element: { symbol: string, name: string }) => {
    const field = Object.values(COMPANY_FIELDS)[Math.floor(Math.random() * 14)];
    const form = Object.values(COMPANY_FORMS)[Math.floor(Math.random() * 7)];
    const established = faker.date.past();
    const employees = Math.floor(1 + Math.random() * 100000);
    const headquarters = faker.location.street() + ", " + faker.location.city();
    const assets = Math.floor((0.1 + Math.random()) * 100000000);
    return {
        symbol: element.symbol,
        name: element.name,
        field,
        form,
        established,
        description: `${element.name} is a renowned company in the ${field} industry, established in ${established}. With a reputation for excellence and innovation, it has become a leading player in its sector. As a ${form} company, it has demonstrated resilience and adaptability, continuously evolving to meet the changing demands of the market.`,
        assets,
        headquarters,
        employees,
    } as StockInterface["company"];
};

export default StockGenerator;