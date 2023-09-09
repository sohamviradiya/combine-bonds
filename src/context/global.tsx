"use client";

import MaskContext from "./mask";
import QueryContext from "./query";
import ThemeContext from "./theme";

export default function MainContext({ children, }: { children: React.ReactNode }) {
    return (
        <ThemeContext>
            <MaskContext>
                <QueryContext>
                    {children}
                </QueryContext>
            </MaskContext >
        </ThemeContext>
    )
}