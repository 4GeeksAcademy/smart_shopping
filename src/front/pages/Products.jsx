import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import azucarImg from "../assets/products/azucar.png";
import aguaImg from "../assets/products/agua.png";
import arrozImg from "../assets/products/arroz.png";
import carneImg from "../assets/products/carne.png";
import harinaImg from "../assets/products/harina.png";
import lecheImg from "../assets/products/leche.png";
import levaduraImg from "../assets/products/levadura.png";
import salImg from "../assets/products/sal.png";
import oreganoImg from "../assets/products/oregano.png";
import aceiteOlivaImg from "../assets/products/aceite de oliva.png";

export const Products = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const role = sessionStorage.getItem("role");

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            console.error("No hay token");
            setLoading(false);
            return;
        }

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/products", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        })
            .then(res => res.json())
            .then(data => {
                setProducts(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    const deleteProduct = (id) => {
        if (!confirm("¿Eliminar este producto?")) return;

        const token = sessionStorage.getItem("token");

        fetch(import.meta.env.VITE_BACKEND_URL + "/api/products/" + id, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(() => loadProducts())
            .catch(err => console.error(err));
    };

    return (
        <div className="ss-section-sm ss-fade-in">
            <div className="ss-container">

                
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-end",
                        marginBottom: "32px",
                        flexWrap: "wrap",
                        gap: "16px"
                    }}
                >
                    <div>
                        <span className="ss-eyebrow">Catálogo</span>

                        <h1
                            style={{
                                fontSize: "32px",
                                margin: 0,
                                fontWeight: 800
                            }}
                        >
                            Productos destacados
                        </h1>
                    </div>

                    {role === "admin" && (
                        <button
                            className="ss-btn ss-btn-bright"
                            onClick={() => navigate("/products/create")}
                        >
                            <i className="fa-solid fa-plus"></i>
                            Crear producto
                        </button>
                    )}
                </div>

                
                {loading ? (
                    <div className="ss-empty">
                        <i
                            className="fa-solid fa-spinner fa-spin"
                            style={{
                                fontSize: "32px",
                                color: "var(--ss-green)"
                            }}
                        ></i>

                        <p style={{ marginTop: "12px" }}>
                            Cargando productos...
                        </p>
                    </div>
                ) : products.length === 0 ? (

                    
                    <div className="ss-card ss-empty">
                        <div className="ss-empty-icon">
                            <i className="fa-solid fa-box-open"></i>
                        </div>

                        <h3 style={{ margin: "0 0 8px" }}>
                            No hay productos
                        </h3>

                        <p style={{ margin: 0 }}>
                            {role === "admin"
                                ? "Crea el primero arriba"
                                : "Aún no hay productos disponibles"}
                        </p>
                    </div>

                ) : (

                    
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns:
                                "repeat(auto-fill, minmax(220px, 1fr))",
                            gap: "20px"
                        }}
                    >
                        {products.map(product => (
                            <ProductCard
                                key={product.id}
                                product={product}
                                isAdmin={role === "admin"}
                                onDelete={() => deleteProduct(product.id)}
                                onEdit={() =>
                                    navigate(`/products/edit/${product.id}`)
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};


/* PRODUCT CARD */


const ProductCard = ({ product, isAdmin, onDelete, onEdit }) => {

    
    const productImages = {
        azucar: azucarImg,
        agua: aguaImg,
        arroz: arrozImg,
        carne: carneImg,
        harina: harinaImg,
        leche: lecheImg,
        levadura: levaduraImg,
        sal: salImg,

    
        oregano: oreganoImg,
        "aceite de oliva": aceiteOlivaImg,
    };

    
    const normalizedName = product.nombre
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

    // Buscar imagen
    const imageSrc = productImages[normalizedName];

    
    const getEmoji = (name) => {
        const n = (name || "").toLowerCase();

        if (n.includes("manz")) return "🍎";
        if (n.includes("plat")) return "🍌";
        if (n.includes("naran")) return "🍊";
        if (n.includes("fres")) return "🍓";
        if (n.includes("uva")) return "🍇";
        if (n.includes("limon")) return "🍋";
        if (n.includes("toma")) return "🍅";
        if (n.includes("zanah")) return "🥕";
        if (n.includes("cebol")) return "🧅";
        if (n.includes("ajo")) return "🧄";
        if (n.includes("lechu")) return "🥬";
        if (n.includes("brocoli")) return "🥦";
        if (n.includes("pan")) return "🥖";
        if (n.includes("queso")) return "🧀";
        if (n.includes("hue")) return "🥚";
        if (n.includes("leche")) return "🥛";
        if (n.includes("pollo")) return "🍗";
        if (n.includes("carne")) return "🥩";
        if (n.includes("pescado")) return "🐟";
        if (n.includes("arroz")) return "🍚";
        if (n.includes("pasta")) return "🍝";
        if (n.includes("cafe")) return "☕";
        if (n.includes("vino")) return "🍷";
        if (n.includes("cerv")) return "🍺";
        if (n.includes("agua")) return "💧";
        if (n.includes("choco")) return "🍫";

        return "🛒";
    };

    return (
        <div className="ss-product-card">

            
            <div className="ss-product-img-wrap">

                {imageSrc ? (
                    <img
                        src={imageSrc}
                        alt={product.nombre}
                        className="ss-product-img"
                    />
                ) : (
                    <span
                        style={{
                            fontSize: "80px",
                            lineHeight: 1
                        }}
                    >
                        {getEmoji(product.nombre)}
                    </span>
                )}

                
                {product.precio > 0 && (
                    <span className="ss-product-badge">
                        Nuevo
                    </span>
                )}

                
                {isAdmin && (
                    <div className="ss-product-actions">

                        <button
                            className="ss-product-action-btn"
                            onClick={onEdit}
                            title="Editar"
                        >
                            <i className="fa-solid fa-pen"></i>
                        </button>

                        <button
                            className="ss-product-action-btn"
                            onClick={onDelete}
                            title="Eliminar"
                        >
                            <i className="fa-solid fa-trash"></i>
                        </button>

                    </div>
                )}
            </div>

        
            <div className="ss-product-body">

                <div className="ss-product-category">
                    {product.categoria || "General"}
                </div>

                <h3 className="ss-product-name">
                    {product.nombre}
                </h3>

                <div className="ss-product-stars">
                    ★ ★ ★ ★{" "}
                    <span style={{ opacity: 0.4 }}>★</span>
                </div>

                <div>
                    <span className="ss-product-price">
                        {product.precio > 0
                            ? `${product.precio.toFixed(2)} €`
                            : "Sin precio"}
                    </span>
                </div>

            </div>
        </div>
    );
};