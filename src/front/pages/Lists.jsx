import React, { useEffect, useState } from "react";

const Lists = () => {
    const [lists, setLists] = useState([]);

    const API_URL = "https://opulent-space-couscous-7v6vp9qwrvpg3x976-3001.app.github.dev";

    const getLists = async () => {
        try {
            const response = await fetch(`${API_URL}/api/lists-with-items`, {
                method: "GET",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token"),
                    "Content-Type": "application/json"
                }
            });

            const data = await response.json();
            console.log("LISTAS:", data);
            setLists(data);

        } catch (error) {
            console.log("Error cargando listas:", error);
        }
    };

    const toggleItem = async (itemId, currentStatus) => {
        try {
            console.log("CLICK FUNCIONA", itemId, currentStatus);

            await fetch(`${API_URL}/api/items/${itemId}`, {
                method: "PUT",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("token"),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    comprado: !currentStatus
                })
            });

            await getLists();

        } catch (error) {
            console.log("Error actualizando item:", error);
        }
    };

    useEffect(() => {
        getLists();
    }, []);

    return (
        <div className="container">
            <h1>🛒 Mis Listas</h1>

            {lists.length === 0 && <p>No tienes listas aún</p>}

            {lists.map((list) => (
                <div
                    key={list.id}
                    style={{
                        border: "1px solid #ccc",
                        margin: "10px",
                        padding: "10px",
                        borderRadius: "8px"
                    }}
                >
                    <h3>{list.nombre_lista}</h3>

                    <ul>
                        {list.items.map((item) => (
                            <li key={item.id}>
                                <span
                                    style={{
                                        textDecoration: item.comprado ? "line-through" : "none",
                                        marginRight: "10px"
                                    }}
                                >
                                    {item.producto_nombre} - Cantidad: {item.cantidad}
                                </span>

                                <button
                                    onClick={() =>
                                        toggleItem(item.id, item.comprado || false)
                                    }
                                    style={{
                                        marginLeft: "10px",
                                        backgroundColor: item.comprado ? "#28a745" : "#ffc107",
                                        color: "black",
                                        border: "none",
                                        padding: "5px 10px",
                                        borderRadius: "5px",
                                        cursor: "pointer"
                                    }}
                                >
                                    {item.comprado
                                        ? "Desmarcar ❌"
                                        : "Marcar como comprado ✅"}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default Lists;