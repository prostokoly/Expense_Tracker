// client/src/App.js
import React, { useState, useEffect } from 'react';
import CategoryList from './components/CategoryList';
import CategoryForm from './components/CategoryForm';
import { getAllCategories } from './services/api';

function App() {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadCategories = async () => { 
        console.log("App: Загрузка категорий..."); 
        setLoading(true); 
        try {
            const response = await getAllCategories();
            setCategories(response.data);
            setError(null);
        } catch (error) {
            setError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadCategories();
    }, []); 

    return (
        <div className="App">
            <h1>Category List</h1>
            {}
            <CategoryForm onCategoryCreated={loadCategories} /> 
            
            {loading ? (
                <p>Loading categories...</p>
            ) : error ? (
                <p>Error: {error.message}</p>
            ) : (
                <CategoryList categories={categories} /> 
            )}
        </div>
    );
}

export default App;