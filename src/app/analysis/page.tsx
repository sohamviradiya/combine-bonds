"use client";

import Background from '@/components/background';
import PredictedStocksList from '@/app/analysis/predicted-stocks';
import TrendingStocksList from '@/app/analysis/trending-stocks';
import { Typography, Container } from '@mui/material';
import background from 'public/special-background.svg';
import MarketTimeline from './market-timeline';

export default function StockList() {
    return (<>
        <Container sx={{
            position: 'relative', padding: '2rem'
        }} maxWidth="xl">
            <Background src={background} />
            <Typography variant="h2" gutterBottom> Top Trending Stocks</Typography>
            <TrendingStocksList />
            <Typography variant="h2" gutterBottom> Top Predicted Stocks </Typography>
            <PredictedStocksList />
            <Typography variant="h2" gutterBottom> Market Timeline </Typography>
            <MarketTimeline />
        </Container>
    </>
    );
};