import StockService from "@/server/services/stock.service";
import { use } from "react";
import { StockLinkComponent } from "./StockLink";
import { StockInterfaceWithID } from "@/server/types/stock.interface";

export default function StockDetailsComponentFromID(props: { stock_id: string }) {
     const stock = use(StockService.get(props.stock_id));
     return <StockDetailsComponent stock={stock} />;
}

export function StockDetailsComponent({ stock }: { stock: StockInterfaceWithID }) {
     const last_value = stock.timeline[stock.timeline.length - 1];
     return (
          <div style={{
               padding: "1.5rem", border: "2px solid black", background: "yellow", margin: "2rem"
          }}>
               <h2>{stock.name}</h2>
               <p>Market Cap: {((last_value.market_valuation / 1000000).toFixed(2)).toString()} Million $</p>
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
               {<StockLinkComponent stock_id={String(stock._id)} caption="View" />}
          </div>
     );
}

