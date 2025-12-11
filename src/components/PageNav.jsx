import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
// Importamos todos los íconos de una sola vez
import {
    FaGamepad,
    FaDesktop,
    FaUsers,
    FaPowerOff,
    FaIdCard,
    FaLaptop,
    FaHamburger,
    FaChartBar
} from 'react-icons/fa';

function PageNav() {
    const location = useLocation();
    const [usuario, setUsuario] = useState(null);

    useEffect(() => {
        // 1. Leemos el usuario que guardamos al hacer Login
        const userStored = localStorage.getItem('user');
        if (userStored) {
            setUsuario(JSON.parse(userStored));
        }
    }, []);

    // Si no ha cargado el usuario, no mostramos nada aún
    if (!usuario) return null;

    // Lógica de Rol: ¿Es Administrador? (En tu db.json, Rol 1 es Admin)
    const esAdmin = usuario.id_rol === 1;

    return (
        <div className="d-flex flex-column p-3 text-white vh-100 position-fixed" style={{ width: '250px', background: '#111', borderRight: '1px solid #333', zIndex: 1000 }}>

            {/* --- LOGO CLICKEABLE --- */}
            <Link to="/dashboard" className="text-decoration-none">
                <h3 className="fs-4 mb-2 text-center text-primary fw-bold">🚀 CyberNet</h3>
            </Link>
            {/* ----------------------- */}

            {/* Mostramos quién está conectado y su Rol */}
            <div className="text-center mb-4 text-muted small">
                Usuario: <span className="text-white">{usuario.user}</span> <br />
                Rol: <span className={esAdmin ? "text-warning" : "text-info"}>
                    {esAdmin ? "Administrador" : "Cajero"}
                </span>
            </div>

            <hr />

            <ul className="nav nav-pills flex-column mb-auto">
                {/* TODOS PUEDEN VER ESTO: */}
                <li className="nav-item mb-2">
                    <Link to="/dashboard" className={`nav-link gap-2 d-flex align-items-center ${location.pathname === '/dashboard' ? 'active' : 'text-white'}`}>
                        <FaDesktop /> Panel Principal
                    </Link>
                </li>
                <li className="nav-item mb-2">
                    <Link to="/nueva-sesion" className={`nav-link gap-2 d-flex align-items-center ${location.pathname === '/nueva-sesion' ? 'active' : 'text-white'}`}>
                        <FaGamepad /> Alquilar PC
                    </Link>
                </li>

                {/* SOLO EL ADMIN (Rol 1) PUEDE VER ESTO: */}
                {esAdmin && (
                    <>
                        <small className="text-uppercase text-muted mt-3 mb-1 ms-2" style={{ fontSize: '0.7rem' }}>Administración</small>

                        <li className="nav-item mb-2">
                            <Link to="/clientes" className={`nav-link gap-2 d-flex align-items-center ${location.pathname === '/clientes' ? 'active' : 'text-white'}`}>
                                <FaUsers /> Clientes
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/equipos" className={`nav-link gap-2 d-flex align-items-center ${location.pathname === '/equipos' ? 'active' : 'text-white'}`}>
                                <FaLaptop /> Inventario PCs
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/membresias" className={`nav-link gap-2 d-flex align-items-center ${location.pathname === '/membresias' ? 'active' : 'text-white'}`}>
                                <FaIdCard /> Membresías
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/productos" className={`nav-link gap-2 d-flex align-items-center ${location.pathname === '/productos' ? 'active' : 'text-white'}`}>
                                <FaHamburger /> Cafetería
                            </Link>
                        </li>
                        <li className="nav-item mb-2">
                            <Link to="/juegos" className={`nav-link gap-2 d-flex align-items-center ${location.pathname === '/juegos' ? 'active' : 'text-white'}`}>
                                <FaGamepad /> Juegos
                            </Link>
                        </li>

                        {/* --- ENLACE REPORTES --- */}
                        <li className="nav-item mb-2">
                            <Link
                                to="/reportes"
                                className={`nav-link gap-2 d-flex align-items-center ${location.pathname === '/reportes' ? 'active' : 'text-white'}`}
                            >
                                <FaChartBar /> Reportes
                            </Link>
                        </li>
                        {/* ----------------------- */}
                    </>
                )}
            </ul>

            <hr />
            <div className="dropdown">
                <Link to="/" className="d-flex align-items-center text-white text-decoration-none gap-2 btn btn-danger w-100" onClick={() => localStorage.removeItem('user')}>
                    <FaPowerOff /> Cerrar Sesión
                </Link>
            </div>
        </div>
    );
}

export default PageNav;