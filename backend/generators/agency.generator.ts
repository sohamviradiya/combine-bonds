import AgencyInterface, {
	AGENCY_CLASS,
} from "backend/interfaces/agency.interface";
import StockService from "backend/services/stock.service";

export default async (stock_id: string): Promise<AgencyInterface> => {
	const stock = await StockService.getStock(stock_id);
	const agency_class: keyof typeof AGENCY_CLASS =
		stock.class == "Bond"
			? "Steady"
			: Object.keys(AGENCY_CLASS)[
					Math.floor(Math.random() * Object.keys(AGENCY_CLASS).length)
			  ] as keyof typeof AGENCY_CLASS;
     return {
          class: agency_class,
          stock: stock_id,
     };
};
