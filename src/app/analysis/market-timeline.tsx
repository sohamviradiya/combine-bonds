import { useQuery } from "@tanstack/react-query";
import { fetchMarketTimeline } from "./action";
import { Skeleton, Typography } from "@mui/material";
import MarketCapitalizationGraph from "@/components/graphs/cumulative-market-cap";
import NetWorthGraph from "@/components/graphs/cumulative-net-worth";
import MarketIndexGraph from "@/components/graphs/market-index";


export default function MarketTimeline() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['market-timeline'],
        queryFn: fetchMarketTimeline,
    });
    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="80vh" />;
    }
    if (isError) {
        return <Typography variant="h4" color="error.main">Error fetching Market Timeline</Typography>;
    }

    return (<>
        <MarketCapitalizationGraph data={data.map(({ date, cumulative_market_capitalization }) => ({ date, cumulative_market_capitalization }))} />
        <NetWorthGraph data={data.map(({ date, cumulative_net_worth }) => ({ date, cumulative_net_worth }))} />
        <MarketIndexGraph data={data.map(({ date, market_sentience_index }) => ({ date, market_sentience_index }))} />
    </>);
}