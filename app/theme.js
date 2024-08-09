'use client';

import React from "react";
import "./globals.css";
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        background: {
            default: '#ffe6ea', // light pink 
            first: 'rgba(255, 252, 253, 1)',
            second: 'rgba(255, 230, 234, 1)',
        },
        primary: {
            main: '#FFC0CB', // user chat
            //#00FF00
            highlight: '#fff2f4',
            border: '#ba5061'
        },
        secondary: {
            main: '#b7aef2',
        },
    },
	typography: {
        fontFamily: 'cursive, "Brush Script MT", "Brush Script Std", sans-serif',
        h1: {
            fontSize: '3rem',
        },
        h2: {
            fontSize: '1.75rem',
        },
        h3: {
            fontSize: '1.5rem',
        },
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    backgroundColor: '#FFC0CB',
                }
            }
        }
    }
	
});

export default theme;