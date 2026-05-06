import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export const UserDetail = () => {
    const { id } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(import.meta.env.VITE_BACKEND_URL + "/api/users/" + id)
            .then(res => res.json())
            .then(data => setUser(data));
    }, [id]);

    return (
        <div>
            <h1>Detalle Usuario</h1>

            {user ? (
                <>
                    <p>Email: {user.email}</p>
                    <p>ID: {user.id}</p>
                </>
            ) : (
                <p>Cargando...</p>
            )}
        </div>
    );
};