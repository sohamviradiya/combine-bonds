"use client";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#9458faaa', // Persian Indigo 500
            light: '#8636f1aa', // Persian Indigo 600
            dark: '#531a98aa', // Persian Indigo 900
        },
        secondary: {
            main: '#8f84adaa', // Ship Gray 500
            light: '#81729eaa', // Ship Gray 600
            dark: '#453d51aa', // Ship Gray 900
        },
        error: {
            main: '#ff5757aa', // Persimmon 400
            light: '#ffa0a0aa', // Persimmon 300
            dark: '#841818aa', // Persimmon 900
        },
        warning: {
            main: '#fc4d13aa', // Atomic Tangerine 500
            light: '#fe7339aa', // Atomic Tangerine 400
            dark: '#480707aa', // Atomic Tangerine 950
        },
        info: {
            main: '#7162f2aa', // Minsk 500
            light: '#6245e6aa', // Minsk 600
            dark: '#2c2b36aa', // Minsk 900
        },
        success: {
            main: '#c5e600aa', // Golden Fizz 500
            light: '#99b800aa', // Golden Fizz 600
            dark: '#303140aa', // Golden Fizz 800
        },
        background: {
            default: '#f6f0f9aa', // Ship Gray 50
            paper: '#303140aa', // Golden Fizz 800
        },
        text: {
            primary: '#f5f7fa', // Smalt Blue 50
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


export default function ThemeContextProvider({ children }: { children: React.ReactNode }) {
    // TODO: Add theme switcher
    return (
        <ThemeProvider theme={theme}>
            {children}
        </ThemeProvider>
    );
};
