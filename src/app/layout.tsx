import MainContext from '@/context/global';
import './globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Combine-Bonds',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <MainContext>
                    {children}
                </MainContext>
            </body>
        </html>
    )
}
