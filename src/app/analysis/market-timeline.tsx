import { useQuery } from "@tanstack/react-query";
import { fetchMarketTimeline } from "./action";
import { Paper, Skeleton, Typography } from "@mui/material";
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
        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h2" gutterBottom> Gross Market Capitalization Timeline </Typography>
            <MarketCapitalizationGraph data={data} />
        </Paper>

        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h2" gutterBottom> Gross Net Worth Timeline </Typography>
            <NetWorthGraph data={data} />
        </Paper>

        <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
            <Typography variant="h2" gutterBottom> Market Sentience Index Timeline </Typography>
            <MarketIndexGraph data={data} />
        </Paper>
    </>);
}