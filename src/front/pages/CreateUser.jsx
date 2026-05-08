import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export const CreateUser = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const backend = import.meta.env.VITE_BACKEND_URL;

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const imageUrl = await handleUpload(file);

            const resp = await fetch(backend + "/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password, image_url: imageUrl })
            });
            const data = await resp.json();

            if (!resp.ok) {
                setError(data.msg || "Error creando usuario");
                setLoading(false);
                return;
            }

            navigate("/login");
        } catch (err) {
            console.error(err);
            setError("Error de conexión");
            setLoading(false);
        }
    };

    return (
        <div className="ss-container-sm ss-fade-in" style={{ paddingTop: "20px" }}>

            <div style={{
                background: "white",
                border: "1px solid var(--ss-border)",
                borderRadius: "var(--ss-radius-lg)",
                padding: "36px 32px",
                boxShadow: "var(--ss-shadow)"
            }}>

                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{
                        width: "56px",
                        height: "56px",
                        borderRadius: "16px",
                        background: "var(--ss-lime)",
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "var(--ss-green-dark)",
                        fontSize: "24px",
                        marginBottom: "16px",
                        boxShadow: "var(--ss-shadow-lime)"
                    }}>
                        <i className="fa-solid fa-user-plus"></i>
                    </div>
                    <h1 style={{ fontSize: "26px", margin: "0 0 4px", fontWeight: 800 }}>
                        Crear cuenta
                    </h1>
                    <p style={{ color: "var(--ss-text-muted)", margin: 0, fontSize: "14px" }}>
                        Empieza a organizar tus compras
                    </p>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* Avatar uploader */}
                    <div style={{ display: "flex", justifyContent: "center", marginBottom: "20px" }}>
                        <label style={{ cursor: "pointer", position: "relative" }}>
                            <div style={{
                                width: "84px",
                                height: "84px",
                                borderRadius: "50%",
                                background: preview ? `url(${preview}) center/cover` : "var(--ss-cream-dark)",
                                border: "2px dashed var(--ss-border)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "var(--ss-text-muted)",
                                fontSize: "22px",
                                transition: "var(--ss-transition)"
                            }}>
                                {!preview && <i className="fa-solid fa-camera"></i>}
                            </div>
                            <div style={{
                                position: "absolute",
                                bottom: 0,
                                right: 0,
                                width: "26px",
                                height: "26px",
                                borderRadius: "50%",
                                background: "var(--ss-green)",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "11px",
                                border: "2px solid white"
                            }}>
                                <i className="fa-solid fa-plus"></i>
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>

                    <div style={{ marginBottom: "16px" }}>
                        <label className="ss-label">Email</label>
                        <input
                            type="email"
                            className="ss-input"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label className="ss-label">Contraseña</label>
                        <input
                            type="password"
                            className="ss-input"
                            placeholder="Mínimo 6 caracteres"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        className="ss-btn ss-btn-primary ss-btn-block ss-btn-lg"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fa-solid fa-spinner fa-spin"></i>
                                Creando cuenta...
                            </>
                        ) : (
                            <>
                                Crear cuenta
                                <i className="fa-solid fa-arrow-right"></i>
                            </>
                        )}
                    </button>

                    {error && (
                        <div style={{
                            marginTop: "16px",
                            padding: "12px 14px",
                            background: "var(--ss-danger-soft)",
                            color: "var(--ss-danger)",
                            borderRadius: "var(--ss-radius)",
                            fontSize: "13px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}>
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}
                </form>

                <div style={{
                    margin: "24px 0 0",
                    textAlign: "center",
                    fontSize: "13px",
                    color: "var(--ss-text-muted)"
                }}>
                    ¿Ya tienes cuenta?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        style={{
                            color: "var(--ss-green)",
                            fontWeight: 600,
                            cursor: "pointer"
                        }}
                    >
                        Inicia sesión
                    </span>
                </div>

            </div>
        </div>
    );
};