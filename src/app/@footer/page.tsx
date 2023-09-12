
"use client";

import { BottomNavigation, BottomNavigationAction, Container, Typography } from "@mui/material";
import { GitHub } from "@mui/icons-material";

export default function Footer() {
    return (
        <Container maxWidth="xl">
            <BottomNavigation
                sx={{ backgroundColor: 'primary.main', color: 'white', justifyContent: 'flex-end', }}>
                <Typography variant="h4">  &copy; {new Date().getFullYear()} Soham Viradiya</Typography>
                <BottomNavigationAction label="GitHub" icon={<GitHub />} href="https://github.com/sohamviradiya/combine-bonds" target="_blank" type="h4" />
            </BottomNavigation>
        </Container>
    );
}