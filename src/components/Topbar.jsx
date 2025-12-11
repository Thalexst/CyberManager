import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaDesktop, FaGamepad, FaHamburger, FaUser, FaTimes } from 'react-icons/fa';
import { useFetch } from '../hooks/useFetch';

const Topbar = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const navigate = useNavigate();

    // 1. Cargamos TODOS los datos para poder buscar en ellos
    const { data: pcs } = useFetch('computadoras');
    const { data: juegos } = useFetch('juegos');
    const { data: productos } = useFetch('productos');
    const { data: clientes } = useFetch('clientes');

    // 2. Lógica de Filtrado "En Vivo"
    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const lowerQuery = query.toLowerCase();
        const found = [];

        // Buscar en PCs
        if (pcs) {
            pcs.forEach(pc => {
                if (pc.nombre.toLowerCase().includes(lowerQuery) || pc.specs.toLowerCase().includes(lowerQuery)) {
                    found.push({ type: 'pc', data: pc, icon: <FaDesktop className="text-primary" />, link: '/equipos' });
                }
            });
        }

        // Buscar en Juegos
        if (juegos) {
            juegos.forEach(j => {
                if (j.titulo.toLowerCase().includes(lowerQuery)) {
                    found.push({ type: 'game', data: j, icon: <FaGamepad className="text-warning" />, link: '/juegos' });
                }
            });
        }

        // Buscar en Productos
        if (productos) {
            productos.forEach(p => {
                if (p.nombre.toLowerCase().includes(lowerQuery)) {
                    found.push({ type: 'food', data: p, icon: <FaHamburger className="text-danger" />, link: '/productos' });
                }
            });
        }

        // Buscar en Clientes
        if (clientes) {
            clientes.forEach(c => {
                if (c.nickname.toLowerCase().includes(lowerQuery) || c.nombre.toLowerCase().includes(lowerQuery)) {
                    found.push({ type: 'client', data: c, icon: <FaUser className="text-info" />, link: '/clientes' });
                }
            });
        }

        setResults(found);
    }, [query, pcs, juegos, productos, clientes]);

    const handleNavigate = (link) => {
        navigate(link);
        setQuery(''); // Limpiar búsqueda al ir
        setResults([]);
    };

    return (
        <div className="bg-dark border-bottom border-secondary p-3 mb-4 d-flex align-items-center justify-content-between position-relative shadow-sm">

            {/* Saludo / Breadcrumb */}
            <h5 className="text-white m-0 d-none d-md-block">👋 Bienvenido, <span className="text-primary fw-bold">Admin</span></h5>

            {/* BARRA DE BÚSQUEDA */}
            <div className="position-relative" style={{ width: '100%', maxWidth: '400px' }}>
                <div className="input-group">
                    <span className="input-group-text bg-secondary border-0 text-white"><FaSearch /></span>
                    <input
                        type="text"
                        className="form-control bg-secondary text-white border-0"
                        placeholder="Buscar PC, juego, cliente..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    {query && (
                        <button className="btn btn-secondary border-0" onClick={() => { setQuery(''); setResults([]); }}>
                            <FaTimes />
                        </button>
                    )}
                </div>

                {/* DROPDOWN DE RESULTADOS FLOTANTE */}
                {results.length > 0 && (
                    <div className="position-absolute w-100 bg-dark border border-secondary rounded mt-2 shadow-lg p-2"
                        style={{ zIndex: 1000, maxHeight: '300px', overflowY: 'auto' }}>
                        <small className="text-muted ms-2 mb-2 d-block">Resultados encontrados ({results.length})</small>

                        {results.map((item, idx) => (
                            <div
                                key={idx}
                                className="d-flex align-items-center p-2 rounded text-decoration-none text-white search-item"
                                style={{ cursor: 'pointer', transition: '0.2s' }}
                                onClick={() => handleNavigate(item.link)}
                                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)'}
                                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                            >
                                <div className="fs-4 me-3">{item.icon}</div>
                                <div>
                                    {/* Lógica para mostrar nombre según el tipo */}
                                    <h6 className="m-0 fw-bold">
                                        {item.type === 'pc' && item.data.nombre}
                                        {item.type === 'game' && item.data.titulo}
                                        {item.type === 'food' && item.data.nombre}
                                        {item.type === 'client' && item.data.nickname}
                                    </h6>
                                    <small className="text-muted">
                                        {item.type === 'pc' && `Estado: ${item.data.estado}`}
                                        {item.type === 'game' && `Género: ${item.data.genero}`}
                                        {item.type === 'food' && `Stock: ${item.data.stock} | $${item.data.precio}`}
                                        {item.type === 'client' && `Nombre: ${item.data.nombre}`}
                                    </small>
                                </div>
                                <span className="ms-auto badge bg-secondary" style={{ fontSize: '0.6rem' }}>IR</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Topbar;