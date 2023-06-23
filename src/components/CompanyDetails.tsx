import { StockLinkComponent } from "@/components/StockLink";

import CompanyService from "@/server/services/company.service";
import { CompanyInterfaceWithId } from "types/company.interface";
import { use } from "react";

export function CompanyDetailsComponent({ company }: { company: CompanyInterfaceWithId; }) {
     return (
          <div style={{ padding: "1rem", border: "2px solid black", backgroundColor: "white" }}>
               <h2>{company.name} {company.field} {company.form} </h2>
               <hr style={{ border: '4px solid grey', margin: '1rem' }} />
               <p>Assets: {(company.assets / 1000000).toFixed(3)} Million $</p>
               <p> Established: {(company.established)?.getFullYear() || ""} </p>
               <p> Employees: {company.employees} </p>
               <p> Market Cap: {(company.market_capitalization / 1000000).toFixed(3)} Million $</p>
               <hr style={{ border: '4px solid grey', margin: '1rem' }} />
               <h3>Stocks: </h3>
               <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                    {company.stocks.map((stock) => (
                         <>
                              <StockLinkComponent key={String(stock.ref)} stock_id={String(stock.ref)} caption={stock.class} />
                         </>
                    ))}
               </div>
          </div>
     );
};

