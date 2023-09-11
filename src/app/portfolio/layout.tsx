"use client";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import Background from '@/components/background';
import background from 'public/portfolio-background.svg';

export default function PortfolioLayout({ children, investments, transactions, }: {
    children: React.ReactNode, investments: React.ReactNode, transactions: React.ReactNode,
}) {
    return (
        <Container maxWidth="xl" sx={{ position: "relative" }}>
            <Background src={background} />
        <Grid container spacing={2}>
            <Grid item xs={9}>
                {children}
                <Box marginTop={2}>{investments}</Box>
            </Grid>

            <Grid item xs={3}>
                {transactions}
            </Grid>
            </Grid>
        </Container>
    );
}
