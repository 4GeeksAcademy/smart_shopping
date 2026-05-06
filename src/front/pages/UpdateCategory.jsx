import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateCategory = () => {
    const { id } = useParams();
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories/" + id)
            .then(res => res.json())
            .then(data => setNombre(data.nombre));
    }, [id]);

    const handleUpdate = () => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/categories/" + id, {
            method: "PUT",
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
            <h1>Editar Categoría</h1>

            <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />

            <button onClick={handleUpdate}>
                Actualizar
            </button>
        </div>
    );
};