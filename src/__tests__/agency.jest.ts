import { closeMongoServer, initializeMongoServer } from "@/setup-test";
import * as AgencyService from "@/server/services/agency.service";
import * as StockService from "@/server/services/stock.service";
import * as MarketService from "@/server/services/market.service";
import { AGENCY_TYPES } from "@/types/agency.interface";

const studAgency = {
    type: AGENCY_TYPES.Steady,
    parameters: {
        steady_increase: 0.1,
        random_fluctuation: 0.1,
        market_sentiment: 0.1,
        market_volume: 0.1,
        dividend: 0.1,
    },
    stock: "",
};

beforeAll(async () => {
    initializeMongoServer();

    const stock = await StockService.addStock({
        symbol: "TEST",
        company: {
            name: "Test Company",
            field: "Agriculture",
            form: "Corporation",
            description: "A test company",
            employees: 100,
            established: new Date(),
            assets: 100000,
        },
        gross_volume: 100000,
        timeline: [{
            price: 100,
            dividend: 0,
            volume: 100000,
            date: 0,
        }, {
            price: 100,
            dividend: 0,
            volume: 100000,
            date: 1,
        }],
    });

    await MarketService.evaluateMarket();

    studAgency.stock = stock._id.toString();
}, 100000);

describe("Agency Creation", () => {
    test("Create Agency", async () => {
        const agency = await AgencyService.addAgency(studAgency);
        expect(agency.stock.toString()).toEqual(studAgency.stock);
        expect(agency.type).toBe(studAgency.type);
        expect(agency.parameters).toEqual(studAgency.parameters);
    }, 100000);
});

describe("Agency Get", () => {
    test("Get Agency", async () => {
        const agency = await AgencyService.addAgency(studAgency);
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
        const agency = await AgencyService.addAgency(studAgency);
        const agencies = await AgencyService.getAllAgencies();
        expect(agencies.length).toBeGreaterThan(0);
    }, 100000);
});

describe("Agency Evaluation", () => {
    test("Evaluate Agency", async () => {
        const agency = await AgencyService.addAgency(studAgency);
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