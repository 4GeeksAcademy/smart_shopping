import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const AdminLogin = () => {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch(`${BASE_URL}/api/admin/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            console.log("LOGIN ADMIN:", data);

            if (!response.ok) {
                alert(data.msg || "Error en login");
                return;
            }

            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("role", "admin");

            navigate("/users");

        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Admin Login</h2>

            <input
                className="form-control mb-2"
                type="email"
                placeholder="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="form-control mb-2"
                type="password"
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <button className="btn btn-primary" onClick={handleLogin}>
                Login
            </button>
        </div>
    );
};