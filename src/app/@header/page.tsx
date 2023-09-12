"use client";
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from 'next/link';
import Dashboard from '@/components/dashboard';


function Header() {
    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters sx={{ justifyContent: 'flex-end'}}>
                    <Link href="/"> <Typography variant="h6" component="div" sx={{ flexGrow: 1, display: { xs: 'block', md: 'none' } }}> Combine-Bonds </Typography> </Link>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        <Dashboard />
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    );
}
export default Header;
