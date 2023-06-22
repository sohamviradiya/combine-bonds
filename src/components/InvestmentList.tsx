"use client";

import { Investment } from "types/portfolio.interface";
import { randomUUID } from "crypto";
import { use, useEffect, useState } from "react";

export default function InvestmentListComponent({ investments }: { investments: Investment[] }) {

     const [investment_details, setInvestmentDetails] = useState<{ name: string, amount: number }[]>([]);

     useEffect(() => {

          (Promise.all(investments.map(async (investment) => {
               const stock = await (fetch(`${window.location.host}/api/stock/${investment.stock}`)
                    .then((res) => {
                         return res.json()
                    })
                    .then((res) => {
                         return res;
                    }));
               console.log(stock);
               return { name: stock.name, amount: investment.quantity * stock.price };
          }))).then((res) => setInvestmentDetails(res));
     }, [investments]);
     return (
          <div style={{ height: '100vh', overflow: 'scroll', display: 'flex', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap' }}>
               {investment_details.map((investment) => <InvestmentComponent investment={investment} key={investment.name} />)}
          </div>
     );
};


function InvestmentComponent({ investment }: { investment: { name: string, amount: number } }) {
     return (
          <div style={{ border: '2px solid yellow', width: '45%', margin: '0.5rem', padding: '0.5rem' }}>
               <h3>  {investment.name} </h3>
               <p> {investment.amount.toFixed(2)}$</p>
          </div>
     );
};

