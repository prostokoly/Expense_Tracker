import React from 'react';

function CategoryList({ categories }) { 
    if (categories.length === 0) {
        return <p>Категории не найдены.</p>;
    }

    return (
        <ul>
            {categories.map(category => (
                <li key={category.id}>{category.name}</li>
            ))}
        </ul>
    );
}

export default CategoryList;