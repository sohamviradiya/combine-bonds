import { Grid, Paper, Skeleton, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import DataTypography from '@/components/data-typography';
import { fetchMarketAnalytics } from './action';

export default function MarketAnalyticsComponent() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['market-analytics'],
        queryFn: fetchMarketAnalytics,
    });

    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="20vh" />;
    }

    if (isError) {
        return <Typography variant="h4" color="error.main">Error loading market analytics</Typography>;
    }

    const {
        market_index,
        relative_cumulative_net_worth,
        relative_cumulative_market_capitalization,
        market_index_change,
    } = data;

    return (<Paper elevation={3} sx={{ padding: '16px', backgroundColor: 'primary.dark' }} >
        <Grid container spacing={2}>
            <Grid item xs={3}>
                <Typography variant="h5">Market Index</Typography>
                <DataTypography value={market_index} unit="points" />
            </Grid>
            <Grid item xs={3}>
                <Typography variant="h5">Net Worth</Typography>
                <DataTypography value={relative_cumulative_net_worth * 100} unit="%" sign />
            </Grid>
            <Grid item xs={3}>
                <Typography variant="h5">Market Cap</Typography>
                <DataTypography value={relative_cumulative_market_capitalization * 100} unit="%" sign />
            </Grid>
            <Grid item xs={3}>
                <Typography variant="h5">Market Index Change</Typography>
                <DataTypography value={market_index_change} unit="points" sign />
            </Grid>
        </Grid>
    </Paper>);
}


