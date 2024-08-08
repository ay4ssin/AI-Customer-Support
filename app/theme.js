'use client';

import React from "react";
import "./globals.css";
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#6d5fd4',
            highlight: '#e2deff'
        },
        secondary: {
            main: '#b7aef2',
        },
    },
	typography: {
        fontFamily:'Segoe UI',
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
	
});

export default theme;