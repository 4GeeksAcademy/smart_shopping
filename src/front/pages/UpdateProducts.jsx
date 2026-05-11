import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const UpdateProducts = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [nombre, setNombre] = useState("");
    const [precio, setPrecio] = useState("");
    const [categoria_id, setCategoria_id] = useState("");
    const [image, setImage] = useState("");

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        loadProduct();
    }, []);

    const loadProduct = () => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/products", {
            headers: {
                Authorization: "Bearer " + token
            }
        })
            .then(res => res.json())
            .then(data => {
                const product = data.find(p => p.id == id);

                if (!product) {
                    alert("Producto no encontrado");
                    return;
                }

                setNombre(product.nombre);
                setPrecio(product.precio);
                setCategoria_id(product.categoria_id);
                setImage(product.image_url || "");
            });
    };

    
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const resp = await fetch(import.meta.env.VITE_BACKEND_URL + "/api/upload", {
            method: "POST",
            body: formData
        });

        const data = await resp.json();
        return data.url;
    };

    const handleUpdate = () => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/products/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({
                nombre,
                precio,
                categoria_id,
                image_url: image 
            })
        })
            .then(res => res.json())
            .then(() => {
                navigate("/products");
            });
    };

    return (
        <div className="container mt-5">
            <h2>Editar Producto</h2>

            <input
                className="form-control mb-2"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre"
            />

            <input
                className="form-control mb-2"
                value={precio}
                onChange={(e) => setPrecio(e.target.value)}
                placeholder="Precio"
            />

            <input
                className="form-control mb-2"
                value={categoria_id}
                onChange={(e) => setCategoria_id(e.target.value)}
                placeholder="Categoria ID"
            />

            
            <input
                type="file"
                className="form-control mb-2"
                onChange={async (e) => {
                    const url = await uploadImage(e.target.files[0]);
                    setImage(url);
                }}
            />

            
            {image && (
                <img
                    src={image}
                    style={{ width: "100px", marginBottom: "10px" }}
                />
            )}

            <button className="btn btn-success" onClick={handleUpdate}>
                Actualizar
            </button>
        </div>
    );
};