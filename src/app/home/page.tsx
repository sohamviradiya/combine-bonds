"use client";

import { Container, Typography } from '@mui/material';
import background from '/public/main-background.svg';
import Background from '@/components/background';
import MarketAnalyticsComponent from './market-analytics';

export default function Home() {
    return (
        <>
            <Container maxWidth="xl" sx={{
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}>
                <Background src={background} />
                <section>
                    <Typography variant="h1" gutterBottom>
                        Combine-Bonds
                    </Typography>
                    <Typography variant="h2" gutterBottom>
                        Stock Market Simulation
                    </Typography>
                </section>
                <section>
                    <Typography variant="h4" gutterBottom>
                        User Offers and Insights
                    </Typography>
                    <MarketAnalyticsComponent />
                </section>
                <section>
                    <Typography variant="h4" gutterBottom>
                        About the Simulation
                    </Typography>
                    {/* Add your content for the third section here */}
                </section>
            </Container>
        </>
    );
}


