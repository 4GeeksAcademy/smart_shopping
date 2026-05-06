import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Category = () => {
    const [categories, setCategories] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data));
    }, []);

    const deleteCategory = (id) => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories/" + id, {
            method: "DELETE"
        })
        .then(() => {
            setCategories(categories.filter(cat => cat.id !== id));
        });
    };

    return (
        <div>
            <h1>Categorías</h1>

            <button onClick={() => navigate("/categories/create")}>
                Crear categoría
            </button>

            <ul>
                {categories.map(cat => (
                    <li key={cat.id}>
                        {cat.nombre}

                        <button onClick={() => deleteCategory(cat.id)}>
                            Eliminar
                        </button>

                        <button onClick={() => navigate("/categories/edit/" + cat.id)}>
                            Editar
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};