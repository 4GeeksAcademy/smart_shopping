import React, { useEffect, useState } from "react";

export const ShoppingList = () => {
    const [lists, setLists] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [newProductName, setNewProductName] = useState({});
    const [newListName, setNewListName] = useState("");

    // 🤖 IA
    const [recipe, setRecipe] = useState("");

    const backend = import.meta.env.VITE_BACKEND_URL;

    const getToken = () => sessionStorage.getItem("token");

    // ============================
    // 📥 GET DATA
    // ============================

    const getLists = async () => {
        try {
            const res = await fetch(`${backend}/api/lists-with-items`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (!res.ok) throw new Error("Error cargando listas");

            const data = await res.json();
            setLists(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error(error);
        }
    };

    const getProducts = async () => {
        try {
            const res = await fetch(`${backend}/api/products`, {
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            if (!res.ok) throw new Error("Error cargando productos");

            const data = await res.json();
            setProducts(Array.isArray(data) ? data : []);

        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        getLists();
        getProducts();
    }, []);

    // ============================
    // ➕ CREATE LIST
    // ============================

    const createList = async () => {
        if (!newListName.trim()) return alert("Escribe un nombre");

        try {
            const res = await fetch(`${backend}/api/lists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    nombre_lista: newListName
                })
            });

            if (!res.ok) throw new Error("Error creando lista");

            setNewListName("");
            getLists();

        } catch (error) {
            console.error(error);
        }
    };

    // ============================
    // ❌ DELETE LIST
    // ============================

    const deleteList = async (id) => {
        try {
            await fetch(`${backend}/api/lists/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            getLists();
        } catch (error) {
            console.error(error);
        }
    };

    // ============================
    // ➕ ADD ITEM
    // ============================

    const addItem = async (listId) => {
        const producto_id = selectedProduct[listId];

        if (!producto_id) return alert("Selecciona un producto");

        try {
            await fetch(`${backend}/api/lists/${listId}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    producto_id: parseInt(producto_id)
                })
            });

            getLists();
        } catch (error) {
            console.error(error);
        }
    };

    // ============================
    // 🧪 CREATE PRODUCT + ADD
    // ============================

    const createProductAndAdd = async (listId) => {
        const nombre = newProductName[listId];

        if (!nombre) return alert("Escribe un producto");

        try {
            const res = await fetch(`${backend}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    nombre,
                    precio: 0,
                    categoria_id: 1
                })
            });

            if (!res.ok) throw new Error("Error creando producto");

            const producto = await res.json();

            await fetch(`${backend}/api/lists/${listId}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    producto_id: producto.id
                })
            });

            setNewProductName({
                ...newProductName,
                [listId]: ""
            });

            getLists();
            getProducts();

        } catch (error) {
            console.error(error);
        }
    };

    // ============================
    // 🤖 IA RECETA
    // ============================

    const generateFromRecipe = async (listId) => {
        if (!recipe) return alert("Escribe una receta");

        try {
            const res = await fetch(`${backend}/api/ai/recipe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    receta: recipe
                })
            });

            const ingredientes = await res.json();

            for (let nombre of ingredientes) {

                const resProd = await fetch(`${backend}/api/products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        nombre,
                        precio: 0,
                        categoria_id: 1
                    })
                });

                const producto = await resProd.json();

                await fetch(`${backend}/api/lists/${listId}/items`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({
                        producto_id: producto.id
                    })
                });
            }

            setRecipe("");
            getLists();
            getProducts();

        } catch (error) {
            console.error(error);
        }
    };

    // ============================
    // ✔️ TOGGLE ITEM
    // ============================

    const toggleItem = async (itemId, currentStatus) => {
        try {
            await fetch(`${backend}/api/items/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({
                    comprado: !currentStatus
                })
            });

            getLists();
        } catch (error) {
            console.error(error);
        }
    };

    // ============================
    // ❌ DELETE ITEM
    // ============================

    const deleteItem = async (itemId) => {
        try {
            await fetch(`${backend}/api/items/${itemId}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${getToken()}`
                }
            });

            getLists();
        } catch (error) {
            console.error(error);
        }
    };

    // ============================
    // 🎨 UI
    // ============================

    return (
        <div className="container mt-5">
            <h2>🛒 Mis Listas</h2>

            <div className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control me-2"
                    placeholder="Nombre de la lista"
                    value={newListName}
                    onChange={(e) => setNewListName(e.target.value)}
                />
                <button className="btn btn-primary" onClick={createList}>
                    Crear
                </button>
            </div>

            {lists.map(list => (
                <div key={list.id} className="card p-3 mb-4">

                    <h5>{list.nombre_lista}</h5>

                    <ul className="list-group mb-2">
                        {list.items.map(item => (
                            <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">

                                <span style={{
                                    textDecoration: item.comprado ? "line-through" : "none"
                                }}>
                                    {item.producto_nombre} (x{item.cantidad})
                                </span>

                                <div>
                                    <button
                                        className={`btn btn-sm me-2 ${item.comprado ? "btn-success" : "btn-warning"}`}
                                        onClick={() => toggleItem(item.id, item.comprado)}
                                    >
                                        {item.comprado ? "Comprado" : "Pendiente"}
                                    </button>

                                    <button
                                        className="btn btn-danger btn-sm"
                                        onClick={() => deleteItem(item.id)}
                                    >
                                        X
                                    </button>
                                </div>

                            </li>
                        ))}
                    </ul>

                    {/* SELECT PRODUCTO */}
                    <div className="d-flex mt-2">
                        <select
                            className="form-select me-2"
                            value={selectedProduct[list.id] || ""}
                            onChange={(e) =>
                                setSelectedProduct({
                                    ...selectedProduct,
                                    [list.id]: e.target.value
                                })
                            }
                        >
                            <option value="">Selecciona producto</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>
                                    {p.nombre}
                                </option>
                            ))}
                        </select>

                        <button
                            className="btn btn-success"
                            onClick={() => addItem(list.id)}
                        >
                            +
                        </button>
                    </div>

                    {/* NUEVO PRODUCTO */}
                    <input
                        type="text"
                        className="form-control mt-2"
                        placeholder="Nuevo producto"
                        value={newProductName[list.id] || ""}
                        onChange={(e) =>
                            setNewProductName({
                                ...newProductName,
                                [list.id]: e.target.value
                            })
                        }
                    />

                    <button
                        className="btn btn-secondary mt-2"
                        onClick={() => createProductAndAdd(list.id)}
                    >
                        Crear y añadir
                    </button>

                    {/* 🤖 IA */}
                    <div className="mt-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Ej: pasta carbonara"
                            value={recipe}
                            onChange={(e) => setRecipe(e.target.value)}
                        />

                        <button
                            className="btn btn-dark mt-2 w-100"
                            onClick={() => generateFromRecipe(list.id)}
                        >
                            Generar ingredientes con IA 🤖
                        </button>
                    </div>

                    <div className="mt-3">
                        <button
                            className="btn btn-danger btn-sm"
                            onClick={() => deleteList(list.id)}
                        >
                            Eliminar lista
                        </button>
                    </div>

                </div>
            ))}
        </div>
    );
};