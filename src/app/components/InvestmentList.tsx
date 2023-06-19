import StockModel from "@/server/models/stock.schema";
import { Investment } from "@/server/types/portfolio.interface";
import { randomUUID } from "crypto";

export default async function InvestmentListComponent({ investments }: { investments: Investment[] }) {

     const stock_names = new Map<String, String>();
     for (let investment of investments) {
          investment.stock = String(investment.stock);
          if (!stock_names.has(investment.stock)) {
               const stock_name = (await StockModel.findById(investment.stock).select("name")).name;
               stock_names.set(investment.stock, stock_name);
          }
          investment.stock = stock_names.get(investment.stock) as string
     }
     return (
          <>
               {investments.map((investment) => <InvestmentComponent investment={investment} key={randomUUID()} />)}
          </>
     );
};


function InvestmentComponent({ investment }: { investment: Investment }) {
     return (<>
          <h3>  {investment.stock}</h3>
          <p>Quantity: {investment.quantity} shares</p>
     </>);
};
