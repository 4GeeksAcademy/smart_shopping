import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const UpdateAdmin = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    
    const getAdmin = async () => {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                navigate("/admin-login");
                return;
            }

            const response = await fetch(`${BASE_URL}/api/admins/${id}`, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });

            
            if (!response.ok) {
                console.error("Error status:", response.status);
                navigate("/admin-login");
                return;
            }

            const data = await response.json();

            if (data?.email) {
                setEmail(data.email);
            }

        } catch (error) {
            console.error("Error loading admin:", error);
        }
    };

    useEffect(() => {
        getAdmin();
    }, []);

    // Actualizar admin
    const handleUpdate = async () => {
        try {
            const token = sessionStorage.getItem("token");

            if (!token) {
                navigate("/admin-login");
                return;
            }

            const response = await fetch(`${BASE_URL}/api/admins/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    email,
                    ...(password && { password })
                })
            });

             
            if (!response.ok) {
                let errorMsg = "Error al actualizar";

                try {
                    const errData = await response.json();
                    errorMsg = errData.msg || errorMsg;
                } catch {
                    
                    errorMsg = "Error del servidor";
                }

                alert(errorMsg);
                return;
            }

            alert("Admin actualizado correctamente ✅");
            navigate("/admins");

        } catch (error) {
            console.error("Error updating admin:", error);
            alert("Error de conexión");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Update Admin</h2>

            <input
                className="form-control mb-2"
                type="email"
                value={email}
                placeholder="email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="form-control mb-2"
                type="password"
                placeholder="new password (optional)"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-warning" onClick={handleUpdate}>
                Update
            </button>
        </div>
    );
};