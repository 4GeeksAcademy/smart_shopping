import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateAdmin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL;

    const handleSubmit = async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            navigate("/admin-login");
            return;
        }

        const response = await fetch(`${BASE_URL}/api/admins`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token
            },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (response.ok) {
            navigate("/admins");
        } else {
            alert(data.msg);
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create Admin</h2>

            <input
                className="form-control mb-2"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email"
            />

            <input
                className="form-control mb-2"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="password"
            />

            <button className="btn btn-success" onClick={handleSubmit}>
                Create
            </button>
        </div>
    );
};