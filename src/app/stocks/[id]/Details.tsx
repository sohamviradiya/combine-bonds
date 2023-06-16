"use client";

import { CompanyInterfaceWithId } from "@/server/types/company.interface";
import { StockInterfaceWithID } from "@/server/types/stock.interface";
export function CompanyDetailsComponent({ company }: { company: CompanyInterfaceWithId }) {
     return (
          <>
               <div style={{ width: '50%', textAlign: 'justify', margin: '1rem', backgroundColor: 'lavender', padding: '1rem' }}>
                    <h3> {company.name}</h3>
                    <h4>Industry: {company.field}</h4>
                    {(company?.established) ? <h5> Established: {(new Date(company?.established)).getFullYear()}</h5> : <></>}
                    <h5>Employees: {company.employees}</h5>
                    <h5>Assets: {company.assets.toLocaleString()} $</h5>
                    <p style={{ fontSize: '1.5rem' }}> Description: {company.description} </p>
               </div >
          </>);
}


export function StockDetailsComponent({ stock }: { stock: StockInterfaceWithID }) {
     return (
          <>
               <div style={{ width: '50%', textAlign: 'justify', margin: '1rem', backgroundColor: 'lightyellow', padding: '1rem' }}>
                    <h2 style={{ marginBottom: '1rem' }}>Price: {stock.price.toFixed(3)}</h2>
                    <h3 style={{ color: `${stock.slope > 0 ? "green" : "red"}`, marginBottom: '1rem' }}>Change %: {(stock.slope * 100).toFixed(3)} %  </h3>
                    <h4 style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>Change $: {(stock.price * stock.slope).toFixed(3)} $</h4>
                    <h4 style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>Fall Since Peak: {(stock.fall_since_peak * 100).toFixed(2)} %</h4>
                    <h4 style={{ color: `${stock.slope > 0 ? "green" : "red"}` }}>Rise Since Trough: {(stock.rise_since_trough * 100).toFixed(2)} %</h4>
               </div>
          </>);
};