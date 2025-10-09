import React, { useState } from 'react';
import { createCategory } from '../services/api';

function CategoryForm(
   { onCategoryCreated } ) {
    const [name, setName] = useState('');
    const [type, setType] = useState('expense'); // Значение по умолчанию
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const category = { name, type };
            await createCategory(category);
            onCategoryCreated(); 

            setName('');
            setType('expense');
            setError(null);

        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            {error && <p style={{ color: 'red' }}>Ошибка: {error}</p>}

            <div>
                <label htmlFor="name">Название:</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>

            <div>
                <label htmlFor="type">Тип:</label>
                <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                >
                    <option value="expense">Расход</option>
                    <option value="income">Доход</option>
                </select>
            </div>

            <button type="submit">Добавить категорию</button>
        </form>
    );
}

export default CategoryForm;