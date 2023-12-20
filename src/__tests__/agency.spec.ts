import { closeMongoServer, initializeMongoServer } from "@/setup-test";
import * as AgencyService from "@/server/services/agency.service";
import * as StockService from "@/server/services/stock.service";
import * as MarketService from "@/server/services/market.service";
import { createRandomStock } from "@/server/seeds/stock.seed";
import { AgencyInterfaceWithId } from "@/types/agency.interface";
import { StockInterfaceWithId } from "@/types/stock.interface";

let testAgency: AgencyInterfaceWithId;
let testStock: StockInterfaceWithId;

beforeAll(async () => {
    initializeMongoServer();

    testStock = await StockService.addStock(await createRandomStock()) as unknown as StockInterfaceWithId;
    testStock.timeline.push({
        date: 0,
        price: 100,
        dividend: 0,
        volume: 3,
    });
    testStock.timeline.push({
        date: 1,
        price: 107,
        dividend: 7,
        volume: 3,
    });

    testAgency = {
        type: "Steady",
        stock: testStock._id.toString(),
        parameters: {
            steady_increase: 0.1,
            random_fluctuation: 0.1,
            market_sentiment: 0.1,
            market_volume: 0.1,
            dividend: 0.1,
        },
    } as AgencyInterfaceWithId;

    await MarketService.evaluateMarket();


}, 100000);

describe("Agency Creation", () => {
    test("Create Agency", async () => {
        const agency = await AgencyService.addAgency(testAgency);
        expect(agency.stock.toString()).toEqual(testAgency.stock.toString());
        expect(agency.type).toBe(testAgency.type);
        expect(agency.parameters).toEqual(testAgency.parameters);
    }, 100000);
});

describe("Agency Get", () => {
    test("Get Agency", async () => {
        const agency = await AgencyService.addAgency(testAgency);
        const getAgency = await AgencyService.getAgencyById(agency._id.toString());
        expect(getAgency).not.toBeNull();
    }, 100000);

    test("Get Agency", async () => {
        const agency = await AgencyService.getAgencyById("6581c16df306303bea411736");
        expect(agency).toBeNull();
    }, 100000);
});

describe("Get All Agencies", () => {
    test("Get All Agencies", async () => {
        const agency = await AgencyService.addAgency(testAgency);
        const agencies = await AgencyService.getAllAgencies();
        expect(agencies.length).toBeGreaterThan(0);
    }, 100000);
});

describe("Agency Evaluation", () => {
    test("Evaluate Agency", async () => {
        const agency = await AgencyService.addAgency(testAgency);
        const price = await AgencyService.evaluateAgency(agency._id.toString());
        expect(price).toBeGreaterThan(0);
    }, 100000);

    test("No Agency", async () => {
        const price = await AgencyService.evaluateAgency("6581c16df306303bea411736");
        expect(price).toBeUndefined();
    }, 100000);
});




afterAll(async () => {
    closeMongoServer();
}, 100000);