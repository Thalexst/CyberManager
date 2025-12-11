import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '../../services/api';
import { ComputadoraModel } from '../../types/InitialStates';
import { useFetch } from '../../hooks/useFetch';
import { FaLaptop, FaGamepad, FaHeadset, FaDesktop, FaTrash, FaEdit, FaSave } from 'react-icons/fa';

function PageEquipmentList() {
    const { data: pcs, reload: reloadPcs } = useFetch('computadoras');
    const { data: salas } = useFetch('salas');

    const [formPC, setFormPC] = useState(ComputadoraModel);
    const [editingId, setEditingId] = useState(null);

    const guardarPC = async (e) => {
        e.preventDefault();
        if (!formPC.id_sala) return alert("Selecciona una sala");

        if (editingId) {
            await updateItem('computadoras', editingId, formPC);
            alert('PC Actualizada');
            setEditingId(null);
        } else {
            await createItem('computadoras', formPC);
            alert('PC Agregada');
        }

        setFormPC(ComputadoraModel);
        reloadPcs();
    };

    const cargarEdicion = (pc) => {
        setFormPC(pc);
        setEditingId(pc.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarPC = async (id) => {
        if (confirm("¿Eliminar esta PC del inventario?")) {
            await deleteItem('computadoras', id);
            reloadPcs();
        }
    };

    const getSalaIcon = (nombreSala) => {
        const nombre = nombreSala.toLowerCase();
        if (nombre.includes('arena') || nombre.includes('vip')) return <FaGamepad className="text-warning" />;
        if (nombre.includes('stream') || nombre.includes('privada')) return <FaHeadset className="text-info" />;
        return <FaDesktop className="text-light" />;
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-white">🕹️ Inventario de Equipos</h2>

            {/* FORMULARIO */}
            <div className={`card p-4 mb-5 border-secondary shadow ${editingId ? 'bg-primary bg-opacity-10' : 'bg-dark text-white'}`}>
                <div className="d-flex justify-content-between mb-3">
                    <h5 className="text-primary"><FaLaptop /> {editingId ? 'Editar Equipo' : 'Registrar Nueva Máquina'}</h5>
                    {editingId && <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(null); setFormPC(ComputadoraModel); }}>Cancelar</button>}
                </div>

                <form onSubmit={guardarPC} className="row g-3">
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Nombre (Ej. PC-05)" value={formPC.nombre} onChange={e => setFormPC({ ...formPC, nombre: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                        <input className="form-control" placeholder="Specs (Ej. RTX 3060)" value={formPC.specs} onChange={e => setFormPC({ ...formPC, specs: e.target.value })} required />
                    </div>
                    <div className="col-md-4">
                        <select className="form-select" value={formPC.id_sala} onChange={e => setFormPC({ ...formPC, id_sala: e.target.value })} required>
                            <option value="">-- Seleccionar Sala --</option>
                            {salas && salas.map(s => (
                                <option key={s.id} value={s.id}>{s.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-12 text-end">
                        <button className={`btn px-4 fw-bold ${editingId ? 'btn-primary' : 'btn-success'}`}>
                            {editingId ? <><FaSave /> Actualizar</> : 'Guardar Equipo'}
                        </button>
                    </div>
                </form>
            </div>

            {/* LISTADO POR SALAS */}
            <div className="d-flex flex-column gap-5">
                {salas && salas.map(sala => {
                    const pcsEnSala = pcs ? pcs.filter(pc => String(pc.id_sala) === String(sala.id)) : [];
                    return (
                        <div key={sala.id} className="animate__animated animate__fadeIn">
                            <div className="d-flex align-items-center mb-3 border-bottom border-secondary pb-2">
                                <h3 className="text-white m-0 me-3">{getSalaIcon(sala.nombre)} {sala.nombre}</h3>
                                <span className="badge bg-dark border border-secondary ms-auto">{pcsEnSala.length} Equipos</span>
                            </div>

                            <div className="row g-3">
                                {pcsEnSala.map(pc => (
                                    <div className="col-md-6 col-lg-4 col-xl-3" key={pc.id}>
                                        <div className={`card h-100 bg-dark text-white border-secondary shadow-sm position-relative`}>
                                            {/* Botones de Acción */}
                                            <div className="position-absolute top-0 end-0 p-2 d-flex gap-2">
                                                <button onClick={() => cargarEdicion(pc)} className="btn btn-sm btn-dark text-warning border-0 p-1"><FaEdit /></button>
                                                <button onClick={() => eliminarPC(pc.id)} className="btn btn-sm btn-dark text-danger border-0 p-1"><FaTrash /></button>
                                            </div>

                                            <div className="card-body mt-2">
                                                <h4 className="card-title fw-bold mb-1">{pc.nombre}</h4>
                                                <small className="text-muted d-block mb-3">{pc.specs}</small>
                                                <span className={`badge ${pc.estado === 'Disponible' ? 'bg-success' : 'bg-danger'} text-dark w-100`}>
                                                    {pc.estado}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default PageEquipmentList;