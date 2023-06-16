import styles from "src/app/page.module.css";
import { Metadata } from "next";
import StockService from "@/server/services/stock.service";
import { StockLinkComponent } from "@/app/stocks/stockLink";
import CompanyService from "@/server/services/company.service";
import { Suspense, use } from "react";
import { CompanyInterfaceWithId } from "@/server/types/company.interface";
import { useState, useEffect } from "react";
export default async function Page() {
     const companyIds = await CompanyService.getAll();
     companyIds.sort((a, b) => (a[a.length - 1] > b[b.length - 1] ? 1 : -1));
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
               {await Promise.all(companyIds.map(async (companyId) => (
                    <div key={companyId} style={{ margin: "2rem", border: "4px solid black" }}>
                         {await CompanyDetailsComponent({ company_id: companyId })}
                    </div>
               )))}
          </main>
     );
}


async function CompanyDetailsComponent({ company_id }: { company_id: string }) {
     const company = await CompanyService.get(company_id);
     if (!company) {
          return <div>Loading...</div>;
     }
     else {
          return (
               <div style={{ padding: "2rem", border: "2px solid black" }}>
                    <h2>{company.name}</h2>
                    <p>Assets: {company.assets} $</p>
                    <p> Established: {(company.established)?.getFullYear() || ""} </p>
                    <p> Employees: {company.employees} </p>
                    <h3>Stocks: </h3>
                    <div style={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}>
                         {company.stocks.map((stock) => (
                              <>
                                   <StockLinkComponent key={stock.ref} stock_id={stock.ref} caption={stock.class} />
                              </>
                         ))}
                    </div>
               </div>
          );
     }
}


export const metadata: Metadata = {
     title: "Stocks",
};
