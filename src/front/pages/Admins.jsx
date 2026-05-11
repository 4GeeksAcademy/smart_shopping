import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Admins = () => {
    const [admins, setAdmins] = useState([]);
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    
    const getAdmins = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/admins`, {
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token")
                }
            });

            if (response.status === 401 || response.status === 403) {
                alert("No autorizado");
                navigate("/admin-login");
                return;
            }

            const data = await response.json();

            
            if (Array.isArray(data)) {
                setAdmins(data);
            } else {
                setAdmins([]);
            }

        } catch (error) {
            console.error("Error loading admins:", error);
        }
    };

    useEffect(() => {
        getAdmins();
    }, []);

    
    const deleteAdmin = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}/api/admins/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: "Bearer " + sessionStorage.getItem("token")
                }
            });

            if (response.status === 401 || response.status === 403) {
                alert("No autorizado");
                return;
            }

            // actualizar lista
            setAdmins(admins.filter(admin => admin.id !== id));

        } catch (error) {
            console.error("Error deleting admin:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1>Admins</h1>

            <button
                className="btn btn-primary mb-3"
                onClick={() => navigate("/admins/create")}
            >
                Crear Admin
            </button>

            {admins.length === 0 ? (
                <p></p>
            ) : (
                <ul className="list-group">
                    {admins.map((admin) => (
                        <li
                            key={admin.id}
                            className="list-group-item d-flex justify-content-between align-items-center"
                        >
                            <span>{admin.email}</span>

                            <div>
                                <button
                                    className="btn btn-warning btn-sm me-2"
                                    onClick={() => navigate(`/admins/edit/${admin.id}`)}
                                >
                                    Editar
                                </button>

                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => deleteAdmin(admin.id)}
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};