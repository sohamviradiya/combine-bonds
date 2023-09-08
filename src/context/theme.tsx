"use client";

import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#9458fa', // Persian Indigo 500
            light: '#8636f1', // Persian Indigo 600
            dark: '#7724dd',  // Persian Indigo 700 
        },
        secondary: {
            main: '#8f84ad', // Ship Gray 500
            light: '#81729e', // Ship Gray 600
            dark: '#76668f',  // Ship Gray 700 
        },
        error: {
            main: '#ff5757', // Persimmon 400
            light: '#ffa0a0', // Persimmon 300
            dark: '#e51d1d',  // Persimmon 600 
        },
        warning: {
            main: '#fc4d13', // Atomic Tangerine 500
            light: '#fe7339', // Atomic Tangerine 400
            dark: '#ed3309',  // Atomic Tangerine 600 
        },
        info: {
            main: '#7162f2', // Minsk 500
            light: '#6245e6', // Minsk 600
            dark: '#5437cb',  // Minsk 700 
        },
        success: {
            main: '#c5e600', // Golden Fizz 500
            light: '#99b800', // Golden Fizz 600
            dark: '#738b00',  // Golden Fizz 700 
        },
        background: {
            default: '#f6f0f9', // Ship Gray 50
            paper: '#f6f3ff',  // Persian Indigo 50
        },
        text: {
            primary: '#000000', // Black
            secondary: '#ffffff', // White
            disabled: '#a3a3a3', // Gray 500
        }
    },
    typography: {
        h1: {
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
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
            fontSize: '3rem',
        },
        h4: {
            fontFamily: 'Cinzel Prompt, serif',
            fontWeight: 400,
            fontSize: '2rem',
        },
        h5: {
            fontFamily: 'Maven Pro, sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
        },
        h6: {
            fontFamily: 'Anton, sans-serif',
            fontWeight: 400,
            fontSize: '0.875rem',
        },
        body1: {
            fontFamily: 'Maven Pro, sans-serif',
            fontWeight: 400,
            fontSize: '1rem',
        },
        body2: {
            fontFamily: 'Cinzel Prompt, serif',
            fontWeight: 400,
            fontSize: '1rem',
        },
        button: {
            fontFamily: 'Anton, sans-serif',
            fontWeight: 500,
            fontSize: '1rem',
        },
        caption: {
            fontFamily: 'Maven Pro, sans-serif',
            fontWeight: 400,
            fontSize: '0.875rem',
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
