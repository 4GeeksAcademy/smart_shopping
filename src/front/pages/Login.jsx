import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");

        try {
            const resp = await fetch(
                import.meta.env.VITE_BACKEND_URL + "/api/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ email, password })
                }
            );

            const data = await resp.json();

            if (!resp.ok) {
                setError(data.msg || "Error en login");
                return;
            }

            // ✅ Guardar sesión
            sessionStorage.setItem("token", data.token);
            sessionStorage.setItem("user_id", data.user_id);
            sessionStorage.setItem("role", data.role);
            sessionStorage.setItem("email", data.email);
            sessionStorage.setItem("image_url", data.image_url);

            // ✅ Redirigir
            navigate("/lists");

        } catch (err) {
            console.error(err);
            setError("Error de conexión con el servidor");
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>

            {/* 🔥 CARD BONITA */}
            <div className="card p-4 shadow" style={{ width: "100%", maxWidth: "400px" }}>

                <h2 className="text-center mb-4">Login</h2>

                <form onSubmit={handleLogin}>

                    <input
                        type="email"
                        placeholder="Email"
                        className="form-control mb-3"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        className="form-control mb-3"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" className="btn btn-primary w-100">
                        Iniciar sesión
                    </button>

                    {/* 🔥 MENSAJE ERROR */}
                    {error && (
                        <div className="alert alert-danger mt-3">
                            {error}
                        </div>
                    )}

                    {/* 🔥 LINK REGISTRO */}
                    <div className="text-center mt-3">
                        <small className="text-muted">
                            ¿No tienes cuenta?{" "}
                            <span
                                style={{ cursor: "pointer", color: "#0d6efd", fontWeight: "bold" }}
                                onClick={() => navigate("/register")}
                            >
                                Crear cuenta
                            </span>
                        </small>
                    </div>

                </form>
            </div>
        </div>
    );
};

export default Login;