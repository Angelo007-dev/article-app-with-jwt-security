import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { visit } from './utils';

export default function LoadPage() {
    useEffect(() => {
        const timer = setTimeout(() => {
            visit('/main/home');
        }, 1000);
        return () => clearTimeout(timer);
    }, []);
    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            height="100vh"
            bgcolor="#f5f5f5"
        >
            <CircularProgress size={80} thickness={5} color="primary" />
            <Typography variant="h6" mt={3} color="textSecondary">
                Loading...
            </Typography>
        </Box>
    );
}
