import { useEffect, useState } from 'react'

export default function useArticles() {
    const [articles, setArticles] = useState([]);
    useEffect(() => {
        fetch(`https://127.0.0.1:8000/articles`)
            .then(response => response.json())
            .then(json => setArticles(json))
    }, []);
    return articles;
}
