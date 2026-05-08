import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// 🧭 SIDEBAR ITEMS — adaptados a tu app
const SECTIONS = [
    { id: "profile", label: "Perfil", icon: "fa-user" },
    { id: "info", label: "Información", icon: "fa-circle-info" },
    { id: "lists", label: "Mis listas", icon: "fa-list-check" },
    { id: "notifications", label: "Notificaciones", icon: "fa-bell" },
    { id: "password", label: "Contraseña", icon: "fa-lock" },
];

export const Profile = () => {
    const [activeSection, setActiveSection] = useState("profile");
    const navigate = useNavigate();

    const role = sessionStorage.getItem("role");
    const email = sessionStorage.getItem("email") || "Usuario";

    const logout = () => {
        sessionStorage.clear();
        navigate("/login");
    };

    return (
        <div className="ss-section-sm ss-fade-in">
            <div className="ss-container">

                {/* Header pequeño */}
                <div style={{ marginBottom: "32px" }}>
                    <span className="ss-eyebrow">Tu cuenta</span>
                    <h1 style={{ fontSize: "32px", margin: 0, fontWeight: 800 }}>
                        Hola, {email.split("@")[0]} 👋
                    </h1>
                </div>

                {/* Layout: sidebar + contenido */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "260px 1fr",
                    gap: "24px",
                    alignItems: "flex-start"
                }} className="ss-account-layout">

                    {/* ===== SIDEBAR ===== */}
                    <aside className="ss-account-sidebar">
                        <nav>
                            {SECTIONS.map(section => (
                                <button
                                    key={section.id}
                                    className={`ss-sidebar-item ${activeSection === section.id ? "active" : ""}`}
                                    onClick={() => setActiveSection(section.id)}
                                >
                                    <i className={`fa-solid ${section.icon}`}></i>
                                    <span>{section.label}</span>
                                </button>
                            ))}

                            {/* Separador */}
                            <div style={{
                                height: "1px",
                                background: "var(--ss-border)",
                                margin: "12px 16px"
                            }} />

                            {/* Logout */}
                            <button
                                className="ss-sidebar-item"
                                onClick={logout}
                                style={{ color: "var(--ss-danger)" }}
                            >
                                <i className="fa-solid fa-right-from-bracket"></i>
                                <span>Cerrar sesión</span>
                            </button>
                        </nav>
                    </aside>

                    {/* ===== CONTENIDO ===== */}
                    <main>
                        {activeSection === "profile" && <ProfileSection role={role} email={email} />}
                        {activeSection === "info" && <InfoSection email={email} />}
                        {activeSection === "lists" && <ListsSection navigate={navigate} role={role} />}
                        {activeSection === "notifications" && <NotificationsSection />}
                        {activeSection === "password" && <PasswordSection />}
                    </main>
                </div>
            </div>

            {/* CSS embebido (estilos específicos del sidebar) */}
            <style>{`
                .ss-account-sidebar {
                    background: white;
                    border: 1px solid var(--ss-border);
                    border-radius: var(--ss-radius-md);
                    padding: 12px;
                    position: sticky;
                    top: 100px;
                }

                .ss-sidebar-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 14px;
                    border: none;
                    background: transparent;
                    text-align: left;
                    font-family: inherit;
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--ss-text-muted);
                    border-radius: var(--ss-radius);
                    cursor: pointer;
                    transition: var(--ss-transition);
                    margin-bottom: 2px;
                }

                .ss-sidebar-item i {
                    width: 16px;
                    text-align: center;
                    font-size: 13px;
                }

                .ss-sidebar-item:hover {
                    background: var(--ss-bg-soft);
                    color: var(--ss-green-dark);
                }

                .ss-sidebar-item.active {
                    background: var(--ss-pastel-green);
                    color: var(--ss-green-dark);
                }

                .ss-sidebar-item.active i {
                    color: var(--ss-green);
                }

                @media (max-width: 768px) {
                    .ss-account-layout {
                        grid-template-columns: 1fr !important;
                    }
                    .ss-account-sidebar {
                        position: static;
                    }
                    .ss-account-sidebar nav {
                        display: flex;
                        gap: 4px;
                        overflow-x: auto;
                        padding-bottom: 4px;
                    }
                    .ss-sidebar-item {
                        flex: 0 0 auto;
                        white-space: nowrap;
                    }
                }
            `}</style>
        </div>
    );
};

// ============================
// 👤 SECCIÓN: PERFIL (welcome card + stats)
// ============================
const ProfileSection = ({ role, email }) => {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState({ lists: 0, items: 0, completed: 0 });

    const backend = import.meta.env.VITE_BACKEND_URL;
    const currentImage = sessionStorage.getItem("image_url");
    const initials = email.split("@")[0].slice(0, 2).toUpperCase();

    useEffect(() => {
        // Cargar stats reales para el usuario
        if (role !== "user") return;

        fetch(`${backend}/api/lists-with-items`, {
            headers: { Authorization: "Bearer " + sessionStorage.getItem("token") }
        })
            .then(r => r.ok ? r.json() : [])
            .then(data => {
                if (!Array.isArray(data)) return;
                const items = data.flatMap(l => l.items || []);
                setStats({
                    lists: data.length,
                    items: items.length,
                    completed: items.filter(i => i.comprado).length
                });
            })
            .catch(() => { });
    }, []);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
    };

    const handleUpload = async () => {
        if (!file) return;
        setLoading(true);

        const token = sessionStorage.getItem("token");
        const endpoint = role === "admin" ? "/api/admin/profile/image" : "/api/profile/image";

        try {
            const formData = new FormData();
            formData.append("file", file);

            const uploadRes = await fetch(`${backend}/api/upload`, {
                method: "POST",
                body: formData
            });
            const uploadData = await uploadRes.json();

            await fetch(`${backend}${endpoint}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token
                },
                body: JSON.stringify({ image_url: uploadData.url })
            });

            sessionStorage.setItem("image_url", uploadData.url);
            setTimeout(() => window.location.reload(), 600);
        } catch (error) {
            console.error(error);
            setLoading(false);
        }
    };

    const displayImage = preview || currentImage;

    return (
        <div>
            {/* WELCOME CARD */}
            <div className="ss-card" style={{
                marginBottom: "24px",
                padding: "32px",
                background: "linear-gradient(135deg, var(--ss-pastel-green) 0%, white 100%)",
                border: "1px solid var(--ss-pastel-green)"
            }}>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    flexWrap: "wrap"
                }}>
                    {/* Avatar con uploader */}
                    <div style={{ position: "relative", flexShrink: 0 }}>
                        {displayImage ? (
                            <img
                                src={displayImage}
                                alt="perfil"
                                style={{
                                    width: "92px",
                                    height: "92px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                    border: "4px solid white",
                                    boxShadow: "var(--ss-shadow)"
                                }}
                            />
                        ) : (
                            <div style={{
                                width: "92px",
                                height: "92px",
                                borderRadius: "50%",
                                background: "var(--ss-lime)",
                                color: "var(--ss-green-dark)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "32px",
                                fontWeight: 800,
                                border: "4px solid white",
                                boxShadow: "var(--ss-shadow)"
                            }}>
                                {initials}
                            </div>
                        )}

                        <label style={{
                            position: "absolute",
                            bottom: "0",
                            right: "0",
                            width: "30px",
                            height: "30px",
                            borderRadius: "50%",
                            background: "var(--ss-green)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            border: "3px solid white",
                            fontSize: "11px"
                        }}>
                            <i className="fa-solid fa-camera"></i>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>

                    {/* Texto bienvenida */}
                    <div style={{ flex: 1, minWidth: "200px" }}>
                        <h2 style={{ fontSize: "24px", margin: "0 0 4px", fontWeight: 800 }}>
                            Bienvenido,{" "}
                            <span style={{ textTransform: "capitalize" }}>
                                {role === "admin" ? "Admin" : email.split("@")[0]}
                            </span>
                            !
                        </h2>
                        <p style={{ color: "var(--ss-text-muted)", margin: 0, fontSize: "14px" }}>
                            {role === "admin"
                                ? "Panel de administración"
                                : stats.items > 0
                                    ? `Tienes ${stats.items - stats.completed} productos pendientes de comprar`
                                    : "Aún no tienes productos. Crea tu primera lista 🚀"
                            }
                        </p>
                    </div>

                    {/* Botón guardar foto si hay nueva */}
                    {file && (
                        <button
                            onClick={handleUpload}
                            className="ss-btn ss-btn-bright"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <i className="fa-solid fa-spinner fa-spin"></i>
                                    Subiendo...
                                </>
                            ) : (
                                <>
                                    <i className="fa-solid fa-cloud-arrow-up"></i>
                                    Guardar foto
                                </>
                            )}
                        </button>
                    )}
                </div>
            </div>

            {/* STATS GRID (solo si es user) */}
            {role !== "admin" && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: "16px"
                }}>
                    <StatCard
                        icon="fa-list-check"
                        bg="var(--ss-pastel-green)"
                        color="var(--ss-green-dark)"
                        value={stats.lists}
                        label="Listas activas"
                    />
                    <StatCard
                        icon="fa-basket-shopping"
                        bg="var(--ss-pastel-cream)"
                        color="var(--ss-orange)"
                        value={stats.items}
                        label="Total productos"
                    />
                    <StatCard
                        icon="fa-circle-check"
                        bg="var(--ss-pastel-mint)"
                        color="var(--ss-green)"
                        value={stats.completed}
                        label="Comprados"
                    />
                    <StatCard
                        icon="fa-clock"
                        bg="var(--ss-lime)"
                        color="var(--ss-green-dark)"
                        value={stats.items - stats.completed}
                        label="Pendientes"
                    />
                </div>
            )}

            {/* Si es admin, mostrar accesos rápidos */}
            {role === "admin" && (
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                    gap: "16px"
                }}>
                    <QuickAccessCard
                        href="/users"
                        icon="fa-users"
                        bg="var(--ss-pastel-green)"
                        title="Usuarios"
                        desc="Gestionar cuentas"
                    />
                    <QuickAccessCard
                        href="/products"
                        icon="fa-box"
                        bg="var(--ss-pastel-cream)"
                        title="Productos"
                        desc="Catálogo"
                    />
                    <QuickAccessCard
                        href="/categories"
                        icon="fa-tags"
                        bg="var(--ss-pastel-mint)"
                        title="Categorías"
                        desc="Organización"
                    />
                    <QuickAccessCard
                        href="/admins"
                        icon="fa-shield-halved"
                        bg="var(--ss-lime)"
                        title="Admins"
                        desc="Equipo"
                    />
                </div>
            )}
        </div>
    );
};

// 📊 STAT CARD
const StatCard = ({ icon, bg, color, value, label }) => (
    <div className="ss-card" style={{ padding: "20px" }}>
        <div style={{
            width: "44px",
            height: "44px",
            borderRadius: "12px",
            background: bg,
            color: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "18px",
            marginBottom: "14px"
        }}>
            <i className={`fa-solid ${icon}`}></i>
        </div>
        <div style={{ fontSize: "28px", fontWeight: 800, color: "var(--ss-green-dark)", lineHeight: 1 }}>
            {value}
        </div>
        <div style={{ fontSize: "13px", color: "var(--ss-text-muted)", marginTop: "4px" }}>
            {label}
        </div>
    </div>
);

// 🚀 QUICK ACCESS CARD (para admin)
const QuickAccessCard = ({ href, icon, bg, title, desc }) => {
    const navigate = useNavigate();
    return (
        <div
            className="ss-card ss-card-hover"
            onClick={() => navigate(href)}
            style={{ cursor: "pointer", padding: "20px" }}
        >
            <div style={{
                width: "44px",
                height: "44px",
                borderRadius: "12px",
                background: bg,
                color: "var(--ss-green-dark)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "18px",
                marginBottom: "14px"
            }}>
                <i className={`fa-solid ${icon}`}></i>
            </div>
            <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--ss-green-dark)" }}>
                {title}
            </div>
            <div style={{ fontSize: "13px", color: "var(--ss-text-muted)", marginTop: "2px" }}>
                {desc} <i className="fa-solid fa-arrow-right" style={{ fontSize: "10px", marginLeft: "4px" }}></i>
            </div>
        </div>
    );
};

// ============================
// ℹ️ SECCIÓN: INFORMACIÓN
// ============================
const InfoSection = ({ email }) => {
    return (
        <div className="ss-card" style={{ padding: "32px" }}>
            <h2 style={{ fontSize: "20px", margin: "0 0 24px", fontWeight: 700 }}>
                Datos personales
            </h2>

            <div style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                marginBottom: "16px"
            }} className="ss-info-grid">
                <div>
                    <label className="ss-label">Nombre</label>
                    <div style={inputDisplayStyle}>
                        <i className="fa-solid fa-user" style={iconStyle}></i>
                        {email.split("@")[0]}
                    </div>
                </div>

                <div>
                    <label className="ss-label">Email</label>
                    <div style={inputDisplayStyle}>
                        <i className="fa-solid fa-envelope" style={iconStyle}></i>
                        {email}
                    </div>
                </div>

                <div>
                    <label className="ss-label">Teléfono</label>
                    <div style={inputDisplayStyle}>
                        <i className="fa-solid fa-phone" style={iconStyle}></i>
                        <span style={{ color: "var(--ss-text-light)" }}>No añadido</span>
                    </div>
                </div>

                <div>
                    <label className="ss-label">Cuenta creada</label>
                    <div style={inputDisplayStyle}>
                        <i className="fa-solid fa-calendar" style={iconStyle}></i>
                        Recientemente
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "16px" }}>
                <label className="ss-label">Dirección</label>
                <div style={inputDisplayStyle}>
                    <i className="fa-solid fa-location-dot" style={iconStyle}></i>
                    <span style={{ color: "var(--ss-text-light)" }}>No añadida</span>
                </div>
            </div>

            <div style={{
                marginTop: "24px",
                padding: "16px",
                background: "var(--ss-bg-soft)",
                borderRadius: "var(--ss-radius)",
                fontSize: "13px",
                color: "var(--ss-text-muted)",
                display: "flex",
                alignItems: "center",
                gap: "10px"
            }}>
                <i className="fa-solid fa-circle-info" style={{ color: "var(--ss-green)" }}></i>
                Próximamente podrás editar todos estos datos.
            </div>

            <style>{`
                @media (max-width: 640px) {
                    .ss-info-grid { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

// Estilos compartidos para "inputs de display"
const inputDisplayStyle = {
    padding: "12px 16px",
    border: "1px solid var(--ss-border)",
    borderRadius: "var(--ss-radius)",
    background: "var(--ss-bg-soft)",
    fontSize: "14px",
    color: "var(--ss-text)",
    display: "flex",
    alignItems: "center",
    gap: "10px"
};

const iconStyle = {
    color: "var(--ss-text-muted)",
    fontSize: "13px",
    width: "14px"
};

// ============================
// 📋 SECCIÓN: MIS LISTAS
// ============================
const ListsSection = ({ navigate, role }) => {
    if (role === "admin") {
        return (
            <div className="ss-card ss-empty">
                <div className="ss-empty-icon">
                    <i className="fa-solid fa-shield-halved"></i>
                </div>
                <h3 style={{ margin: "0 0 8px" }}>Eres administrador</h3>
                <p style={{ margin: "0 0 20px" }}>Esta sección es solo para usuarios.</p>
                <button className="ss-btn ss-btn-primary" onClick={() => navigate("/users")}>
                    Ir al panel admin
                </button>
            </div>
        );
    }

    return (
        <div className="ss-card" style={{ padding: "32px", textAlign: "center" }}>
            <div style={{
                width: "64px",
                height: "64px",
                borderRadius: "20px",
                background: "var(--ss-pastel-green)",
                color: "var(--ss-green-dark)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
                marginBottom: "16px"
            }}>
                <i className="fa-solid fa-list-check"></i>
            </div>
            <h2 style={{ fontSize: "22px", margin: "0 0 8px", fontWeight: 700 }}>
                Tus listas de compra
            </h2>
            <p style={{ color: "var(--ss-text-muted)", marginBottom: "20px", fontSize: "14px" }}>
                Gestiona todas tus listas, añade productos y genera ingredientes con IA.
            </p>
            <button
                className="ss-btn ss-btn-bright ss-btn-lg"
                onClick={() => navigate("/lists")}
            >
                Ir a mis listas
                <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    );
};

// ============================
// 🔔 SECCIÓN: NOTIFICACIONES
// ============================
const NotificationsSection = () => (
    <div className="ss-card" style={{ padding: "32px" }}>
        <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 700 }}>
            Notificaciones
        </h2>
        <p style={{ color: "var(--ss-text-muted)", fontSize: "14px", marginBottom: "24px" }}>
            Te avisaremos por aquí cuando haya novedades.
        </p>

        <div className="ss-empty">
            <div className="ss-empty-icon">
                <i className="fa-solid fa-bell-slash"></i>
            </div>
            <h3 style={{ margin: "0 0 8px" }}>Todo en orden</h3>
            <p style={{ margin: 0, fontSize: "14px" }}>No tienes notificaciones nuevas.</p>
        </div>
    </div>
);

// ============================
// 🔒 SECCIÓN: CONTRASEÑA
// ============================
const PasswordSection = () => {
    return (
        <div className="ss-card" style={{ padding: "32px" }}>
            <h2 style={{ fontSize: "20px", margin: "0 0 8px", fontWeight: 700 }}>
                Cambiar contraseña
            </h2>
            <p style={{ color: "var(--ss-text-muted)", fontSize: "14px", marginBottom: "24px" }}>
                Mantén tu cuenta segura usando una contraseña única.
            </p>

            <div style={{ marginBottom: "16px" }}>
                <label className="ss-label">Contraseña actual</label>
                <input type="password" className="ss-input" placeholder="••••••••" />
            </div>

            <div style={{ marginBottom: "16px" }}>
                <label className="ss-label">Nueva contraseña</label>
                <input type="password" className="ss-input" placeholder="Mínimo 6 caracteres" />
            </div>

            <div style={{ marginBottom: "20px" }}>
                <label className="ss-label">Confirmar nueva contraseña</label>
                <input type="password" className="ss-input" placeholder="Repite la nueva contraseña" />
            </div>

            <button
                className="ss-btn ss-btn-bright"
                onClick={() => alert("Funcionalidad próximamente disponible 🚀")}
            >
                <i className="fa-solid fa-check"></i>
                Actualizar contraseña
            </button>

            <div style={{
                marginTop: "20px",
                padding: "14px 16px",
                background: "var(--ss-bg-soft)",
                borderRadius: "var(--ss-radius)",
                fontSize: "13px",
                color: "var(--ss-text-muted)",
                display: "flex",
                alignItems: "flex-start",
                gap: "10px"
            }}>
                <i className="fa-solid fa-shield-halved" style={{ color: "var(--ss-green)", marginTop: "2px" }}></i>
                <span>Tu contraseña se almacena de forma segura. Nunca la compartiremos con terceros.</span>
            </div>
        </div>
    );
};