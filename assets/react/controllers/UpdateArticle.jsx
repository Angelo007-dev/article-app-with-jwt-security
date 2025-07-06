import React, { useEffect, useState } from 'react';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import { useParams } from 'react-router-dom';
import { visit } from './utils';

export default function UpdtateArticle() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const parsedQuantity = parseInt(quantity, 10);
    const [isQuantityError, setIsQuantityError] = useState(false);
    const [quantityErrorText, setQuantityErrorText] = useState('');
    const [isNameError, setIsNameError] = useState(false);
    const [nameErrorText, setNameErrorText] = useState('');
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');



    const resetErrors = () => {
        setIsNameError(false);
        setNameErrorText('');

    };

    const handleSnackbarClose = () => {
        setSnackbarOpen(false);
    };

    useEffect(() => {
        const fetchArticle = async () => {
            const token = localStorage.getItem('jwt_token');
            try {
                const response = await fetch(`https://127.0.0.1:8000/api/article/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error || 'Error on loadfing');
                }

                setArticle(data);
                setName(data.name || '');
                setQuantity(data.quantity !== undefined ? data.quantity.toString() : '');
            } catch (err) {
                setSnackbarMessage(err.message);
                setSnackbarSeverity('error');
                setSnackbarOpen(true);
            }
        };

        fetchArticle();
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        resetErrors();

        let hasError = false;
        if (!name.trim()) {
            setIsNameError(true);
            setNameErrorText('Name is required');
            hasError = true;
        }
        if (!quantity.trim()) {
            setIsQuantityError(true);
            setQuantityErrorText('Quantity is required');
            hasError = true;
        }
        if (quantity === '' || isNaN(parsedQuantity) || parsedQuantity <= 0) {
            setIsQuantityError(true);
            setQuantityErrorText('Quantity invalid');
            hasError = true;
        }
        if (hasError) return;

        const token = localStorage.getItem('jwt_token');
        if (!token) {
            setSnackbarMessage('You must be logged in');
            setSnackbarSeverity('error');
            setSnackbarOpen(true);
            return;
        }

        try {
            const response = await fetch(`https://127.0.0.1:8000/api/update/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ name, quantity: parsedQuantity }),
            });
            const data = await response.json();

            if (response.ok) {
                setSnackbarMessage('Article updated successfully!');
                setSnackbarSeverity('success');
                setName('');
                setQuantity('');
                setTimeout(() => visit('/main/home'), 1000);
            } else {
                setSnackbarMessage(data.message || 'Failed to uptdated article');
                setSnackbarSeverity('error');

                if (data.message && data.message.includes("already")) {
                    setIsNameError(true);
                    setNameErrorText(data.message);
                }
            }
        } catch (error) {
            setSnackbarMessage(`Error: ${error.message}`);
            setSnackbarSeverity('error');
        }

        setSnackbarOpen(true);
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={6} sx={{ mt: 4, p: 3 }}>
                <Typography variant="h5" component="h1" align="center" gutterBottom>
                    Update Article - {article?.name || ''}
                </Typography>
                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        fullWidth
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        error={isNameError}
                        helperText={nameErrorText}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        label="Quantity"
                        type='number'
                        fullWidth
                        required
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        error={isQuantityError}
                        helperText={quantityErrorText}
                        sx={{ mb: 2 }}
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth>
                        Update
                    </Button>
                </Box>
            </Paper>

            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity={snackbarSeverity} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
}
