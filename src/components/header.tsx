"use client";
import { Box, Typography, Container } from '@mui/material';
import Dashboard from '@/components/dashboard';
import Link from 'next/link';

function Header() {
    return (
        <Container sx={{ width: "100vw", padding: "1rem", display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
            <Link href="/"> <Typography variant="h4" component="div" sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }} color="secondary.dark" > Combine-Bonds </Typography> </Link>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <Dashboard />
            </Box>
        </Container>
    );
}
export default Header;
