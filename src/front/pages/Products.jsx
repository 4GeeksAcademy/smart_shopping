import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Products = () => {
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const role = sessionStorage.getItem("role");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            console.error("No hay token");
            return;
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/products", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => {
                if (res.status === 401) {
                    console.error("Token inválido o expirado");
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            })
            .catch(err => console.error("Error cargando productos:", err));
    };

    const deleteProduct = (id) => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            console.error("No hay token");
            return;
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/products/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => {
                if (res.status === 401) {
                    console.error("No autorizado");
                    return;
                }
                loadProducts();
            })
            .catch(err => console.error("Error eliminando producto:", err));
    };

    return (
        <div className="container mt-5">
            <h2>Productos</h2>

            {role === "admin" && (
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => navigate("/products/create")}
                >
                    Crear Producto
                </button>
            )}

            {products.length === 0 ? (
                <p>No hay productos</p>
            ) : (
                <ul className="list-group">
                    {products.map(product => (
                        <li
                            key={product.id}
                            className="list-group-item d-flex justify-content-between"
                        >
                            <div>
                                <strong>{product.nombre}</strong> - ${product.precio}
                            </div>

                            {role === "admin" && (
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteProduct(product.id)}
                                >
                                    Eliminar
                                </button>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};