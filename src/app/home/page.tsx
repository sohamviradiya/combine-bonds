"use client";
import { Container, Paper, Typography } from '@mui/material';
import Link from 'next/link';
import background from '/public/main-background.svg';
import Background from '@/components/background';
import MarketAnalyticsComponent from '@/app/home/market-analytics';

export default function Home() {
    return (
        <>
            <Container
                maxWidth="xl"
                sx={{
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    padding: '16px',
                }}
            >
                <Background src={background} />

                <Paper
                    elevation={3}
                    sx={{
                        padding: '16px',
                        marginBottom: '16px',
                    }}
                >
                    <Typography variant="h1" gutterBottom>
                        Combine-Bonds
                    </Typography>
                    <Typography variant="h2" gutterBottom>
                        Stock Market Simulation
                    </Typography>
                </Paper>

                <Paper
                    elevation={3}
                    sx={{
                        padding: '16px',
                        marginBottom: '16px',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Explore the Market: Invest in 60+ stock options
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        Explore our <HomeLink text="Analytics" link="/analysis" color="info.main" /> Page
                    </Typography>
                    <Typography variant="h4" gutterBottom>
                        Explore our <HomeLink text="Stocks" link="/stock" color="success.main" /> Page
                    </Typography>
                </Paper>

                <Paper
                    elevation={3}
                    sx={{
                        padding: '16px',
                        marginBottom: '16px',
                    }}
                >
                    <Typography variant="h4" gutterBottom>
                        Current Market Situation:
                    </Typography>
                    <MarketAnalyticsComponent />
                </Paper>
            </Container>
        </>
    );
}


function HomeLink({ text, link, color }: { text: string, link: string, color: string }) {
    return (
        <Typography variant="h4" component="span" sx={{ color }}>
            <Link href={link}> {text} </Link>
        </Typography>
    );
};