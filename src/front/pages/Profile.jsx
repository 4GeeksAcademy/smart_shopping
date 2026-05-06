import React, { useState } from "react";

export const Profile = () => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const backend = import.meta.env.VITE_BACKEND_URL;

    // 📸 seleccionar imagen + preview
    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];

        if (!selectedFile) return;

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
    };

    // ☁️ subir imagen
    const handleUpload = async () => {
        if (!file) {
            alert("Selecciona una imagen");
            return;
        }

        setLoading(true);

        const token = sessionStorage.getItem("token");
        const role = sessionStorage.getItem("role");

        // 🔥 AQUÍ ESTÁ LA CLAVE
        const endpoint =
            role === "admin"
                ? "/api/admin/profile/image"
                : "/api/profile/image";

        try {
            // 🔹 subir a cloudinary
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch(`${backend}/api/upload`, {
                method: "POST",
                body: formData
            });

            const uploadData = await uploadRes.json();

            // 🔹 guardar imagen según rol
            await fetch(`${backend}${endpoint}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({
                    image_url: uploadData.url
                })
            });

            // 🔥 guardar en session
            sessionStorage.setItem("image_url", uploadData.url);

            alert("Imagen subida correctamente 🚀");
            setLoading(false);

        } catch (error) {
            console.error(error);
            alert("Error subiendo imagen");
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5 text-center">
            <h2 className="mb-4">Mi Perfil</h2>

            {/* 🖼 IMAGEN ACTUAL */}
            <img
                src={
                    preview ||
                    sessionStorage.getItem("image_url") ||
                    "https://via.placeholder.com/150"
                }
                alt="perfil"
                style={{
                    width: "150px",
                    height: "150px",
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "3px solid #ccc"
                }}
            />

            {/* 📂 INPUT */}
            <div className="mt-3">
                <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                />
            </div>

            {/* 🚀 BOTÓN */}
            <button
                className="btn btn-primary mt-3"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Subiendo..." : "Subir imagen"}
            </button>
        </div>
    );
};