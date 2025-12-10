import { useState } from "react";
import { useNavigate } from "react-router-dom";

// CORRECCIÓN: Agregamos otro "../" para subir dos niveles
import api from "../../services/api";

function PageLogin() {
    const [user, setUser] = useState('');
    const [pass, setPass] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        // Validamos contra la API usando query params
        const response = await api.get(`/usuarios?user=${user}&pass=${pass}`);

        if (response.data.length > 0) {
            // Guardamos el usuario encontrado en localStorage
            localStorage.setItem('user', JSON.stringify(response.data[0]));
            navigate('/dashboard');
        } else {
            alert('Credenciales incorrectas');
        }
    };

    return (
        <div className="card p-4 shadow-lg text-white bg-dark border-secondary">
            <h3 className="text-center mb-4 text-primary fw-bold">🚀 CyberNet</h3>
            <h5 className="text-center mb-4">Iniciar Sesión</h5>

            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label className="form-label">Usuario</label>
                    <input
                        className="form-control bg-secondary text-white border-0"
                        placeholder="Ej. admin"
                        onChange={e => setUser(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="mb-4">
                    <label className="form-label">Contraseña</label>
                    <input
                        type="password"
                        className="form-control bg-secondary text-white border-0"
                        placeholder="Ej. 123"
                        onChange={e => setPass(e.target.value)}
                    />
                </div>

                <button className="btn btn-primary w-100 fw-bold">Ingresar</button>
            </form>
        </div>
    );
}

export default PageLogin;