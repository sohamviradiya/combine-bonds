import styles from "src/app/page.module.css";
import { Metadata } from "next";
import StockService from "server/services/stock.service";
import { StockLinkComponent } from "@/components/stockLink";

export default async function Page() {
     const stockIds = await StockService.getAll();
     stockIds.sort((a, b) => (a[a.length - 1] > b[b.length - 1] ? 1 : -1));
     return (
          <main
               className={styles.main}
               style={{
                    backgroundColor: "white",
                    color: "black",
                    fontSize: "2rem",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    justifyContent: "space-around",
               }}>
               {stockIds.map((stockId) => (
                    <div key={stockId} style={{ margin: "2rem", border: "4px solid black" }}>
                         {getstockDetails(stockId)}
                    </div>
               ))}
          </main>
     );
}


async function getstockDetails(stock_id: string) {
     const stock = await StockService.get(stock_id);
     return (
          <div style={{ padding: "2rem", border: "2px solid black" }}>
               <h2>{stock.name}</h2>
               <p>Gross Volume: {stock.gross_volume}</p>
               <p>Class: {stock.class}</p>
               <p>Issued At: {stock.createdAt.toDateString()}</p>
               <p style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>Rise: {(stock.slope * 100).toFixed(3)} % </p>
               <p style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>Price: {stock.price.toFixed(3)}</p>
               <p style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>
                    Fall Since Peak: {(stock.fall_since_peak * 100).toFixed(2)} %
               </p>
               <p style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>
                    Rise Since Trough: {(stock.rise_since_trough * 100).toFixed(2)} %
               </p>
               {<StockLinkComponent stock_id={stock_id} />}
          </div>
     );
}


export const metadata: Metadata = {
     title: "Stocks",
};
