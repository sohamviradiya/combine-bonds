import { getPortfolioInvestments } from "@/server/services/portfolio.service";

export async function fetchInvestments({ id, page }: { id: string; page: number }) {
    return await getPortfolioInvestments(id, page);
}