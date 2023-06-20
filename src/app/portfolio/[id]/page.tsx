import styles from "@/app/page.module.css";
import PortfolioService from "@/server/services/portfolio.service";
import InvestmentListComponent from "../../components/InvestmentList";
import { NetWorthChartComponent } from "../../components/NetWorthChart";
import TransactionListComponent from "@/app/components/TransactionList";

export default async function Page({ params }: { params: { id: string } }) {
     const portfolio = await PortfolioService.get(params.id);
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
                         {await InvestmentListComponent({ investments: portfolio.investments })}
                    </div>

                    <div style={{ width: '50%', color: 'lightpink', padding: '1rem' }}>
                         <h2> Transactions </h2>
                         {await TransactionListComponent({ transactions: portfolio.transactions })}
                    </div>
                    {/* <NetWorthChartComponent netWorth={portfolio.netWorth} /> */}

               </div>
          </main>
     );
}
