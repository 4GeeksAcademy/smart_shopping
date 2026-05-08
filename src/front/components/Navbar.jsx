import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

export const Navbar = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const [searchTerm, setSearchTerm] = useState("");

    const token = sessionStorage.getItem("token");
    const role = sessionStorage.getItem("role");

    const userImage = sessionStorage.getItem("image_url");

    const userEmail =
        sessionStorage.getItem("email") ||
        (role === "admin" ? "Admin" : "Usuario");

    const logout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path;

    const initials = userEmail
        .split("@")[0]
        .split(/[._-]/)
        .map(s => s[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const handleSearch = (e) => {

        e.preventDefault();

        // 🔥 SOLO ADMIN PUEDE BUSCAR PRODUCTOS
        if (role === "admin") {

            navigate("/products");

        }
    };

    return (

        <nav className="ss-navbar">

            <div className="ss-navbar-inner">

                {/* 🛒 BRAND */}
                <Link to="/" className="ss-brand">

                    <span className="ss-brand-icon">
                        <i className="fa-solid fa-basket-shopping"></i>
                    </span>

                    <span>Smart Shopping</span>

                </Link>

                {/* 🔗 LINKS */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "4px"
                    }}
                >

                    <Link
                        to="/"
                        className={`ss-nav-text-link ${isActive("/") ? "active" : ""}`}
                    >
                        Home
                    </Link>

                    {/* 👤 USER */}
                    {token && role === "user" && (

                        <Link
                            to="/lists"
                            className={`ss-nav-text-link ${isActive("/lists") ? "active" : ""}`}
                        >
                            Mis listas
                        </Link>

                    )}

                    {/* 👑 ADMIN */}
                    {token && role === "admin" && (

                        <>
                            <Link
                                to="/products"
                                className={`ss-nav-text-link ${isActive("/products") ? "active" : ""}`}
                            >
                                Productos
                            </Link>

                            <Link
                                to="/users"
                                className={`ss-nav-text-link ${isActive("/users") ? "active" : ""}`}
                            >
                                Usuarios
                            </Link>

                            <Link
                                to="/categories"
                                className={`ss-nav-text-link ${isActive("/categories") ? "active" : ""}`}
                            >
                                Categorías
                            </Link>

                            <Link
                                to="/admins"
                                className={`ss-nav-text-link ${isActive("/admins") ? "active" : ""}`}
                            >
                                Admins
                            </Link>
                        </>

                    )}

                </div>

                {/* 🔍 BUSCADOR SOLO ADMIN */}
                {role === "admin" && (

                    <form
                        className="ss-search-bar"
                        onSubmit={handleSearch}
                    >

                        <input
                            type="text"
                            className="ss-search-input"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <button
                            type="submit"
                            className="ss-search-btn"
                        >

                            <i
                                className="fa-solid fa-magnifying-glass"
                                style={{ marginRight: "6px" }}
                            ></i>

                            Buscar

                        </button>

                    </form>

                )}

                {/* 👤 DERECHA */}
                <div className="ss-nav-actions">

                    {/* NO LOGUEADO */}
                    {!token && (

                        <>
                            <Link
                                to="/login"
                                className="ss-nav-text-link"
                            >
                                Iniciar sesión
                            </Link>

                            <Link
                                to="/register"
                                className="ss-btn ss-btn-sm"
                                style={{
                                    background: "white",
                                    color: "var(--ss-green-dark)"
                                }}
                            >
                                Registrarse
                            </Link>
                        </>

                    )}

                    {/* LOGUEADO */}
                    {token && (

                        <>

                            <div
                                className="ss-nav-greeting"
                                onClick={() => navigate("/profile")}
                            >

                                {userImage ? (

                                    <img
                                        src={userImage}
                                        alt="perfil"
                                        className="ss-avatar"
                                    />

                                ) : (

                                    <div
                                        className="ss-avatar"
                                        style={{
                                            background: "var(--ss-lime)",
                                            color: "var(--ss-green-dark)",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: 700,
                                            fontSize: "13px"
                                        }}
                                    >
                                        {initials || "U"}
                                    </div>

                                )}

                                <div className="ss-nav-greeting-text">

                                    <small>Hola</small>

                                    <strong>
                                        {userEmail.split("@")[0]}
                                    </strong>

                                </div>

                            </div>

                            <button
                                onClick={logout}
                                className="ss-nav-icon-btn"
                                title="Cerrar sesión"
                            >

                                <i className="fa-solid fa-right-from-bracket"></i>

                            </button>

                        </>

                    )}

                </div>

            </div>

        </nav>

    );
};