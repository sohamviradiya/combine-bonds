import { Grid, Skeleton, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { StockCard } from "@/components/stock/stock-card";
import { fetchTrendingStocks } from "@/app/analysis/action";

export default function TrendingStocksList() {
    const { data, isLoading, isError } = useQuery({
        queryKey: ['trending-stocks'],
        queryFn: fetchTrendingStocks,
    });
    if (isLoading) {
        return <Skeleton variant="rectangular" width="100%" height="60vh" />;
    }

    if (isError) {
        return <Typography variant="h4" color="error.main">Error fetching trending stocks</Typography>;
    }

    return (
        <Grid container spacing={2}>
            {data.map((stock, index) => (
                <Grid item xs={12} sm={6} md={3} key={stock}>
                    <StockCard id={stock} />
                </Grid>
            ))}
        </Grid>
    )
};

