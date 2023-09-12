import MainContext from '@/context/main';
import './globals.css'
import { Inter } from 'next/font/google'
import React from 'react';
import { Metadata, ResolvingMetadata } from 'next';
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Combine Bonds',
    description: 'A Stock Market Simulation Application',
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode,
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
