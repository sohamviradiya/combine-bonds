"use client";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#9458fa', // Persian Indigo 500
            light: '#8636f1', // Persian Indigo 600
            dark: '#531a98',  // Persian Indigo 900
        },
        secondary: {
            main: '#8f84ad', // Ship Gray 500
            light: '#81729e', // Ship Gray 600
            dark: '#453d51',  // Ship Gray 900
        },
        error: {
            main: '#ff5757', // Persimmon 400
            light: '#ffa0a0', // Persimmon 300
            dark: '#841818',  // Persimmon 900
        },
        warning: {
            main: '#fc4d13', // Atomic Tangerine 500
            light: '#fe7339', // Atomic Tangerine 400
            dark: '#480707',  // Atomic Tangerine 950
        },
        info: {
            main: '#7162f2', // Minsk 500
            light: '#6245e6', // Minsk 600
            dark: '#2c2b36',  // Minsk 900
        },
        success: {
            main: '#c5e600', // Golden Fizz 500
            light: '#99b800', // Golden Fizz 600
            dark: '#303140',  // Golden Fizz 800
        },
        background: {
            default: '#f6f0f9', // Ship Gray 50
            paper: '#303140',    // Golden Fizz 800
        },
        text: {
            primary: '#f5f7fa',  // Smalt Blue 50
            secondary: '#1f2732', // Smalt Blue 950
            disabled: '#476682', // Smalt Blue 600
        }
    },

    typography: {
        h1: {
            fontFamily: 'Anton, sans-serif',
            fontWeight: 700,
            fontSize: '7rem',
        },
        h2: {
            fontFamily: 'Cinzel Prompt, serif',
            fontWeight: 600,
            fontSize: '5rem',
        },
        h3: {
            fontFamily: 'Maven Pro, sans-serif',
            fontWeight: 500,
            fontSize: '4rem',
        },
        h4: {
            fontFamily: 'Cinzel Prompt, serif',
            fontWeight: 400,
            fontSize: '3rem',
        },
        h5: {
            fontFamily: 'Maven Pro, sans-serif',
            fontWeight: 500,
            fontSize: '2rem',
        },
        h6: {
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
            fontSize: '1rem',
        },
        body1: {
            fontFamily: 'Maven Pro, sans-serif',
            fontWeight: 300,
            fontSize: '0.8rem',
        },
        body2: {
            fontFamily: 'Cinzel Prompt, serif',
            fontWeight: 300,
            fontSize: '0.8rem',
        },
        button: {
            fontFamily: 'Anton, sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
        },
        caption: {
            fontFamily: 'Maven Pro, sans-serif',
            fontWeight: 400,
            fontSize: '0.8rem',
        },
    }
});


export default function ThemeContext({ children }: { children: React.ReactNode }) {
    // TODO: Add theme switcher
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};
