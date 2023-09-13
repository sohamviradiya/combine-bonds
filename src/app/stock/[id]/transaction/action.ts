"use server";

import { getSessionById } from "@/server/services/auth.service";
import { getPosition, performTransactions } from "@/server/services/portfolio.service";
import { TRANSACTION_TYPES } from "@/types/portfolio.interface";

export async function fetchPosition({ stock, portfolio }: { stock: string, portfolio: string }) {
    return await getPosition(stock, portfolio);
}

export async function postTransaction({ stock, session_id, amount }: { stock: string, session_id: string, amount: number }) {
    let type = TRANSACTION_TYPES.STOCK_PURCHASE;
    if (amount < 0) {
        type = TRANSACTION_TYPES.STOCK_SALE;
        amount = -amount;
    }
    const session = await getSessionById(session_id);
    if (!session) return {
        message: "Session not found",
    };
    const portfolio = session.portfolio;
    await performTransactions(portfolio, [{ type, stock, amount, date: 0 }]);
    return {
        message: "Success",
    }
}