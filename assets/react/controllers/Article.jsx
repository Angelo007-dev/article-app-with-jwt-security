import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Avatar from '@mui/material/Avatar';
import InventoryIcon from '@mui/icons-material/Inventory';
import Divider from '@mui/material/Divider';
import CardContent from '@mui/material/CardContent';
import useArticles from './hooks/useArticles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Container from '@mui/material/Container';
import { visit } from './utils';
import { Link } from 'react-router-dom';

const Article = () => {
    const article = useArticles();
    console.log(article);
    /*const token = localStorage.getItem('jwt_token');
     if (token) {
         console.log(token)
     }*/
    return (
        <>
            <Container>
                <Box p={4}>
                    <Typography variant='h4' gutterBottom>
                        Our Articles
                    </Typography>
                    {article.length === 0 ? (
                        <Box
                            mt={5}
                            p={4}
                            bgcolor="#fff3cd"
                            border="1x solid #ffeeba"
                            textAlign="center"
                        >
                            <Typography variant='h6' color="text.secondary">
                                Add new article
                            </Typography>
                        </Box>
                    ) : (<Grid container spacing={3}>
                        {article?.map((article) => (
                            <Grid xs={12} sm={6} md={4} key={article.id}>
                                <Card
                                    elevation={3}
                                    sx={{
                                        borderRadius: 3,
                                        transistion: 'transform 0.3s ease',
                                        '&:hover': {
                                            transform: 'scale(1.02)',
                                        },
                                    }}
                                >
                                    <CardHeader
                                        avatar={
                                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                                                <InventoryIcon />
                                            </Avatar>
                                        }
                                        title={article.name}
                                        subheader={
                                            <Typography
                                                variant='body2'
                                                component={Link}
                                                to={`/article/show/${article.id}`}
                                                sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline', cursor: 'pointer' } }}
                                            >
                                                ID:{article.id}
                                            </Typography>
                                        }
                                    >

                                    </CardHeader>
                                    <Divider />
                                    <CardContent>
                                        <Typography variant='body1'>
                                            Quantity: <strong>{article.quantity}</strong>
                                        </Typography>
                                        {article.user && (
                                            <Typography variant='body2' color='text.secondary'>
                                                Créer par:{article.user.email ?? 'Utisateur inconnu'}
                                            </Typography>
                                        )}
                                    </CardContent>

                                </Card>
                            </Grid>
                        ))}
                    </Grid>)}
                    <Button
                        sx={{ mt: 3 }}
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => visit('/article/new')}

                    >New</Button>
                </Box>


            </Container >
        </>
    );
}
export default Article;
