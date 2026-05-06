import React from "react";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import { useNavigate } from "react-router-dom";

export const Home = () => {

	const navigate = useNavigate();

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>

			<p className="lead">
				<img
					src={rigoImageUrl}
					className="img-fluid rounded-circle mb-3"
					alt="Rigo Baby"
				/>
			</p>

			<div className="alert alert-success">
				Backend conectado ✅
			</div>

			<br />

			{/* 🔥 ADMIN */}
			<button onClick={() => navigate("/users")}>
				Ir a usuarios
			</button>

			<button onClick={() => navigate("/categories")}>
				Ir a Categorias
			</button>

			<button onClick={() => navigate("/products")}>
				Ir a Productos
			</button>

			<button onClick={() => navigate("/admins")}>
				Ir a Admins
			</button>

			<br /><br />

			{/* 👤 USER */}
			<button onClick={() => navigate("/lists")}>
				Ir a ShoppingList
			</button>

			<button onClick={() => navigate("/items")}>
				Ir a Items
			</button>

			<br /><br />

			{/* 🔐 LOGIN */}
			<button onClick={() => navigate("/login")}>
				Ir a Login
			</button>

			<button onClick={() => navigate("/admin-login")}>
				Login Admin
			</button>

		</div>
	);
};