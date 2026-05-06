import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateUser = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState(null); // 🔥 imagen

    const navigate = useNavigate();
    const backend = import.meta.env.VITE_BACKEND_URL;

    // 🔥 subir imagen a cloudinary
    const handleUpload = async (file) => {
        if (!file) return null;

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(backend + "/api/upload", {
            method: "POST",
            body: formData
        });

        const data = await res.json();
        return data.url;
    };

    const handleSubmit = async () => {
        try {
            // 🔥 subir imagen primero
            const imageUrl = await handleUpload(file);

            const resp = await fetch(backend + "/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    password,
                    image_url: imageUrl // 🔥 guardar imagen
                })
            });

            const data = await resp.json();

            if (!resp.ok) {
                alert(data.msg || "Error creando usuario");
                return;
            }

            alert("Usuario creado correctamente ✅");
            navigate("/login");

        } catch (error) {
            console.error(error);
            alert("Error de conexión");
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "400px" }}>
            <h2 className="mb-4 text-center">Crear Cuenta</h2>

            <input
                className="form-control mb-3"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="form-control mb-3"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            {/* 🔥 INPUT IMAGEN */}
            <input
                className="form-control mb-3"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
            />

            <button
                className="btn btn-success w-100"
                onClick={handleSubmit}
            >
                Registrarse
            </button>
        </div>
    );
};