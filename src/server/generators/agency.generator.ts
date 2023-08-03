import { addAgency } from "@/server/services/agency.service";
import StockModel from "@/server/models/stock.schema";
import AgencyInterface, { AGENCY_CLASS } from "types/agency.interface";
import { getStockById } from "@/server/services/stock.service";

const generateAgency = async (stock_id: string): Promise<AgencyInterface> => {
    const stock = await getStockById(stock_id);
    const agency_class =
        stock.class == "Bond"
            ? "Steady"
            : Object.values(AGENCY_CLASS)[Math.floor(Math.random() * 4)];
    let steady_increase = 0;
    let random_fluctuation = 0;
    let market_sentiment_dependence_parameter = 0;
    let dividend_ratio = 0;
    if (agency_class == "Steady") {
        steady_increase = 0.4;
        random_fluctuation = 0.1;
        market_sentiment_dependence_parameter = 0.2;
        dividend_ratio = 0.1;
    } else if (agency_class == "Trendy") {
        steady_increase = 0.1;
        random_fluctuation = 0.1;
        market_sentiment_dependence_parameter = 0.4;
        dividend_ratio = 0.2;
    } else if (agency_class == "Random") {
        steady_increase = 0.1;
        random_fluctuation = 0.6;
        market_sentiment_dependence_parameter = 0.1;
        dividend_ratio = 0.8;
    } else if (agency_class == "Aggressive") {
        steady_increase = 0.1;
        random_fluctuation = 0.1;
        market_sentiment_dependence_parameter = 0.2;
        dividend_ratio = 0.4;
    }
    steady_increase += Math.random() * 0.1;
    random_fluctuation += Math.random() * 0.1;
    market_sentiment_dependence_parameter += Math.random() * 0.1;
    let market_volume_dependence_parameter = market_sentiment_dependence_parameter - random_fluctuation - steady_increase;
    return {
        agency_class,
        stock: stock_id,
        market_valuation_parameter: {
            steady_increase,
            random_fluctuation,
            market_sentiment_dependence_parameter,
            market_volume_dependence_parameter,
            dividend_ratio,
        },
    } as AgencyInterface;
};

const AgencyGenerator = async () => {
    const stock_ids = (await StockModel.find({}, { _id: 1 }).exec()).map(
        (stock) => stock._id
    );

    await Promise.all(
        stock_ids.map(async (stock_id) => {
            const agency = await generateAgency(stock_id);
            await addAgency(agency);
        })
    );
};

export default AgencyGenerator;
