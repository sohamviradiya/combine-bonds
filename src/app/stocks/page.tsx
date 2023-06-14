import Image from 'next/image'
import styles from 'src/app/page.module.css'
import { Metadata } from 'next'
import StockService from 'server/services/stock.service'
import Link from 'next/link'
export default async function Page() {
     const stocks = await StockService.getAll();
     stocks.sort((a, b) => (a[a.length - 1] > b[b.length - 1]) ? 1 : -1);
     return (
          <main className={styles.main} style={{ backgroundColor: 'white', color: 'black', fontSize: '2rem', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-around' }}>
               {(stocks.map(stock => (<div key={stock} style={{ margin: '2rem', border: '4px solid black' }}>
                    {stockDetails(stock)}
               </div>)))}
          </main>
     )
};

async function stockDetails(stock_id: string) {
     const stock = await StockService.get(stock_id);
     return (
          <div style={{ backgroundColor: `${stock.class == "Voting" ? 'lightblue' : 'yellow'}`, padding: '2rem', border: '2px solid black' }}>
               <h2>{stock.name}</h2>
               <p>Gross Volume: {stock.gross_volume}</p>
               <p>Class: {stock.class}</p>
               <p>Issued At: {stock.createdAt.toDateString()}</p>
               <p>Rise: {(stock.slope * 100).toFixed(3)} % </p>
               <p>Price: {stock.price.toFixed(3)}</p>
               <p>Fall Since Peak: {(stock.fall_since_peak * 100).toFixed(2)} %</p>
               <p>Rise Since Trough: {(stock.rise_since_trough * 100).toFixed(2)} %</p>
               <button className="dark-button" style={{ background: 'black', padding: '0.5rem', fontSize: '2rem' }}> <Link href={`/stocks/${stock_id}`}>View</Link></button>
          </div>
     )
}

export const metadata: Metadata = {
     title: 'Stocks',
};

