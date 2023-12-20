import { closeMongoServer, initializeMongoServer } from "@/setup-test";
import * as StockService from "@/server/services/stock.service";
import { createRandomStock } from "@/server/seeds/stock.seed";

let testStock: any;

beforeAll(async () => {
    initializeMongoServer();

    testStock = await createRandomStock();
}, 100000);

describe("Stock Creation", () => {
    test("Create Stock", async () => {
        const stock = await StockService.addStock(testStock);
        expect(stock.company).toEqual(testStock.company);
        expect(stock.symbol).toEqual(testStock.symbol);
        expect(stock.gross_volume).toEqual(testStock.gross_volume);
    }, 100000);
});

describe("Stock Get", () => {
    test("Get Stock", async () => {
        const stock = await StockService.addStock(testStock);
        const getStock = await StockService.getStockDataById(stock._id.toString());
        expect(getStock).not.toBeNull();
    }, 100000);

    test("Get Non-Existent Stock", async () => {
        const getStock = await StockService.getStockDataById("6581c16df306303bea411736");
        expect(getStock).toBeNull();
    }, 100000);
});

describe("Stock Get Analysis", () => {
    test("Get Stock Analysis", async () => {
        const stock = await StockService.addStock(testStock);
        const getStock = await StockService.getStockAnalytics(stock._id.toString());
        expect(getStock?.price).toEqual(stock.timeline[stock.timeline.length - 1].price);
        expect(getStock?.dividend).toEqual(stock.timeline[stock.timeline.length - 1].dividend);
        expect(getStock?.market_valuation).toEqual(stock.timeline[stock.timeline.length - 1].price * stock.gross_volume);
    }, 100000);

    test("Get Non-Existent Stock Analysis", async () => {
        const getStock = await StockService.getStockAnalytics("6581c16df306303bea411736");
        expect(getStock).toBeNull();
    }, 100000);
});

describe("Stock Get All", () => {
    test("Get All Stocks", async () => {
        const stock = await StockService.addStock(testStock);
        const getStocks = await StockService.getAllStocks();
        expect(getStocks).toEqual(expect.arrayContaining([stock._id.toString()]));
    }, 100000);
});


describe("Stock Query", () => {
    test("Get Stock By Company Name", async () => {
        const stock = await StockService.addStock(testStock);
        const getStock = await StockService.getStocksByQuery(stock.company.name);
        expect(getStock).toContainEqual(stock._id.toString());
    });
    test("Get Non-Existent Stock By Company Name", async () => {
        const stock = await StockService.addStock(testStock);
        const getStock = await StockService.getStocksByQuery("Non-Existent");
        expect(getStock).not.toContainEqual(stock._id.toString());
    });
});


