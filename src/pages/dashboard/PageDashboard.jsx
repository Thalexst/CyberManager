import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaDesktop, FaGamepad, FaDoorOpen, FaCheckCircle, FaExclamationCircle, FaTools, FaPowerOff, FaPlay } from 'react-icons/fa';

const PageDashboard = () => {
    const navigate = useNavigate();

    // 1. ESTADOS
    const [equipos, setEquipos] = useState([]);
    const [salas, setSalas] = useState([]);
    const [resumen, setResumen] = useState({ total: 0, disponibles: 0, ocupadas: 0, mant: 0 });

    // Estado para el Modal de Control
    const [pcSeleccionada, setPcSeleccionada] = useState(null); // La PC que clickeaste

    // 2. FUNCIÓN PARA CARGAR DATOS
    const cargarDatos = async () => {
        try {
            const resEquipos = await fetch('http://localhost:3001/computadoras');
            const dataEquipos = await resEquipos.json();

            const resSalas = await fetch('http://localhost:3001/salas');
            const dataSalas = await resSalas.json();

            setEquipos(dataEquipos);
            setSalas(dataSalas);

            // Recalcular resumen
            setResumen({
                total: dataEquipos.length,
                disponibles: dataEquipos.filter(pc => pc.estado === 'disponible').length,
                ocupadas: dataEquipos.filter(pc => pc.estado === 'ocupado').length,
                mant: dataEquipos.filter(pc => pc.estado === 'mantenimiento').length
            });

        } catch (error) {
            console.error("Error cargando datos:", error);
        }
    };

    useEffect(() => {
        cargarDatos();
    }, []);

    // 3. FUNCIÓN PARA CAMBIAR ESTADO (LA MAGIA)
    const cambiarEstado = async (nuevoEstado) => {
        if (!pcSeleccionada) return;

        try {
            // Preparamos los datos a limpiar o actualizar
            const datosActualizados = {
                estado: nuevoEstado,
                cliente: nuevoEstado === 'ocupado' ? pcSeleccionada.cliente : "", // Si liberamos, borramos cliente
                hora_inicio: nuevoEstado === 'ocupado' ? pcSeleccionada.hora_inicio : "" // Si liberamos, borramos hora
            };

            await fetch(`http://localhost:3001/computadoras/${pcSeleccionada.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(datosActualizados)
            });

            // Recargamos la pantalla y cerramos modal
            await cargarDatos();
            setPcSeleccionada(null);

        } catch (error) {
            console.error("Error actualizando estado", error);
        }
    };

    // 4. IR A ALQUILAR (NUEVA SESIÓN)
    const irAlquiler = () => {
        navigate('/nueva-sesion', { state: { pcPreseleccionada: pcSeleccionada.id } });
    };

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 text-dark fw-bold">🔭 Panel de Control</h2>

            {/* --- RESUMEN (No cambia) --- */}
            <div className="row mb-5 g-3">
                <div className="col-md-3"><div className="card p-3 border-primary border-start border-4 shadow-sm"><div className="d-flex justify-content-between align-items-center"><div><p className="mb-0 text-muted small fw-bold uppercase">Total</p><h3 className="mb-0 fw-bold text-primary">{resumen.total}</h3></div><FaDesktop className="fs-1 text-primary opacity-25" /></div></div></div>
                <div className="col-md-3"><div className="card p-3 border-success border-start border-4 shadow-sm"><div className="d-flex justify-content-between align-items-center"><div><p className="mb-0 text-muted small fw-bold uppercase">Disponibles</p><h3 className="mb-0 fw-bold text-success">{resumen.disponibles}</h3></div><FaCheckCircle className="fs-1 text-success opacity-25" /></div></div></div>
                <div className="col-md-3"><div className="card p-3 border-danger border-start border-4 shadow-sm"><div className="d-flex justify-content-between align-items-center"><div><p className="mb-0 text-muted small fw-bold uppercase">Ocupadas</p><h3 className="mb-0 fw-bold text-danger">{resumen.ocupadas}</h3></div><FaGamepad className="fs-1 text-danger opacity-25" /></div></div></div>
                <div className="col-md-3"><div className="card p-3 border-warning border-start border-4 shadow-sm"><div className="d-flex justify-content-between align-items-center"><div><p className="mb-0 text-muted small fw-bold uppercase">Mantenimiento</p><h3 className="mb-0 fw-bold text-warning">{resumen.mant}</h3></div><FaExclamationCircle className="fs-1 text-warning opacity-25" /></div></div></div>
            </div>

            {/* --- LISTADO POR SALAS --- */}
            {salas.map(sala => {
                const pcsEnSala = equipos.filter(pc => pc.id_sala == sala.id);
                if (pcsEnSala.length === 0) return null;

                return (
                    <div key={sala.id} className="mb-4">
                        <div className="d-flex align-items-center mb-3">
                            <div className="bg-dark text-white p-2 rounded me-2"><FaDoorOpen /></div>
                            <h4 className="m-0 fw-bold text-dark">{sala.nombre}</h4>
                        </div>

                        <div className="row g-3">
                            {pcsEnSala.map(pc => (
                                <div key={pc.id} className="col-6 col-md-4 col-lg-3 col-xl-2">
                                    <div
                                        className="card text-center p-2 h-100 shadow-sm border-0 position-relative"
                                        style={{ cursor: 'pointer', transition: 'transform 0.2s', background: pc.estado === 'disponible' ? '#f8fff9' : '#fff' }}
                                        onClick={() => setPcSeleccionada(pc)} // <--- AL CLICK, ABRIMOS MODAL
                                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-3px)'}
                                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                                    >
                                        <div className={`position-absolute top-0 start-0 w-100 py-1 rounded-top ${pc.estado === 'disponible' ? 'bg-success' : pc.estado === 'ocupado' ? 'bg-danger' : 'bg-secondary'}`}></div>
                                        <div className="card-body pt-3 pb-1">
                                            <div className={`fs-1 mb-2 ${pc.estado === 'disponible' ? 'text-success' : pc.estado === 'ocupado' ? 'text-danger' : 'text-secondary'}`}>
                                                {pc.tipo === 'vip' ? <FaGamepad /> : <FaDesktop />}
                                            </div>
                                            <h6 className="fw-bold mb-1">PC {pc.id}</h6>
                                            <small className="text-muted d-block">{pc.cliente || pc.estado}</small>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <hr className="mt-4 opacity-25" />
                    </div>
                );
            })}

            {/* --- MODAL DE CONTROL (NUEVO) --- */}
            {pcSeleccionada && (
                <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content">
                            <div className={`modal-header text-white ${pcSeleccionada.estado === 'disponible' ? 'bg-success' :
                                pcSeleccionada.estado === 'ocupado' ? 'bg-danger' : 'bg-secondary'
                                }`}>
                                <h5 className="modal-title fw-bold">Gestión: {pcSeleccionada.nombre}</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setPcSeleccionada(null)}></button>
                            </div>

                            <div className="modal-body text-center p-4">
                                <h4 className="mb-3">Estado Actual: <strong>{pcSeleccionada.estado.toUpperCase()}</strong></h4>
                                {pcSeleccionada.estado === 'ocupado' && (
                                    <div className="alert alert-info">
                                        Cliente: <strong>{pcSeleccionada.cliente}</strong> <br />
                                        Hora Inicio: {pcSeleccionada.hora_inicio}
                                    </div>
                                )}

                                <div className="d-grid gap-2 col-8 mx-auto">
                                    {/* OPCIÓN 1: ALQUILAR (Solo si está disponible) */}
                                    {pcSeleccionada.estado === 'disponible' && (
                                        <button className="btn btn-success btn-lg shadow" onClick={irAlquiler}>
                                            <FaPlay className="me-2" /> Nueva Sesión (Alquilar)
                                        </button>
                                    )}

                                    {/* OPCIÓN 2: TERMINAR SESIÓN (Solo si está ocupado) */}
                                    {pcSeleccionada.estado === 'ocupado' && (
                                        <button className="btn btn-danger btn-lg shadow" onClick={() => cambiarEstado('disponible')}>
                                            <FaPowerOff className="me-2" /> Terminar Sesión (Liberar)
                                        </button>
                                    )}

                                    {/* OPCIÓN 3: MANTENIMIENTO (Si no está ocupada) */}
                                    {pcSeleccionada.estado !== 'ocupado' && pcSeleccionada.estado !== 'mantenimiento' && (
                                        <button className="btn btn-secondary shadow" onClick={() => cambiarEstado('mantenimiento')}>
                                            <FaTools className="me-2" /> Poner en Mantenimiento
                                        </button>
                                    )}

                                    {/* OPCIÓN 4: HABILITAR (Si está en mantenimiento) */}
                                    {pcSeleccionada.estado === 'mantenimiento' && (
                                        <button className="btn btn-success shadow" onClick={() => cambiarEstado('disponible')}>
                                            <FaCheckCircle className="me-2" /> Habilitar PC (Disponible)
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="modal-footer">
                                <button type="button" className="btn btn-light border" onClick={() => setPcSeleccionada(null)}>Cerrar</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default PageDashboard;