import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateShoppingList = () => {
    const { id } = useParams(); 
    const [nombre, setNombre] = useState("");
    const navigate = useNavigate();

    const backend = import.meta.env.VITE_BACKEND_URL;

    
    const getList = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const resp = await fetch(`${backend}/api/lists/${id}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            if (!resp.ok) {
                alert("Error cargando lista");
                return;
            }

            const data = await resp.json();

            
            setNombre(data.nombre_lista);

        } catch (error) {
            console.error("Error:", error);
        }
    };

    
    const handleUpdate = async () => {
        try {
            const token = sessionStorage.getItem("token");

            const resp = await fetch(`${backend}/api/lists/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    nombre_lista: nombre
                })
            });

            if (!resp.ok) {
                alert("Error al actualizar");
                return;
            }

            alert("Lista actualizada ✅");
            navigate("/lists");

        } catch (error) {
            console.error("Error:", error);
        }
    };

    
    useEffect(() => {
        getList();
    }, []);

    return (
        <div className="container mt-5">
            <h2>Editar Lista</h2>

            <input
                className="form-control mb-3"
                placeholder="Nombre de la lista"
                value={nombre} 
                onChange={(e) => setNombre(e.target.value)}
            />

            <button
                className="btn btn-warning"
                onClick={handleUpdate}
            >
                Actualizar
            </button>
        </div>
    );
};