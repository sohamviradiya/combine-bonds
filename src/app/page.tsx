import styles from './page.module.css'
import Link from 'next/link';

export default function Home() {
  return (
    <main
      className={styles.main} style={{ display: 'flex', width: '100%', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: '2rem' }} >
      <header style={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'column', justifyContent: 'space-between', marginBottom: '1rem' }} >
        <h1>Combine Bonds</h1>
        <h2>Welcome to Combine Bonds, your ultimate stock-trading platform.</h2>
      </header>
      <main>
        <section className={styles.section}>
          <h2> Visit our pages: </h2>
          <div style={{ display: 'flex', width: '100%', alignItems: 'center', flexDirection: 'row', justifyContent: 'center', marginBottom: '1rem', gap: '1rem' }} >
            <Link href="/stocks"> <h2 style={{color:'blue'}}> Stocks </h2> </Link>
            <Link href="/companies"> <h2 style={{ color: 'green' }}> Companies </h2> </Link>
            <Link href="/login"> <h2 style={{ color: 'red' }}> Login or SignUp </h2> </Link>
          </div>
        </section>
        <section className={styles.section}>
          <div>
            <h1>Trade with Confidence</h1>
            <p>Combine Bonds provides a secure and efficient trading experience.</p>
          </div>
        </section>
        <section className={styles.section}>
          <div>
            <h2>Real-Time Data</h2>
            <p>Access up-to-date stock prices and market trends.</p>
          </div>
          <div>
            <h2>Advanced Tools</h2>
            <p>Utilize powerful trading tools and analytics.</p>
          </div>
          <div>
            <h2>Portfolio Management</h2>
            <p>Effortlessly track and manage your investments.</p>
          </div>
        </section>
        <section className={styles.section}>
          <div>
            <h2>Join thousands of successful traders</h2>
            <p>&ldquo; Combine Bonds helped me achieve financial freedom by providing a user-friendly platform and valuable market insights. &ldquo;</p>
          </div>
        </section>
      </main>
      <footer className={styles.section}>
        <p>&copy; {new Date().getFullYear()} Combine Bonds. All rights reserved.</p>
      </footer>
    </main>
  )
}


