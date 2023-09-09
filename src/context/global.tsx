"use client";

import MaskContext from "./mask";
import QueryContext from "./query";
import ThemeContext from "./theme";

export default function MainContext({ children, }: { children: React.ReactNode }) {
    return (
        <MaskContext>
            <ThemeContext>
                <QueryContext>
                    {children}
                </QueryContext>
            </ThemeContext>
        </MaskContext >
    )
}