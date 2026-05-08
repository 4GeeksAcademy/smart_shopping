import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const Home = () => {
	const navigate = useNavigate();
	const token = sessionStorage.getItem("token");
	const role = sessionStorage.getItem("role");
	const [categories, setCategories] = useState([]);
	const backend = import.meta.env.VITE_BACKEND_URL;
	// Categorías visuales (con iconos emoji + colores pastel propios)
	const categoryVisuals = [
		{ name: "Frutas", emoji: "🍓", bg: "var(--ss-pastel-green)", count: 12 },
		{ name: "Verduras", emoji: "🥦", bg: "var(--ss-pastel-mint)", count: 18 },
		{ name: "Carnes", emoji: "🥩", bg: "var(--ss-pastel-pink)", count: 8 },
		{ name: "Lácteos", emoji: "🧀", bg: "var(--ss-pastel-cream)", count: 10 },
		{ name: "Bebidas", emoji: "🥤", bg: "var(--ss-pastel-lime)", count: 14 },
	];
	useEffect(() => {
		// Intentar cargar categorías reales (no bloquea si falla)
		fetch(`${backend}/api/categories`)
			.then(r => r.ok ? r.json() : [])
			.then(data => Array.isArray(data) && setCategories(data))
			.catch(() => { });
	}, []);
	return (
		<div className="ss-fade-in">
			{/* ===== HERO ===== */}
			<div className="ss-section-sm">
				<div className="ss-container">
					<div className="ss-hero">
						<div>
							<span className="ss-eyebrow">Hoy en oferta</span>
							<h1 className="ss-hero-title">
								Tu compra,<br />
								<span style={{ color: "var(--ss-green)" }}>más lista.</span>
							</h1>
							<p style={{
								fontSize: "16px",
								color: "var(--ss-text-muted)",
								lineHeight: 1.6,
								marginBottom: "28px",
								maxWidth: "440px"
							}}>
								Organiza tus listas, marca lo comprado y deja que la IA
								te diga qué ingredientes te faltan para tus recetas.
							</p>
							<div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
								{!token ? (
									<>
										<button
											className="ss-btn ss-btn-primary ss-btn-lg"
											onClick={() => navigate("/register")}
										>
											Empezar gratis
											<i className="fa-solid fa-arrow-right"></i>
										</button>
										<button
											className="ss-btn ss-btn-outline ss-btn-lg"
											onClick={() => navigate("/login")}
										>
											Iniciar sesión
										</button>
									</>
								) : (
									<button
										className="ss-btn ss-btn-primary ss-btn-lg"
										onClick={() => navigate(role === "admin" ? "/products" : "/lists")}
									>
										Ir a {role === "admin" ? "panel admin" : "mis listas"}
										<i className="fa-solid fa-arrow-right"></i>
									</button>
								)}
							</div>
						</div>
						{/* Ilustración derecha (cesta de productos con emojis) */}
						<div className="ss-hero-illustration" style={{ position: "relative" }}>
							<div style={{
								background: "white",
								width: "320px",
								height: "320px",
								borderRadius: "50%",
								display: "inline-flex",
								alignItems: "center",
								justifyContent: "center",
								boxShadow: "0 20px 60px rgba(0,184,83,0.12)",
								position: "relative"
							}}>
								<span style={{ fontSize: "180px", lineHeight: 1 }}>🛒</span>
								{/* Emojis flotantes alrededor */}
								<span style={{ position: "absolute", top: "10%", left: "15%", fontSize: "44px" }}>🍅</span>
								<span style={{ position: "absolute", top: "5%", right: "20%", fontSize: "38px" }}>🥬</span>
								<span style={{ position: "absolute", bottom: "8%", left: "8%", fontSize: "40px" }}>🥕</span>
								<span style={{ position: "absolute", bottom: "12%", right: "10%", fontSize: "42px" }}>🍋</span>
								{/* Badge de oferta */}
								<div style={{
									position: "absolute",
									top: "30%",
									right: "-20px",
									width: "82px",
									height: "82px",
									borderRadius: "50%",
									background: "var(--ss-green-dark)",
									color: "white",
									display: "flex",
									flexDirection: "column",
									alignItems: "center",
									justifyContent: "center",
									fontWeight: 800,
									fontSize: "11px",
									boxShadow: "0 8px 24px rgba(13,53,32,0.3)"
								}}>
									<span style={{ opacity: 0.7, fontSize: "10px" }}>Ahorra</span>
									<span style={{ fontSize: "20px" }}>20%</span>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* ===== SHOP BY CATEGORY ===== */}
			<div className="ss-section">
				<div className="ss-container">
					<div className="ss-section-header">
						<span className="ss-script">Compra por categoría</span>
						<h2>Lo más popular en Smart Shopping</h2>
					</div>
					<div style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
						gap: "20px"
					}}>
						{categoryVisuals.map((cat, idx) => (
							<div
								key={idx}
								className="ss-cat-card"
								style={{ background: cat.bg }}
								onClick={() => token ? navigate(role === "admin" ? "/products" : "/lists") : navigate("/login")}
							>
								<div className="ss-cat-card-title">{cat.name}</div>
								<div className="ss-cat-card-meta">{cat.count} productos</div>
								<div className="ss-cat-card-icon">{cat.emoji}</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{/* ===== FEATURES (3 cards) ===== */}
			<div className="ss-section" style={{ paddingTop: 0 }}>
				<div className="ss-container">
					<div className="ss-section-header">
						<span className="ss-script">¿Por qué nosotros?</span>
						<h2>Comprar nunca fue tan fácil</h2>
					</div>
					<div style={{
						display: "grid",
						gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
						gap: "20px"
					}}>
						<FeatureCard
							icon="fa-list-check"
							bg="var(--ss-pastel-green)"
							color="var(--ss-green-dark)"
							title="Listas ilimitadas"
							text="Crea tantas listas como necesites: la compra semanal, una cena especial, eventos…"
						/>
						<FeatureCard
							icon="fa-wand-magic-sparkles"
							bg="var(--ss-lime)"
							color="var(--ss-green-dark)"
							title="IA por receta"
							text="Escribe el nombre de una receta y la IA te genera los ingredientes en segundos."
							highlight
						/>
						<FeatureCard
							icon="fa-circle-check"
							bg="var(--ss-green-dark)"
							color="var(--ss-lime)"
							title="Marca lo comprado"
							text="Tacha productos a medida que avanzas. Barra de progreso visual incluida."
						/>
					</div>
				</div>
			</div>
			{/* ===== CTA BANNER (estilo "Get the app") ===== */}
			<div className="ss-footer-cta">
				<div className="ss-container">
					<div className="ss-footer-cta-inner">
						<div>
							<h2>Empieza a organizar<br />tu compra de forma inteligente</h2>
							<p style={{ color: "rgba(255,255,255,0.85)", fontSize: "16px", marginBottom: "28px", lineHeight: 1.6 }}>
								Únete gratis y descubre cómo la IA puede ahorrarte tiempo en cada compra.
							</p>
							<div className="ss-footer-cta-buttons">
								<a
									href={token ? "/lists" : "/register"}
									onClick={(e) => { e.preventDefault(); navigate(token ? "/lists" : "/register"); }}
									className="ss-footer-cta-btn"
								>
									<i className="fa-solid fa-rocket" style={{ fontSize: "20px" }}></i>
									<span>
										<small>Empieza ahora</small>
										<strong>Es gratis</strong>
									</span>
								</a>
								<a
									href={token ? "/profile" : "/login"}
									onClick={(e) => { e.preventDefault(); navigate(token ? "/profile" : "/login"); }}
									className="ss-footer-cta-btn"
								>
									<i className="fa-solid fa-user" style={{ fontSize: "20px" }}></i>
									<span>
										<small>Tu cuenta</small>
										<strong>Acceder</strong>
									</span>
								</a>
							</div>
						</div>
						{/* Imagen mockup decorativa */}
						<div style={{ textAlign: "center", position: "relative" }}>
							<div style={{
								background: "white",
								borderRadius: "24px",
								padding: "20px",
								display: "inline-block",
								boxShadow: "0 30px 80px rgba(0,0,0,0.2)",
								transform: "rotate(-3deg)"
							}}>
								<div style={{
									width: "240px",
									height: "320px",
									background: "var(--ss-bg-soft)",
									borderRadius: "16px",
									padding: "16px",
									display: "flex",
									flexDirection: "column",
									gap: "8px"
								}}>
									<div style={{ fontSize: "11px", color: "var(--ss-green)", fontWeight: 700, fontFamily: "Caveat, cursive", fontSize: "16px" }}>Mi lista 🛒</div>
									<div style={{ fontSize: "16px", fontWeight: 800, color: "var(--ss-green-dark)", marginBottom: "8px" }}>Compra del finde</div>
									{[
										{ e: "🍅", name: "Tomates", done: true },
										{ e: "🥖", name: "Pan", done: true },
										{ e: "🥚", name: "Huevos", done: false },
										{ e: "🧀", name: "Queso", done: false },
										{ e: "🥬", name: "Lechuga", done: false },
									].map((it, i) => (
										<div key={i} style={{
											background: "white",
											padding: "8px 10px",
											borderRadius: "10px",
											display: "flex",
											alignItems: "center",
											gap: "8px",
											fontSize: "12px",
											color: "var(--ss-text)",
											textDecoration: it.done ? "line-through" : "none",
											opacity: it.done ? 0.6 : 1
										}}>
											<span>{it.e}</span>
											<span style={{ flex: 1 }}>{it.name}</span>
											{it.done && <i className="fa-solid fa-check" style={{ color: "var(--ss-green)", fontSize: "10px" }}></i>}
										</div>
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
				{/* Decoración de fondo */}
				<div style={{
					position: "absolute",
					bottom: "-60px",
					left: "-60px",
					width: "200px",
					height: "200px",
					borderRadius: "50%",
					background: "rgba(255,255,255,0.06)",
					pointerEvents: "none"
				}} />
				<div style={{
					position: "absolute",
					top: "-40px",
					right: "10%",
					width: "140px",
					height: "140px",
					borderRadius: "50%",
					background: "rgba(212,242,77,0.1)",
					pointerEvents: "none"
				}} />
			</div>
		</div>
	);
};
const FeatureCard = ({ icon, bg, color, title, text, highlight }) => (
	<div className="ss-card ss-card-hover" style={highlight ? { border: "2px solid var(--ss-lime)" } : {}}>
		<div style={{
			width: "52px",
			height: "52px",
			borderRadius: "14px",
			background: bg,
			color: color,
			display: "flex",
			alignItems: "center",
			justifyContent: "center",
			fontSize: "22px",
			marginBottom: "16px"
		}}>
			<i className={`fa-solid ${icon}`}></i>
		</div>
		<h3 style={{ fontSize: "19px", margin: "0 0 8px", fontWeight: 700 }}>
			{title}
		</h3>
		<p style={{ color: "var(--ss-text-muted)", fontSize: "14px", margin: 0, lineHeight: 1.6 }}>
			{text}
		</p>
	</div>
);