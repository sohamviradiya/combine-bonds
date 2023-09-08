import AgencyInterface, { AGENCY_TYPES } from "@/types/agency.interface";
import { addAgency } from "@/server/services/agency.service";
import { getAllStocks } from "../services/stock.service";

const AgencyGenerator = async () => {
    const stock_ids = await getAllStocks();

    await Promise.all(
        stock_ids.map(async (stock_id) => {
            const agency = await generateAgency(stock_id);
            await addAgency(agency);
        })
    );
};

const generateAgency = async (stock_id: string): Promise<AgencyInterface> => {
    const agency_type = Object.values(AGENCY_TYPES)[Math.floor(Math.random() * 4)];
    let steady_increase = 0;
    let random_fluctuation = 0;
    let market_sentiment = 0;
    let dividend = 0;
    if (agency_type == "Steady") {
        steady_increase = 0.4;
        random_fluctuation = 0.1;
        market_sentiment = 0.2;
        dividend = 0.1;
    } else if (agency_type == "Trendy") {
        steady_increase = 0.1;
        random_fluctuation = 0.1;
        market_sentiment = 0.4;
        dividend = 0.2;
    } else if (agency_type == "Random") {
        steady_increase = 0.1;
        random_fluctuation = 0.6;
        market_sentiment = 0.1;
        dividend = 0.8;
    } else if (agency_type == "Aggressive") {
        steady_increase = 0.1;
        random_fluctuation = 0.1;
        market_sentiment = 0.2;
        dividend = 0.4;
    }
    steady_increase += Math.random() * 0.1;
    random_fluctuation += Math.random() * 0.1;
    market_sentiment += Math.random() * 0.1;
    let market_volume = 1 - market_sentiment - random_fluctuation - steady_increase;
    return {
        type: agency_type,
        stock: stock_id,
        parameters: {
            steady_increase,
            random_fluctuation,
            market_sentiment,
            market_volume,
            dividend,
        },
    } as AgencyInterface;
};



export default AgencyGenerator;
