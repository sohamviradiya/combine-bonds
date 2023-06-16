import { CompanyDetailsComponent, StockDetailsComponent } from "@/app/stocks/[id]/Details";
import { ChartComponent } from "./stockChart";
import CompanyService from "@/server/services/company.service";
import StockService from "@/server/services/stock.service";
import styles from 'src/app/page.module.css'
import { Metadata } from "next";

export default async function Page({ params }: { params: { id: string } }) {
     const stock = await StockService.get(params.id);
     const company = await CompanyService.get(stock.company);
     return (
          <main className={styles.main} style={{ backgroundColor: 'black', color: 'black', fontSize: '2rem', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
               <div style={{ width: '100vw', textAlign: 'center', backgroundColor: 'lightgreen', textOverflow: 'clip', }}>
                    <h1>{stock.name}</h1>
                    <h2>{stock.class}</h2>
               </div>
               <div style={{ width: '100vw', display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
                    <StockDetailsComponent stock={stock} />
                    <CompanyDetailsComponent company={company} />
               </div>
               {/* <ChartComponent timeline={stock.timeline} />  */}
          </main>
     )
};


export const metadata: Metadata = {
     title: "Stock Details",
};