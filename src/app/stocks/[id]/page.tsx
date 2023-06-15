import CompanyDetailsComponent from "@/components/Details";
import { ChartComponent } from "@/components/stockChart";
import CompanyService from "server/services/company.service";
import StockService from "server/services/stock.service";
import { StockInterfaceWithID } from "server/types/stock.interface";
import styles from 'src/app/page.module.css'

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
               {/* <ChartComponent timeline={stock.timeline} /> */}
          </main>
     )
};

export function StockDetailsComponent({ stock }: { stock: StockInterfaceWithID }) {
     return (
          <>
               <div style={{ width: '50%', textAlign: 'justify', margin: '1rem', backgroundColor: 'lightyellow' , padding: '1rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Price: {stock.price.toFixed(3)}</h2>
                    <h3 style={{ color: `${stock.slope > 0 ? "green" : "red"}`, marginBottom: '1rem' }}>Change %: {(stock.slope * 100).toFixed(3)} %  </h3>
                    <h4 style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>Change $: {(stock.price*stock.slope).toFixed(3)} $</h4>
                    <h4 style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>Fall Since Peak: {(stock.fall_since_peak * 100).toFixed(2)} %</h4>
                    <h4 style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>Rise Since Trough: {(stock.rise_since_trough * 100).toFixed(2)} %</h4>
               </div>
          </>);
};