import { useState } from 'react';
import { FaLaptop, FaGamepad, FaHeadset, FaMicrochip, FaDesktop, FaTrash } from 'react-icons/fa';
import { createItem, updateItem } from '../../services/api'; // Asegúrate de tener updateItem si quieres editar luego
import { ComputadoraModel } from '../../types/InitialStates';
import { useFetch } from '../../hooks/useFetch';

function PageEquipmentList() {
    const { data: pcs, reload: reloadPcs } = useFetch('computadoras');
    const { data: salas } = useFetch('salas');

    const [formPC, setFormPC] = useState(ComputadoraModel);

    const guardarPC = async (e) => {
        e.preventDefault();
        if (!formPC.id_sala) return alert("Selecciona una sala");

        await createItem('computadoras', formPC);
        alert('PC Agregada con éxito');

        setFormPC(ComputadoraModel);
        reloadPcs();
    };

    // Función para dar un icono según el nombre de la sala
    const getSalaIcon = (nombreSala) => {
        const nombre = nombreSala.toLowerCase();
        if (nombre.includes('arena') || nombre.includes('vip')) return <FaGamepad className="text-warning" />;
        if (nombre.includes('stream') || nombre.includes('privada')) return <FaHeadset className="text-info" />;
        return <FaDesktop className="text-light" />;
    };

    // Función para obtener el color del borde según estado
    const getStatusColor = (estado) => {
        if (estado === 'Disponible') return 'border-success';
        if (estado === 'Ocupada') return 'border-danger';
        return 'border-warning';
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-white">🕹️ Inventario de Equipos</h2>

            {/* --- FORMULARIO DE REGISTRO (ARRIBA) --- */}
            <div className="card p-4 mb-5 bg-dark text-white border-secondary shadow">
                <h5 className="mb-3 text-primary"><FaLaptop /> Registrar Nueva Máquina</h5>
                <form onSubmit={guardarPC} className="row g-3">
                    <div className="col-md-4">
                        <label className="form-label small text-muted">Nombre del Equipo</label>
                        <input className="form-control bg-secondary text-white border-0" placeholder="Ej. PC-05" value={formPC.nombre} onChange={e => setFormPC({ ...formPC, nombre: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small text-muted">Especificaciones (Specs)</label>
                        <input className="form-control bg-secondary text-white border-0" placeholder="Ej. RTX 3060, i5" value={formPC.specs} onChange={e => setFormPC({ ...formPC, specs: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                        <label className="form-label small text-muted">Ubicación (Sala)</label>
                        <select className="form-select bg-secondary text-white border-0" value={formPC.id_sala} onChange={e => setFormPC({ ...formPC, id_sala: e.target.value })} required>
                            <option value="">-- Seleccionar Sala --</option>
                            {salas && salas.map(s => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 text-end">
                        <button className="btn btn-success px-4 fw-bold">Guardar Equipo</button>
                    </div>
                </form>
            </div>

            {/* --- VISTA VISUAL POR SALAS (ABAJO) --- */}
            <div className="d-flex flex-column gap-5">
                {salas && salas.map(sala => {
                    // Filtramos las PCs que pertenecen a esta sala
                    const pcsEnSala = pcs ? pcs.filter(pc => String(pc.id_sala) === String(sala.id)) : [];

                    return (
                        <div key={sala.id} className="animate__animated animate__fadeIn">
                            {/* Título de la Sala con línea divisoria */}
                            <div className="d-flex align-items-center mb-3">
                                <h3 className="text-white m-0 me-3">{getSalaIcon(sala.nombre)} {sala.nombre}</h3>
                                <div className="flex-grow-1 bg-secondary" style={{ height: '1px' }}></div>
                                <span className="badge bg-dark border border-secondary ms-3">{pcsEnSala.length} Equipos</span>
                            </div>

                            {/* Grid de Tarjetas */}
                            {pcsEnSala.length > 0 ? (
                                <div className="row g-3">
                                    {pcsEnSala.map(pc => (
                                        <div className="col-md-6 col-lg-4 col-xl-3" key={pc.id}>
                                            <div className={`card h-100 bg-dark text-white border ${getStatusColor(pc.estado)} shadow-sm position-relative`}>
                                                {/* Luz de estado (punto brillante) */}
                                                <div style={{
                                                    position: 'absolute', top: '10px', right: '10px',
                                                    width: '12px', height: '12px', borderRadius: '50%',
                                                    backgroundColor: pc.estado === 'Disponible' ? '#0f0' : '#f00',
                                                    boxShadow: `0 0 10px ${pc.estado === 'Disponible' ? '#0f0' : '#f00'}`
                                                }}></div>

                                                <div className="card-body">
                                                    <h4 className="card-title fw-bold mb-3">{pc.nombre}</h4>

                                                    <div className="d-flex align-items-center gap-2 text-muted mb-2">
                                                        <FaMicrochip />
                                                        <small>{pc.specs}</small>
                                                    </div>

                                                    <div className="mt-3 d-flex justify-content-between align-items-end">
                                                        <span className={`badge ${pc.estado === 'Disponible' ? 'bg-success' : 'bg-danger text-wrap'}`}>
                                                            {pc.estado}
                                                        </span>
                                                        <button className="btn btn-sm btn-outline-danger border-0" title="Eliminar (Simulado)">
                                                            <FaTrash />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="alert alert-dark text-center text-muted border-secondary">
                                    Esta sala aún no tiene equipos instalados.
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PageEquipmentList;