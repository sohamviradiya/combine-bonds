import AgencyInterface, { AgencyInterfaceWithId, } from "@/types/agency.interface";
import AgencyModel from "@/server/models/agency.schema";
import { AGENCY_PRICE_INCREMENT } from "@/server/global.config";

import { addStockValuePoint, getStockById } from "@/server/services/stock.service";

import { getMarketAnalytics } from "@/server/services/market.service";

import { DIVIDEND_FACTOR } from "@/server/global.config";


export const addAgency = async (agency: AgencyInterface) => {
    const newAgency = new AgencyModel({ ...agency, });
    return await newAgency.save();
};

export const getAllAgencies = async () => {
    return (await AgencyModel.find({}, { _id: 1 }).exec()).map((agency: AgencyInterfaceWithId) => String(agency._id));
};

export const getAgencyById = async (agency_id: string) => {
    return await AgencyModel.findById(agency_id).exec() as AgencyInterfaceWithId;
};

export const evaluateAgencies = async (agency_id: string, date: number) => {
    const agency: AgencyInterfaceWithId = await getAgencyById(agency_id);
    const parameters = agency.parameters;
    const stock = await getStockById(agency.stock);

    const random_num = 2 * (Math.random() - 0.5);

    const market = await getMarketAnalytics();
    const market_sentiment = market.relative_cumulative_net_worth;

    let volume_change_ratio = 0;
    if (stock.timeline.length < 2) volume_change_ratio = 1;
    else {
        const current_volume = Number(stock.timeline[stock.timeline.length - 1].volume);
        const previous_volume = Number(stock.timeline[stock.timeline.length - 2].volume);
        if (previous_volume === 0)
            volume_change_ratio = current_volume == 0 ? 0 : 1;
        else
            volume_change_ratio = (current_volume - previous_volume) / previous_volume;
    }
    let increase_coefficient = parameters.market_sentiment * market_sentiment + parameters.steady_increase + parameters.random_fluctuation * random_num + parameters.market_volume * volume_change_ratio;

    let price = stock.timeline[stock.timeline.length - 1].price;
    price *= (1 + increase_coefficient * AGENCY_PRICE_INCREMENT);

    let volume = stock.timeline[stock.timeline.length - 1].volume;

    if (stock.traders.length == 0) volume = 0;
    let dividend = 0;
    if (stock.timeline.length > 2) {
        const latest_price = stock.timeline[stock.timeline.length - 1].price;
        const prev_price = stock.timeline[stock.timeline.length - 2].price;
        const change_in_price = Number(latest_price) - Number(prev_price);
        dividend = Math.max(change_in_price, 0) * parameters.dividend * DIVIDEND_FACTOR;
    }

    await addStockValuePoint(agency.stock, {
        date,
        price,
        volume,
        dividend,
    });

    return price;
};