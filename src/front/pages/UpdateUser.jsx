import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";

export const UpdateUser = () => {
    const [email, setEmail] = useState("");
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/users/" + id)
            .then(res => res.json())
            .then(data => {
                setEmail(data.email);
            });
    }, [id]);

  
    const updateUser = () => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/users/" + id, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email
            })
        })
            .then(res => res.json())
            .then(() => {
                navigate("/");
                window.location.reload();
            });
    };

    return (
        <>
            <h1>Actualizar Usuario {id}</h1>

            <input
                type="text"
                value={email}
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <button onClick={updateUser}>
                Actualizar
            </button>
        </>
    );
};