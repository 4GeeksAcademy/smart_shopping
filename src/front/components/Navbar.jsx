import { Link, useNavigate } from "react-router-dom";

export const Navbar = () => {
	const navigate = useNavigate();
	const token = sessionStorage.getItem("token");
	const role = sessionStorage.getItem("role");

	// 🔥 DATOS DEL USUARIO (con fallback)
	const userImage = sessionStorage.getItem("image_url") || "https://i.imgur.com/HeIi0wU.png";
	const userEmail = sessionStorage.getItem("email") || (role === "admin" ? "Admin" : "Usuario");

	const logout = () => {
		sessionStorage.clear();
		navigate("/login");
	};

	return (
		<nav className="navbar navbar-light bg-light px-3 d-flex justify-content-between">

			{/* IZQUIERDA */}
			<Link to="/" className="navbar-brand">
				Smart Shopping
			</Link>

			{/* DERECHA */}
			<div className="d-flex align-items-center gap-2">

				{/* 🔓 NO LOGUEADO */}
				{!token && (
					<>
						<Link to="/login" className="btn btn-primary">
							Login
						</Link>

						<Link to="/admin-login" className="btn btn-secondary">
							Admin
						</Link>
					</>
				)}

				{/* 👑 ADMIN */}
				{token && role === "admin" && (
					<>
						<Link to="/users" className="btn btn-outline-dark">Usuarios</Link>
						<Link to="/admins" className="btn btn-outline-dark">Admins</Link>
						<Link to="/products" className="btn btn-outline-dark">Productos</Link>
					</>
				)}

				{/* 👤 USER */}
				{token && role === "user" && (
					<>
						<Link to="/lists" className="btn btn-outline-dark">
							Mi lista
						</Link>
					</>
				)}

				{/* 🔥 PERFIL */}
				{token && (
					<div className="d-flex align-items-center gap-2 ms-3">

						<img
							src={userImage}
							alt="perfil"
							onClick={() => navigate("/profile")}
							style={{
								width: "40px",
								height: "40px",
								borderRadius: "50%",
								objectFit: "cover",
								cursor: "pointer"
							}}
						/>

						<span style={{ fontSize: "14px" }}>
							{userEmail}
						</span>

					</div>
				)}

				{/* 🚪 LOGOUT */}
				{token && (
					<button onClick={logout} className="btn btn-danger">
						Logout
					</button>
				)}

			</div>
		</nav>
	);
};