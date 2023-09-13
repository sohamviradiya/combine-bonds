"use client";

import MaskProvider from "@/context/mask";
import QueryProvider from "@/context/query";
import ThemeContextProvider from "@/context/theme";
import SessionProvider from "@/context/session";

export default function MainContext({ children, }: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <QueryProvider>
                <ThemeContextProvider>
                    <MaskProvider>
                        <>
                            {children}
                        </>
                    </MaskProvider>
                </ThemeContextProvider>
            </QueryProvider>
        </SessionProvider>
    )
}