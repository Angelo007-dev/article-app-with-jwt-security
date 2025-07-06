import React from 'react';
import Article from './Article';
import Header from './components/Header';
import NewArticle from './NewArticle';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

export default function Main() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/main/home" element={<Article />}></Route>
                <Route path="/article/new" element={<NewArticle />}></Route>
            </Routes>

        </Router>
    )
}
