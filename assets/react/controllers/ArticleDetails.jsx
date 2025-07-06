import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { visit } from './utils';
import InventoryIcon from '@mui/icons-material/Inventory';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Snackbar from '@mui/material/Snackbar';
export default function ArticleDetails() {
    const { id } = useParams();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [confirmOpen, setConfirmOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('success');


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
                    setSnackbarMessage(data.message || 'Failed to get data to the form');
                    setSnackbarSeverity('error');
                }

                setArticle(data);
            } catch (err) {
                setSnackbarMessage(`Error: ${error.message}`);
                setSnackbarSeverity('error');
            } finally {
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    //Delete
    const handleDelete = async () => {
        const token = localStorage.getItem('jwt_token');
        try {
            const response = await fetch(`https://127.0.0.1:8000/api/delete/${id}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const data = await response.json();
            if (!response.ok) {
                setSnackbarMessage(data.message || 'Failed to delete the article');
                setSnackbarSeverity('error');
            }
            setTimeout(() => visit('/main/home'), 2000);
        } catch (err) {
            setSnackbarMessage(`Error: ${error.message}`);
            setSnackbarSeverity('error');
        } finally {
            setConfirmOpen(false);
        }
    }

    if (loading) {
        return (
            <Container>
                <Box mt={5} display="flex" justifyContent="center">
                    <CircularProgress />
                </Box>
            </Container>
        );
    }

    if (error) {
        return (
            <Container>
                <Box mt={5}>
                    <Alert severity="error">{error}</Alert>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="sm">
            <Box mt={5}>
                <Card elevation={3}>
                    <CardContent>
                        <Box display="flex" alignItems="center" gap={2} mb={2}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                <InventoryIcon />
                            </Avatar>
                            <Typography variant="h5">{article.name}</Typography>
                        </Box>
                        <Typography variant="body1" gutterBottom>
                            Quantité : <strong>{article.quantity}</strong>
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mt={2}>
                            ID Article : {article.id}
                        </Typography>
                    </CardContent>
                </Card>
                <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                    >
                        <Typography
                            sx={{
                                cursor: 'pointer', textDecoration: 'none', color: 'white'
                            }}
                            component={Link}
                            to={`/article/update/${id}`
                            }
                        > Update</Typography>
                    </Button>

                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => setConfirmOpen(true)}
                    >
                        Delete
                    </Button>
                </Box>

                {/* Confirmation dialog */}
                <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
                    <DialogTitle>Confirm Delete</DialogTitle>
                    <DialogContent>
                        <Typography>Are you sure ?</Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                        <Button color="error" onClick={handleDelete}>
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
            <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
                <Alert severity={snackbarSeverity} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Container >
    );
}
