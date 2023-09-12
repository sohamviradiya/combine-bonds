
import MainContext from '@/context/main';
import './globals.css'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
    title: 'Combine-Bonds',
};

export default function RootLayout({
    children,
    header,
    footer,
}: {
    children: React.ReactNode,
    header: React.ReactNode,
    footer: React.ReactNode,
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <MainContext>
                    {header}
                    {children}
                    {footer}
                </MainContext>
            </body>
        </html>
    )
}
