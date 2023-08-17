import AgencyInterface, { AgencyInterfaceWithId, } from "@/types/agency.interface";
import { AGENCY_PRICE_INCREMENT_PARAMETER } from "@/server/global.config";
import AgencyModel from "@/server/models/agency.schema";
import StockModel from "@/server/models/stock.schema";
import { getRelativeCumulativeNetWorth } from "@/server/services/market.service";
import { addStockValuePoint } from "@/server/services/stock.service";
import { DIVIDEND_FACTOR } from "@/server/global.config";


const addAgency = async (agency: AgencyInterface) => {
    const newAgency = new AgencyModel({
        ...agency,
    });
    return await newAgency.save();
};
const getAllAgencies = async () => {
    return (await AgencyModel.find({}, { _id: 1 }).exec()).map((agency) =>
        String(agency._id)
    );
};

const getAgencyById = async (agency_id: string) => {
    return await AgencyModel.findById(agency_id).exec();
};

const evaluateAgencies = async (agency_id: string, date: number) => {
    const agency: AgencyInterfaceWithId = await getAgencyById(agency_id);
    const parameters = agency.market_valuation_parameter;
    const stock = await StockModel.findById(agency.stock).exec();
    let increase_coefficient = 0;
    increase_coefficient += parameters.steady_increase;

    const random_num = 2 * (Math.random() - 0.5);
    increase_coefficient = parameters.random_fluctuation * random_num;

    const market_sentiment = await getRelativeCumulativeNetWorth();
    increase_coefficient += parameters.market_sentiment_dependence_parameter * market_sentiment;

    let volume_change_ratio = 0;
    if (stock.timeline.length < 2) volume_change_ratio = 1;
    else {
        const current_volume = Number(stock.timeline[stock.timeline.length - 1].volume_in_market);
        const previous_volume = Number(stock.timeline[stock.timeline.length - 2].volume_in_market);
        if (previous_volume === 0)
            volume_change_ratio = current_volume !== 0 ? 1 : 0;
        else
            volume_change_ratio = (current_volume - previous_volume) / previous_volume;
    }
    increase_coefficient += parameters.market_volume_dependence_parameter * volume_change_ratio;

    let market_valuation = stock.timeline[stock.timeline.length - 1].market_valuation;
    market_valuation *= 1 + increase_coefficient * AGENCY_PRICE_INCREMENT_PARAMETER;

    let volume_in_market = stock.timeline[stock.timeline.length - 1].volume_in_market;

    if (stock.traders.length == 0) volume_in_market = 0;
    let dividend = 0;
    if (stock.timeline.length > 2) {
        const latest_market_valuation = stock.timeline[stock.timeline.length - 1].market_valuation;
        const prev_market_valuation = stock.timeline[stock.timeline.length - 2].market_valuation;
        const change_in_market_cap = Number(latest_market_valuation) - Number(prev_market_valuation);
        let gross_dividend = 0;
        if (change_in_market_cap > 0)
            gross_dividend = change_in_market_cap * parameters.dividend_ratio * DIVIDEND_FACTOR;
        dividend = gross_dividend / stock.gross_volume;
    }

    await addStockValuePoint(agency.stock, {
        date,
        market_valuation,
        volume_in_market,
        dividend,
    });

    return market_valuation;
};

export {
    addAgency,
    getAllAgencies,
    getAgencyById,
    evaluateAgencies
};
