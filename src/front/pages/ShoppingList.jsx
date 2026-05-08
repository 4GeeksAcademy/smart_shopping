import React, { useEffect, useState } from "react";

export const ShoppingList = () => {
    const [lists, setLists] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState({});
    const [newProductName, setNewProductName] = useState({});
    const [newListName, setNewListName] = useState("");
    const [recipe, setRecipe] = useState({});
    const [loadingAI, setLoadingAI] = useState({});
    const [creating, setCreating] = useState(false);

    const backend = import.meta.env.VITE_BACKEND_URL;
    const getToken = () => sessionStorage.getItem("token");

    // ============================
    // 📥 GET DATA
    // ============================
    const getLists = async () => {
        try {
            const res = await fetch(`${backend}/api/lists-with-items`, {
                headers: { Authorization: `Bearer ${getToken()}` }
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
                headers: { Authorization: `Bearer ${getToken()}` }
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
        if (!newListName.trim()) return;
        setCreating(true);
        try {
            const res = await fetch(`${backend}/api/lists`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ nombre_lista: newListName })
            });
            if (!res.ok) throw new Error("Error creando lista");
            setNewListName("");
            getLists();
        } catch (error) {
            console.error(error);
        } finally {
            setCreating(false);
        }
    };

    const deleteList = async (id) => {
        if (!confirm("¿Eliminar esta lista?")) return;
        try {
            await fetch(`${backend}/api/lists/${id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
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
        if (!producto_id) return;
        try {
            await fetch(`${backend}/api/lists/${listId}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ producto_id: parseInt(producto_id) })
            });
            setSelectedProduct({ ...selectedProduct, [listId]: "" });
            getLists();
        } catch (error) {
            console.error(error);
        }
    };

    const createProductAndAdd = async (listId) => {
        const nombre = newProductName[listId];
        if (!nombre || !nombre.trim()) return;
        try {
            const res = await fetch(`${backend}/api/products`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ nombre: nombre.trim(), precio: 0, categoria_id: 1 })
            });
            if (!res.ok) throw new Error("Error creando producto");
            const producto = await res.json();
            await fetch(`${backend}/api/lists/${listId}/items`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ producto_id: producto.id })
            });
            setNewProductName({ ...newProductName, [listId]: "" });
            getLists();
            getProducts();
        } catch (error) {
            console.error(error);
        }
    };

    // ============================
    // 🤖 IA
    // ============================
    const generateFromRecipe = async (listId) => {
        const recetaTexto = recipe[listId];
        if (!recetaTexto || !recetaTexto.trim()) return;

        setLoadingAI({ ...loadingAI, [listId]: true });

        try {
            const res = await fetch(`${backend}/api/ai/recipe`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ receta: recetaTexto })
            });
            const ingredientes = await res.json();

            if (!Array.isArray(ingredientes)) {
                alert("Error generando ingredientes: " + (ingredientes.error || "respuesta inválida"));
                return;
            }

            for (let nombre of ingredientes) {
                nombre = String(nombre).trim();
                if (!nombre || nombre.length > 50 || nombre.length < 2) continue;

                const resProd = await fetch(`${backend}/api/products`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ nombre, precio: 0, categoria_id: 1 })
                });
                const producto = await resProd.json();

                await fetch(`${backend}/api/lists/${listId}/items`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${getToken()}`
                    },
                    body: JSON.stringify({ producto_id: producto.id })
                });
            }

            setRecipe({ ...recipe, [listId]: "" });
            getLists();
            getProducts();
        } catch (error) {
            console.error(error);
            alert("Error generando ingredientes con IA");
        } finally {
            setLoadingAI({ ...loadingAI, [listId]: false });
        }
    };

    // ============================
    // ✔️ TOGGLE / DELETE ITEM
    // ============================
    const toggleItem = async (itemId, currentStatus) => {
        try {
            await fetch(`${backend}/api/items/${itemId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${getToken()}`
                },
                body: JSON.stringify({ comprado: !currentStatus })
            });
            getLists();
        } catch (error) {
            console.error(error);
        }
    };

    const deleteItem = async (itemId) => {
        try {
            await fetch(`${backend}/api/items/${itemId}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            getLists();
        } catch (error) {
            console.error(error);
        }
    };

    // ============================
    // 🎨 RENDER
    // ============================
    return (
        <div className="ss-container ss-fade-in">

            {/* HEADER */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "32px", margin: "0 0 6px", fontWeight: 800 }}>
                    Mis listas
                </h1>
                <p style={{ color: "var(--ss-text-muted)", margin: 0, fontSize: "15px" }}>
                    Organiza tu compra con ayuda de IA ✨
                </p>
            </div>

            {/* CREAR LISTA */}
            <div className="ss-card" style={{ marginBottom: "32px", padding: "20px" }}>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                    <input
                        type="text"
                        className="ss-input"
                        placeholder="Nueva lista (ej: Compra de finde)"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && createList()}
                        style={{ flex: 1, minWidth: "200px" }}
                    />
                    <button
                        className="ss-btn ss-btn-primary"
                        onClick={createList}
                        disabled={creating || !newListName.trim()}
                    >
                        <i className="fa-solid fa-plus"></i>
                        {creating ? "Creando..." : "Crear lista"}
                    </button>
                </div>
            </div>

            {/* LISTAS */}
            {lists.length === 0 ? (
                <div className="ss-card ss-empty">
                    <div className="ss-empty-icon">
                        <i className="fa-solid fa-basket-shopping"></i>
                    </div>
                    <h3 style={{ margin: "0 0 8px" }}>Aún no tienes listas</h3>
                    <p style={{ margin: 0 }}>Crea tu primera lista arriba para empezar</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                    {lists.map(list => {
                        const totalItems = list.items.length;
                        const compradosCount = list.items.filter(i => i.comprado).length;
                        const progreso = totalItems > 0 ? (compradosCount / totalItems) * 100 : 0;
                        const isLoading = loadingAI[list.id];

                        return (
                            <div key={list.id} className="ss-fade-in">

                                {/* CARD HERO OSCURA POR LISTA */}
                                <div className="ss-card-dark" style={{ marginBottom: "16px" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px", flexWrap: "wrap" }}>
                                        <div style={{ flex: 1, minWidth: "200px" }}>
                                            <h2 style={{ fontSize: "24px", margin: "0 0 6px", fontWeight: 700 }}>
                                                {list.nombre_lista}
                                            </h2>
                                            <p style={{ margin: 0, color: "#9bc1aa", fontSize: "13px" }}>
                                                {totalItems} {totalItems === 1 ? "producto" : "productos"} · {compradosCount} comprados
                                            </p>
                                        </div>
                                        <button
                                            className="ss-btn ss-btn-sm"
                                            onClick={() => deleteList(list.id)}
                                            style={{
                                                background: "rgba(255,255,255,0.1)",
                                                color: "white",
                                                backdropFilter: "blur(8px)"
                                            }}
                                        >
                                            <i className="fa-solid fa-trash" style={{ fontSize: "11px" }}></i>
                                            Eliminar
                                        </button>
                                    </div>

                                    {/* BARRA DE PROGRESO */}
                                    {totalItems > 0 && (
                                        <div style={{
                                            marginTop: "16px",
                                            background: "rgba(255,255,255,0.1)",
                                            borderRadius: "999px",
                                            height: "6px",
                                            overflow: "hidden"
                                        }}>
                                            <div style={{
                                                width: `${progreso}%`,
                                                height: "100%",
                                                background: "var(--ss-lime)",
                                                transition: "width 0.4s ease",
                                                borderRadius: "999px"
                                            }} />
                                        </div>
                                    )}
                                </div>

                                {/* MÓDULO IA — DESTACADO */}
                                <div style={{
                                    background: "linear-gradient(180deg, var(--ss-green-pale) 0%, white 100%)",
                                    border: "1px solid var(--ss-lime)",
                                    borderRadius: "var(--ss-radius-md)",
                                    padding: "18px",
                                    marginBottom: "12px"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                                        <div style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "10px",
                                            background: "var(--ss-green-dark)",
                                            color: "var(--ss-lime)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontSize: "14px"
                                        }}>
                                            <i className="fa-solid fa-wand-magic-sparkles"></i>
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 700, color: "var(--ss-green-dark)", fontSize: "14px" }}>
                                                Generar con IA
                                            </div>
                                            <div style={{ fontSize: "12px", color: "var(--ss-text-muted)" }}>
                                                Escribe una receta y obtén los ingredientes
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <input
                                            type="text"
                                            className="ss-input"
                                            placeholder="Ej: pasta carbonara para 4 personas"
                                            value={recipe[list.id] || ""}
                                            onChange={(e) => setRecipe({ ...recipe, [list.id]: e.target.value })}
                                            onKeyDown={(e) => e.key === "Enter" && generateFromRecipe(list.id)}
                                            disabled={isLoading}
                                            style={{ flex: 1, minWidth: "200px" }}
                                        />
                                        <button
                                            className="ss-btn ss-btn-ai"
                                            onClick={() => generateFromRecipe(list.id)}
                                            disabled={isLoading || !recipe[list.id]?.trim()}
                                        >
                                            {isLoading ? (
                                                <>
                                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                                    Pensando...
                                                </>
                                            ) : (
                                                <>
                                                    <i className="fa-solid fa-sparkles"></i>
                                                    Generar
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* ITEMS */}
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                                    {list.items.length === 0 ? (
                                        <div style={{
                                            textAlign: "center",
                                            padding: "24px",
                                            color: "var(--ss-text-muted)",
                                            fontSize: "13px",
                                            background: "white",
                                            borderRadius: "var(--ss-radius)",
                                            border: "1px dashed var(--ss-border)"
                                        }}>
                                            Esta lista está vacía. Añade productos abajo 👇
                                        </div>
                                    ) : (
                                        list.items.map(item => (
                                            <ItemRow
                                                key={item.id}
                                                item={item}
                                                onToggle={() => toggleItem(item.id, item.comprado)}
                                                onDelete={() => deleteItem(item.id)}
                                            />
                                        ))
                                    )}
                                </div>

                                {/* AÑADIR PRODUCTO EXISTENTE */}
                                <div style={{
                                    background: "white",
                                    border: "1px solid var(--ss-border)",
                                    borderRadius: "var(--ss-radius-md)",
                                    padding: "16px"
                                }}>
                                    <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ss-text-muted)", marginBottom: "10px" }}>
                                        Añadir productos
                                    </div>

                                    <div style={{ display: "flex", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
                                        <select
                                            className="ss-select"
                                            value={selectedProduct[list.id] || ""}
                                            onChange={(e) => setSelectedProduct({ ...selectedProduct, [list.id]: e.target.value })}
                                            style={{ flex: 1, minWidth: "180px" }}
                                        >
                                            <option value="">Selecciona un producto existente</option>
                                            {products.map(p => (
                                                <option key={p.id} value={p.id}>{p.nombre}</option>
                                            ))}
                                        </select>
                                        <button
                                            className="ss-btn ss-btn-primary"
                                            onClick={() => addItem(list.id)}
                                            disabled={!selectedProduct[list.id]}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                            Añadir
                                        </button>
                                    </div>

                                    <div style={{
                                        textAlign: "center",
                                        margin: "10px 0",
                                        fontSize: "12px",
                                        color: "var(--ss-text-light)",
                                        position: "relative"
                                    }}>
                                        <span style={{
                                            background: "white",
                                            padding: "0 12px",
                                            position: "relative",
                                            zIndex: 1
                                        }}>
                                            o crea uno nuevo
                                        </span>
                                        <div style={{
                                            position: "absolute",
                                            top: "50%",
                                            left: 0,
                                            right: 0,
                                            height: "1px",
                                            background: "var(--ss-border)"
                                        }} />
                                    </div>

                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <input
                                            type="text"
                                            className="ss-input"
                                            placeholder="Nuevo producto"
                                            value={newProductName[list.id] || ""}
                                            onChange={(e) => setNewProductName({ ...newProductName, [list.id]: e.target.value })}
                                            onKeyDown={(e) => e.key === "Enter" && createProductAndAdd(list.id)}
                                            style={{ flex: 1, minWidth: "180px" }}
                                        />
                                        <button
                                            className="ss-btn ss-btn-outline"
                                            onClick={() => createProductAndAdd(list.id)}
                                            disabled={!newProductName[list.id]?.trim()}
                                        >
                                            <i className="fa-solid fa-plus"></i>
                                            Crear y añadir
                                        </button>
                                    </div>
                                </div>

                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// 🛒 ITEM ROW (componente interno limpio)
const ItemRow = ({ item, onToggle, onDelete }) => {
    return (
        <div
            style={{
                background: item.comprado ? "var(--ss-green-pale)" : "white",
                border: `1px solid ${item.comprado ? "var(--ss-lime)" : "var(--ss-border)"}`,
                borderRadius: "var(--ss-radius)",
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                transition: "var(--ss-transition)"
            }}
        >
            {/* Checkbox custom */}
            <div
                onClick={onToggle}
                style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    border: item.comprado ? "none" : "2px solid var(--ss-border)",
                    background: item.comprado ? "var(--ss-green)" : "transparent",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                    flexShrink: 0,
                    transition: "var(--ss-transition)"
                }}
            >
                {item.comprado && (
                    <i className="fa-solid fa-check" style={{ color: "white", fontSize: "11px" }}></i>
                )}
            </div>

            {/* Texto */}
            <div style={{ flex: 1, minWidth: 0 }}>
                <div
                    style={{
                        fontWeight: 600,
                        color: "var(--ss-green-dark)",
                        fontSize: "14px",
                        textDecoration: item.comprado ? "line-through" : "none",
                        opacity: item.comprado ? 0.6 : 1,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis"
                    }}
                >
                    {item.producto_nombre}
                </div>
                <div style={{ fontSize: "12px", color: "var(--ss-text-muted)" }}>
                    Cantidad: {item.cantidad}
                </div>
            </div>

            {/* Eliminar */}
            <button
                onClick={onDelete}
                className="ss-btn ss-btn-icon ss-btn-danger"
                title="Eliminar"
                style={{ width: "32px", height: "32px" }}
            >
                <i className="fa-solid fa-xmark"></i>
            </button>
        </div>
    );
};