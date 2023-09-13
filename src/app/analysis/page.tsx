"use client";

import Background from '@/components/background';
import PredictedStocksList from '@/app/analysis/predicted-stocks';
import TrendingStocksList from '@/app/analysis/trending-stocks';
import { Typography, Container, Paper } from '@mui/material';
import background from 'public/special-background.svg';
import MarketTimeline from '@/app/analysis/market-timeline';

export default function StockList() {
    return (<>
            <Background src={background} />
            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h2" gutterBottom>
                    Top Trending Stocks
                </Typography>
                <TrendingStocksList />
            </Paper>

            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h2" gutterBottom>
                    Top Predicted Stocks
                </Typography>
                <PredictedStocksList />
            </Paper>

            <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h2" gutterBottom>
                    Market Timelines:
                </Typography>
                <MarketTimeline />
            </Paper>
    </>
    );
};