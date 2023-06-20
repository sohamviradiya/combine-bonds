import StockModel from "@/server/models/stock.schema";
import { Investment } from "@/server/types/portfolio.interface";
import { randomUUID } from "crypto";

export default async function InvestmentListComponent({ investments }: { investments: Investment[] }) {

     const investment_details = await Promise.all(investments.map(async (investment) => {
          const stock = (await StockModel.findById(investment.stock, { name: 1 }));

          return { name: stock.name, quantity: investment.quantity };
     }));
     return (
          <div style={{ height: '100vh', overflow: 'scroll'  , display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
               {investment_details.map((investment) => <InvestmentComponent investment={investment} key={randomUUID()} />)}
          </div>
     );
};


function InvestmentComponent({ investment }: { investment: { name: string, quantity: number } }) {
     return (
          <div style={{border: '2px solid yellow', width: '45%', margin: '0.5rem', padding: '0.5rem'}}>
               <h3>  {investment.name} </h3>
               <p> {investment.quantity.toFixed(2)} shares</p>
          </div>
     );
};
