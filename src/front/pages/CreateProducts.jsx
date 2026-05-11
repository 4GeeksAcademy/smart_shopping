import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateProducts = () => {
    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria_id, setCategoria_id] = useState("");
    const [image, setImage] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const token = sessionStorage.getItem("token");

    
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const resp = await fetch(
            import.meta.env.VITE_BACKEND_URL + "/api/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const data = await resp.json();
        return data.url;
    };

    
    const handleSubmit = async () => {
        if (!nombre || !precio || !categoria_id) {
            alert("Faltan datos");
            return;
        }

        setLoading(true);

        try {
            const resp = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/products",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: "Bearer " + token // 🔥 IMPORTANTE
                    },
                    body: JSON.stringify({
                        nombre: nombre,
                        precio: precio,
                        categoria_id: categoria_id,
                        image_url: image // 🔥 IMAGEN
                    })
                }
            );

            const data = await resp.json();

            if (!resp.ok) {
                alert(data.msg || "Error al crear producto");
                return;
            }

            navigate("/products");
        } catch (error) {
            console.error(error);
            alert("Error en el servidor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Crear Producto</h1>

            <input
                className="form-control mb-2"
                type="text"
                placeholder="Nombre"
                onChange={(e) => setNombre(e.target.value)}
            />

            <input
                className="form-control mb-2"
                type="number"
                placeholder="Precio"
                onChange={(e) => setPrecio(e.target.value)}
            />

            <input
                className="form-control mb-2"
                type="number"
                placeholder="Categoria ID"
                onChange={(e) => setCategoria_id(e.target.value)}
            />

            
            <input
                className="form-control mb-2"
                type="file"
                onChange={async (e) => {
                    const file = e.target.files[0];
                    if (!file) return;

                    const url = await uploadImage(file);
                    setImage(url);
                }}
            />

            
            {image && (
                <div className="mb-2">
                    <img src={image} width="120" />
                </div>
            )}

            <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
            >
                {loading ? "Guardando..." : "Guardar"}
            </button>
        </div>
    );
};