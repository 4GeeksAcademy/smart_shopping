import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const Users = () => {
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();
    const backend = import.meta.env.VITE_BACKEND_URL;

    const getUsers = () => {
        const token = sessionStorage.getItem("token");

        fetch(`${backend}/api/users`, {
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log("USERS:", data);
                setUsers(Array.isArray(data) ? data : []);
            })
            .catch(err => console.log(err));
    };

    useEffect(() => {
        getUsers();
    }, []);

    const deleteUser = (id) => {
        const token = sessionStorage.getItem("token");

        fetch(`${backend}/api/users/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        }).then(() => getUsers());
    };

    return (
        <div className="container">
            <h1>Usuarios</h1>

            <button onClick={() => navigate("/users/create")}>
                Crear usuario
            </button>

            <ul>
                {users.length === 0 ? (
                    <p>No hay usuarios registrados.</p>
                ) : (
                    users.map(user => (
                        <li key={user.id}>
                            {user.email}

                            <button onClick={() => deleteUser(user.id)}>
                                Eliminar
                            </button>

                            <button onClick={() => navigate(`/users/edit/${user.id}`)}>
                                Editar
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};