import React from 'react';
import Container from '@mui/material/Container';
import Header from './components/Header';
//import { useNavigate } from 'react-router-dom';

const Article = () => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
        console.log(token)
    }
    return (
        <>
            <Header />
        </>
    );
}
export default Article;
