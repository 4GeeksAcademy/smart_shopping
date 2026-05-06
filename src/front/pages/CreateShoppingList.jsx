import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateShoppingList = () => {
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    const backend = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async () => {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                alert("Debes iniciar sesión");
                navigate("/login");
                return;
            }

            const response = await fetch(`${backend}/api/lists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    nombre_lista: nombre
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.msg || "Error al crear lista");
                return;
            }

            alert("Lista creada ✅");
            navigate("/lists");

        } catch (error) {
            console.error("Error:", error);
            alert("Error de conexión");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Crear Lista</h2>

            <input
                className="form-control mb-2"
                placeholder="Nombre de la lista"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
            />

            <button
                className="btn btn-success"
                onClick={handleSubmit}
            >
                Guardar
            </button>
        </div>
    );
};