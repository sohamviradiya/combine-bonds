"use client";

export const host = "http://localhost:3000";
import InvestmentListComponent from "@/app/components/InvestmentList";
import { NetWorthChartComponent } from "@/app/components/NetWorthChart";
import TransactionListComponent from "@/app/components/TransactionList";
import { PortfolioInterfaceWithID } from "types/portfolio.interface";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
     const [portfolio, setPortfolio] = useState<PortfolioInterfaceWithID>({} as PortfolioInterfaceWithID);
     const router = useRouter();
     let id = localStorage.getItem("id") ||
          router.push("/login");
     useEffect(() => {

          fetch(`${host}/api/auth/`
               , {
                    method: "POST",
                    body: JSON.stringify({
                         "id": id
                    }),
               }
          ).then((res) => res.json())
               .then((res) => {
                    setPortfolio(res.portfolio);
               })
               .catch((err) => console.log(err));
     }, [id]);
     return (
          <main
               style={{
                    backgroundColor: "black",
                    color: "black",
                    fontSize: "1.5rem",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
               }}>
               {(portfolio._id) ?
                    <>
                         <div style={{ width: '100%', textAlign: 'center', color: 'lightgreen', textOverflow: 'clip', border: '4px solid blue' }}>
                              <h1>{portfolio.user?.name}</h1>
                              <p>{portfolio.user?.bio}</p>
                         </div>
                         <div style={{ width: '100%', textAlign: 'center', color: 'lightblue', textOverflow: 'clip', border: '4px solid blue' }}>
                              <h2> Current Balance: {portfolio.currentBalance.toFixed(2)} $ </h2>
                              <h2> Current Net Worth: {portfolio.netWorth[portfolio.netWorth.length - 1].value.toFixed(2)} $</h2>
                         </div>
                         <div style={{ width: '100%', textAlign: 'center', textOverflow: 'clip', border: '8px solid blue', display: 'flex', flexDirection: 'row' }}>
                              <div style={{ width: '50%', color: 'lightpink', padding: '1rem' }}>
                                   <h2> Investments </h2>
                                   <InvestmentListComponent investments={portfolio.investments} />
                              </div>

                              <div style={{ width: '50%', color: 'lightpink', padding: '1rem' }}>
                                   <h2> Transactions </h2>
                                   <TransactionListComponent transactions={portfolio.transactions} />
                              </div>
                         </div>
                         <div style={{ width: '100%', height: '100vh', background: 'white', textAlign: 'center', textOverflow: 'clip', border: '8px solid blue', display: 'flex', flexDirection: 'row' }}>
                              <h2> Net Worth: </h2>
                              <NetWorthChartComponent netWorth={portfolio.netWorth} />
                         </div>
                    </> : <h1> Loading </h1>
               }
          </main>
     );
}
