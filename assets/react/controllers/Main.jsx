import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Article from './Article';
import Header from './components/Header';
import NewArticle from './NewArticle';
import ArticleDetails from './ArticleDetails';
import UpdtateArticle from './UpdateArticle';



export default function Main() {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/article/show/:id" element={<ArticleDetails />}></Route>
                <Route path="/main/home" element={<Article />}></Route>
                <Route path="/article/new" element={<NewArticle />}></Route>
                <Route path="/article/update/:id" element={<UpdtateArticle />}></Route>
            </Routes>

        </Router>
    )
}
