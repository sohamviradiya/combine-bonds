import AgencyInterface from "backend/interfaces/agency.interface";
import { AGENCY_CLASS } from "backend/interfaces/agency.interface";
import StockService from "backend/services/stock.service";
import AgencyModel from "backend/models/agency.schema";
const AgencyService = (() => {
	const addAgency = async (agency: AgencyInterface) => {
		const newAgency = new AgencyModel({
			...agency,
		});
		return await newAgency.save();
	};
	const getAgencies = async () => {
		return await AgencyModel.find({}).exec();
	};
	const getAgency = async (agency_id: string) => {
		return await AgencyModel.findById(agency_id).exec();
	};
	return {
		addAgency,
		getAgencies,
		getAgency,
	};
})();

export default AgencyService;
