import { useState, useEffect } from 'react';
import { FaDesktop, FaHeadset, FaCrown, FaCheck, FaTimes, FaTools, FaClock, FaUser } from 'react-icons/fa';

// Definimos los íconos y colores por código para usarlos rápido
const TIER_CONFIG = {
    std: { icon: <FaDesktop />, color: 'border-secondary', badge: 'bg-secondary' },
    gmr: { icon: <FaHeadset />, color: 'border-primary', badge: 'bg-primary' },
    vip: { icon: <FaCrown />, color: 'border-warning', badge: 'bg-warning text-dark' }
};

const PageRent = () => {
    // ESTADOS
    const [equipos, setEquipos] = useState([]);
    const [tarifas, setTarifas] = useState({});
    const [filtro, setFiltro] = useState('todos'); // 'todos', 'std', 'gmr', 'vip'

    // Estado para el Modal de Alquiler
    const [showModal, setShowModal] = useState(false);
    const [selectedPC, setSelectedPC] = useState(null);
    const [clienteNombre, setClienteNombre] = useState('');
    const [horasAlquiler, setHorasAlquiler] = useState(1);

    // 1. CARGAR DATOS DEL DB.JSON
    useEffect(() => {
        // Cargar Tarifas
        fetch('http://localhost:3000/tarifas')
            .then(res => res.json())
            .then(data => setTarifas(data));

        // Cargar Equipos
        cargarEquipos();
    }, []);

    const cargarEquipos = () => {
        fetch('http://localhost:3000/computadoras')
            .then(res => res.json())
            .then(data => setEquipos(data))
            .catch(err => console.error("Error cargando PCs:", err));
    };

    // 2. FUNCIÓN PARA ABRIR MODAL
    const handleClickPC = (pc) => {
        if (pc.estado === 'ocupado' || pc.estado === 'mantenimiento') return; // Si está ocupada no hace nada (o podrías mostrar info)

        setSelectedPC(pc);
        setClienteNombre(''); // Limpiar campo
        setHorasAlquiler(1);  // Resetear horas
        setShowModal(true);
    };

    // 3. FUNCIÓN PARA CONFIRMAR ALQUILER (Simulación)
    const confirmarAlquiler = async () => {
        if (!selectedPC) return;

        // Aquí haríamos el PATCH a la base de datos
        // Simulamos la actualización local para que se vea rápido:
        const updatedPC = {
            ...selectedPC,
            estado: 'ocupado',
            cliente: clienteNombre || 'Invitado',
            horaInicio: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        // Actualizar en Servidor (DB.JSON)
        await fetch(`http://localhost:3000/equipos/${selectedPC.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                estado: 'ocupado',
                cliente: updatedPC.cliente,
                horaInicio: updatedPC.horaInicio
            })
        });

        // Recargar datos y cerrar modal
        cargarEquipos();
        setShowModal(false);
        alert(`¡Sesión iniciada en ${selectedPC.nombre}!`);
    };

    // 4. FILTRADO DE EQUIPOS
    const equiposFiltrados = filtro === 'todos'
        ? equipos
        : equipos.filter(pc => pc.tipo === filtro);

    return (
        <div className="container-fluid p-4" style={{ backgroundColor: '#f4f6f9', minHeight: '100vh' }}>

            {/* CABECERA Y FILTROS */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold text-dark">Alquiler de Equipos</h2>
                    <p className="text-muted">Selecciona una PC disponible para iniciar sesión.</p>
                </div>

                {/* Botones de Filtro */}
                <div className="btn-group shadow-sm">
                    <button className={`btn ${filtro === 'todos' ? 'btn-dark' : 'btn-light'}`} onClick={() => setFiltro('todos')}>Todas</button>
                    <button className={`btn ${filtro === 'std' ? 'btn-dark' : 'btn-light'}`} onClick={() => setFiltro('std')}>Standard</button>
                    <button className={`btn ${filtro === 'gmr' ? 'btn-dark' : 'btn-light'}`} onClick={() => setFiltro('gmr')}>Gamer</button>
                    <button className={`btn ${filtro === 'vip' ? 'btn-dark' : 'btn-light'}`} onClick={() => setFiltro('vip')}>VIP</button>
                </div>
            </div>

            {/* LEYENDA DE PRECIOS (Info rápida) */}
            <div className="row mb-4">
                {Object.entries(tarifas).map(([key, info]) => (
                    <div key={key} className="col-md-4 mb-2">
                        <div className={`card text-white ${key === 'vip' ? 'bg-warning text-dark' : key === 'gmr' ? 'bg-primary' : 'bg-secondary'}`}>
                            <div className="card-body d-flex justify-content-between align-items-center py-2">
                                <div>
                                    <strong className="text-uppercase">{info.nombre}</strong>
                                    <div className="small opacity-75">{info.desc}</div>
                                </div>
                                <h4 className="m-0">${info.precio.toFixed(2)}<span className="fs-6">/h</span></h4>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* GRID DE COMPUTADORAS */}
            <div className="row g-4">
                {equiposFiltrados.map(pc => {
                    // Configuraciones visuales según estado
                    const isAvailable = pc.estado === 'disponible';
                    const isBusy = pc.estado === 'ocupado';
                    const config = TIER_CONFIG[pc.tipo] || TIER_CONFIG.std;

                    return (
                        <div key={pc.id} className="col-sm-6 col-md-4 col-lg-3">
                            <div
                                className={`card h-100 shadow-sm border-2 ${isAvailable ? 'cursor-pointer' : ''} ${isAvailable ? config.color : 'border-danger'}`}
                                style={{ transition: 'transform 0.2s', opacity: pc.estado === 'mantenimiento' ? 0.6 : 1 }}
                                onClick={() => handleClickPC(pc)}
                                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.03)'}
                                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                <div className="card-body text-center">
                                    {/* Badge de Categoría */}
                                    <span className={`badge position-absolute top-0 start-50 translate-middle ${config.badge}`}>
                                        {tarifas[pc.tipo]?.nombre || pc.tipo}
                                    </span>

                                    {/* Icono Principal */}
                                    <div className={`display-4 mb-3 ${isAvailable ? 'text-success' : isBusy ? 'text-danger' : 'text-muted'}`}>
                                        {pc.estado === 'mantenimiento' ? <FaTools /> : config.icon}
                                    </div>

                                    <h5 className="card-title fw-bold">{pc.nombre}</h5>

                                    {/* Estado Texto */}
                                    <div className={`mb-2 fw-bold ${isAvailable ? 'text-success' : isBusy ? 'text-danger' : 'text-muted'}`}>
                                        {isAvailable && <><FaCheck className="me-1" /> Disponible</>}
                                        {isBusy && <><FaClock className="me-1" /> Ocupado</>}
                                        {pc.estado === 'mantenimiento' && <><FaTimes className="me-1" /> Mantenimiento</>}
                                    </div>

                                    {/* Info Adicional si está ocupada */}
                                    {isBusy && (
                                        <div className="bg-light p-2 rounded border mt-2">
                                            <small className="d-block text-muted">Cliente:</small>
                                            <strong>{pc.cliente}</strong>
                                            <div className="small text-muted mt-1">Inicio: {pc.horaInicio}</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL DE ALQUILER (Manual con Bootstrap Classes) */}
            {showModal && selectedPC && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className="modal-header bg-dark text-white">
                                <h5 className="modal-title">
                                    Alquilar {selectedPC.nombre} <span className="badge bg-warning text-dark ms-2">{tarifas[selectedPC.tipo].nombre}</span>
                                </h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label className="form-label">Nombre del Cliente (Opcional)</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><FaUser /></span>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Ej. Juan Pérez"
                                            value={clienteNombre}
                                            onChange={(e) => setClienteNombre(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <div className="mb-3">
                                    <label className="form-label">Tiempo (Horas)</label>
                                    <div className="d-flex gap-2">
                                        {[1, 2, 3, 5].map(h => (
                                            <button
                                                key={h}
                                                className={`btn flex-fill ${horasAlquiler === h ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                onClick={() => setHorasAlquiler(h)}
                                            >
                                                {h}h
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="alert alert-info d-flex justify-content-between align-items-center">
                                    <span>Total a Pagar:</span>
                                    <span className="fs-4 fw-bold">${(tarifas[selectedPC.tipo].precio * horasAlquiler).toFixed(2)}</span>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="button" className="btn btn-success w-50" onClick={confirmarAlquiler}>INICIAR SESIÓN</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PageRent;