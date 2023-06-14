import CompanyService from "server/services/company.service";
import StockService from "server/services/stock.service";
import styles from 'src/app/page.module.css'

export default async function Page({ params }: { params: { id: string } }) {
     const stock = await StockService.get(params.id);
     const company = await CompanyService.get(stock.company);
     return (
          <main className={styles.main} style={{ backgroundColor: 'black', color: 'black', fontSize: '2rem', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
               <div style={{ width: '100vw', textAlign: 'center', backgroundColor: 'lightgreen' }}>
                    <h1>{stock.name}</h1>
                    <h2>{stock.class}</h2>
               </div>
               <div style={{ width: '100vw', display: 'flex', flexDirection: 'row', justifyContent: 'space-between' , }}>
                    <div style={{ width: '80%', textAlign: 'center', backgroundColor: 'lightblue'}}>
                         <h2>Price: {stock.price.toFixed(3)}</h2>
                         <h3>Rise: {(stock.slope * 100).toFixed(3)} % </h3>
                         <h4>Fall Since Peak: {(stock.fall_since_peak * 100).toFixed(2)} %</h4>
                         <h4>Rise Since Trough: {(stock.rise_since_trough * 100).toFixed(2)} %</h4>
                    </div>
                    <div style={{ width: '80%', textAlign: 'center' ,backgroundColor: 'lightgray' }}>
                         <h2> {company.name}</h2>
                         <h3>Industry: {company.field}</h3>
                         {(company?.established) ? <h4> Established: {(new Date(company?.established)).getFullYear()}</h4> : <></>}
                         <h5>Employees: {company.employees}</h5>
                         <h5>Assets: {company.assets} $</h5>
                    </div>
               </div>
          </main>
     )
};