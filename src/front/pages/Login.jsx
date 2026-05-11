import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {

            
            const endpoint =
                email.includes("admin")
                    ? "/api/admin/login"
                    : "/api/login";

            const resp = await fetch(
                import.meta.env.VITE_BACKEND_URL + endpoint,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

            const data = await resp.json();

            if (!resp.ok) {
                setError(data.msg || "Error en login");
                setLoading(false);
                return;
            }

            // Guardar sesión
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("role", data.role);

            
            if (data.user_id) {
                sessionStorage.setItem("user_id", data.user_id);
            }

            sessionStorage.setItem("email", data.email || email);
            sessionStorage.setItem("image_url", data.image_url || "");

            
            if (data.role === "admin") {
                navigate("/products");
            } else {
                navigate("/lists");
            }

        } catch (err) {
            console.error(err);

            setError("Error de conexión con el servidor");
            setLoading(false);
        }
    };

    return (
        <div
            className="ss-container-sm ss-fade-in"
            style={{ paddingTop: "20px" }}
        >

            {/* Card */}
            <div
                style={{
                    background: "white",
                    border: "1px solid var(--ss-border)",
                    borderRadius: "var(--ss-radius-lg)",
                    padding: "36px 32px",
                    boxShadow: "var(--ss-shadow)"
                }}
            >

                
                <div
                    style={{
                        textAlign: "center",
                        marginBottom: "28px"
                    }}
                >
                    <div
                        style={{
                            width: "56px",
                            height: "56px",
                            borderRadius: "16px",
                            background: "var(--ss-green)",
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "24px",
                            marginBottom: "16px",
                            boxShadow: "var(--ss-shadow-green)"
                        }}
                    >
                        <i className="fa-solid fa-basket-shopping"></i>
                    </div>

                    <h1
                        style={{
                            fontSize: "26px",
                            margin: "0 0 4px",
                            fontWeight: 800
                        }}
                    >
                        Bienvenido de vuelta
                    </h1>

                    <p
                        style={{
                            color: "var(--ss-text-muted)",
                            margin: 0,
                            fontSize: "14px"
                        }}
                    >
                        Inicia sesión para ver tus listas
                    </p>
                </div>

                
                <form onSubmit={handleLogin}>

                    
                    <div style={{ marginBottom: "16px" }}>
                        <label className="ss-label">
                            Email
                        </label>

                        <input
                            type="email"
                            className="ss-input"
                            placeholder="tu@email.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            autoFocus
                        />
                    </div>

                    
                    <div style={{ marginBottom: "20px" }}>
                        <label className="ss-label">
                            Contraseña
                        </label>

                        <input
                            type="password"
                            className="ss-input"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
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
                                Iniciando...
                            </>
                        ) : (
                            <>
                                Iniciar sesión
                                <i className="fa-solid fa-arrow-right"></i>
                            </>
                        )}
                    </button>

                    
                    {error && (
                        <div
                            style={{
                                marginTop: "16px",
                                padding: "12px 14px",
                                background: "var(--ss-danger-soft)",
                                color: "var(--ss-danger)",
                                borderRadius: "var(--ss-radius)",
                                fontSize: "13px",
                                display: "flex",
                                alignItems: "center",
                                gap: "8px"
                            }}
                        >
                            <i className="fa-solid fa-circle-exclamation"></i>
                            {error}
                        </div>
                    )}

                </form>

                
                <div
                    style={{
                        margin: "24px 0",
                        position: "relative",
                        textAlign: "center",
                        fontSize: "12px",
                        color: "var(--ss-text-light)"
                    }}
                >
                    <span
                        style={{
                            background: "white",
                            padding: "0 12px",
                            position: "relative",
                            zIndex: 1
                        }}
                    >
                        ¿no tienes cuenta?
                    </span>

                    <div
                        style={{
                            position: "absolute",
                            top: "50%",
                            left: 0,
                            right: 0,
                            height: "1px",
                            background: "var(--ss-border)"
                        }}
                    />
                </div>

                
                <button
                    type="button"
                    onClick={() => navigate("/register")}
                    className="ss-btn ss-btn-outline ss-btn-block"
                >
                    Crear cuenta gratis
                </button>

            </div>
        </div>
    );
};

export default Login;