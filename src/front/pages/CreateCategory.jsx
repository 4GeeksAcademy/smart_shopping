import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateCategory = () => {
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    const handleSubmit = () => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nombre })
        })
            .then(res => res.json())
            .then(() => {
                navigate("/categories");
            });
    };

    return (
        <div>
            <h1>Crear Categoría</h1>

            <input
                type="text"
                placeholder="Nombre"
                onChange={(e) => setNombre(e.target.value)}
            />

            <button onClick={handleSubmit}>
                Guardar
            </button>
        </div>
    );
};