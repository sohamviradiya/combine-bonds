"use client";


export const host = "http://localhost:3000";
import { Investment } from "types/portfolio.interface";
import { randomUUID } from "crypto";
import { use, useEffect, useState } from "react";

export default function InvestmentListComponent({ investments }: { investments: Investment[] }) {

     const [investment_details, setInvestmentDetails] = useState<{ name: string, quantity: number }[]>([]);

     useEffect(() => {

          (Promise.all(investments.map(async (investment) => {
               const stock = await (fetch(`${host}/api/stock/${investment.stock}`)
                    .then((res) => {
                       return res.json()
                    })
                    .then((res) => {
                         return res;
                    }));
               console.log(stock);
               return { name: stock.name, quantity: investment.quantity };
          }))).then((res) => setInvestmentDetails(res));
     }, [investments]);
     return (
          <div style={{ height: '100vh', overflow: 'scroll', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
               {investment_details.map((investment) => <InvestmentComponent investment={investment} key={investment.name} />)}
          </div>
     );
};


function InvestmentComponent({ investment }: { investment: { name: string, quantity: number } }) {
     return (
          <div style={{ border: '2px solid yellow', width: '45%', margin: '0.5rem', padding: '0.5rem' }}>
               <h3>  {investment.name} </h3>
               <p> {investment.quantity.toFixed(2)} shares</p>
          </div>
     );
};
