import { useQuery } from "@tanstack/react-query";
import { fetchMarketTimeline } from "@/app/analysis/action";
import { Paper, Skeleton, Typography } from "@mui/material";
import Graph from "@/components/graph";

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
        <Paper elevation={3} style={{ marginBottom: '20px' }}>
            <Graph data={data.map((entry) => ({ date: entry.date, value: entry.cumulative_market_capitalization/ 10 ** 9}))} title="Gross Market Capitalization Timeline" tickFormatter={(value) => (`${value.toFixed(2)} B`)} />
        </Paper>

        <Paper elevation={3} style={{ marginBottom: '20px' }}>
            <Graph data={data.map((entry) => ({ date: entry.date, value: entry.cumulative_net_worth / 10 ** 6 }))} title="Gross Net Worth Timeline" tickFormatter={(value) => (`${value.toFixed(2)} M`)} />
         </Paper>

        <Paper elevation={3} style={{ marginBottom: '20px' }}>
            <Graph data={data.map((entry) => ({ date: entry.date, value: entry.market_sentience_index }))} title="Market Index Timeline" tickFormatter={(value) => (`${value.toFixed(2)} P`)} />
         </Paper>
    </>);
}