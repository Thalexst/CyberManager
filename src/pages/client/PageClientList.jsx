import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '../../services/api';
import { ClienteModel } from '../../types/InitialStates';
import { useFetch } from '../../hooks/useFetch';
import { FaEdit, FaTrash, FaSave, FaUserPlus, FaSync } from 'react-icons/fa';

function PageClientList() {
    const { data: clientes, reload: reloadClientes } = useFetch('clientes');
    const { data: membresias } = useFetch('membresias');
    const { data: sesiones } = useFetch('sesiones');

    const [formCliente, setFormCliente] = useState(ClienteModel);
    const [editingId, setEditingId] = useState(null);

    const guardarCliente = async (e) => {
        e.preventDefault();

        if (editingId) {
            // MODO EDICIÓN
            await updateItem('clientes', editingId, formCliente);
            alert('Cliente actualizado correctamente');
            setEditingId(null);
        } else {
            // MODO CREACIÓN
            const membresiaBase = membresias ? membresias.find(m => (parseInt(m.horas_requeridas) || 0) === 0) : null;
            const idBase = membresiaBase ? membresiaBase.id : (membresias?.[0]?.id || "1");
            await createItem('clientes', { ...formCliente, id_membresia: idBase });
            alert('Cliente registrado');
        }

        setFormCliente(ClienteModel);
        reloadClientes();
    };

    const cargarEdicion = (cliente) => {
        setFormCliente(cliente);
        setEditingId(cliente.id);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const eliminarCliente = async (id) => {
        if (confirm('¿Estás seguro de eliminar este cliente? Se perderá su historial.')) {
            await deleteItem('clientes', id);
            reloadClientes();
        }
    };

    const cancelarEdicion = () => {
        setEditingId(null);
        setFormCliente(ClienteModel);
    };

    // Helpers Visuales
    const getHorasTotales = (idCliente) => {
        if (!sesiones) return 0;
        return sesiones
            .filter(s => String(s.id_cliente) === String(idCliente))
            .reduce((total, s) => total + (parseInt(s.horas) || 0), 0);
    };

    const getNombreMembresia = (idMembresia) => {
        if (!membresias) return 'Cargando...';
        const m = membresias.find(x => String(x.id) === String(idMembresia));
        return m ? m.nombre : '-';
    };

    const getBadgeColor = (nombreMembresia) => {
        if (!nombreMembresia) return 'bg-secondary';
        const nombre = nombreMembresia.toLowerCase();
        if (nombre.includes('oro') || nombre.includes('leyenda')) return 'bg-warning text-dark';
        if (nombre.includes('plata') || nombre.includes('veterano')) return 'bg-info text-dark';
        return 'bg-secondary';
    };

    return (
        <div className="container mt-4">
            <h2 className="mb-4 text-white">👥 Gestión de Clientes</h2>

            {/* FORMULARIO */}
            <div className={`card p-4 mb-4 border-secondary ${editingId ? 'bg-primary bg-opacity-10 border-primary' : 'bg-dark text-white'}`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="m-0">{editingId ? '✏️ Editando Cliente' : '➕ Registrar Nuevo Cliente'}</h4>
                    {editingId && <button className="btn btn-sm btn-secondary" onClick={cancelarEdicion}>Cancelar</button>}
                </div>

                <form onSubmit={guardarCliente} className="row g-3">
                    <div className="col-md-6">
                        <label className="text-muted small">Nombre Real</label>
                        <input className="form-control" placeholder="Ej. Juan Perez" value={formCliente.nombre} onChange={e => setFormCliente({ ...formCliente, nombre: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                        <label className="text-muted small">Nickname (Apodo)</label>
                        <input className="form-control" placeholder="Ej. Slayer99" value={formCliente.nickname} onChange={e => setFormCliente({ ...formCliente, nickname: e.target.value })} required />
                    </div>
                    <div className="col-12">
                        <button className={`btn w-100 fw-bold ${editingId ? 'btn-primary' : 'btn-success'}`}>
                            {editingId ? <><FaSave /> Guardar Cambios</> : <><FaUserPlus /> Registrar Cliente</>}
                        </button>
                    </div>
                </form>
            </div>

            {/* TABLA */}
            <div className="table-responsive">
                <table className="table table-dark table-hover table-bordered align-middle border-secondary">
                    <thead className="table-active">
                        <tr>
                            <th>Nickname</th>
                            <th>Nombre</th>
                            <th>Rango</th>
                            <th className="text-center">Horas</th>
                            <th className="text-end">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes && clientes.map(c => {
                            const nombreMemb = getNombreMembresia(c.id_membresia);
                            return (
                                <tr key={c.id}>
                                    <td className="fw-bold text-info">{c.nickname}</td>
                                    <td>{c.nombre}</td>
                                    <td><span className={`badge ${getBadgeColor(nombreMemb)}`}>{nombreMemb}</span></td>
                                    <td className="text-center fw-bold">{getHorasTotales(c.id)}</td>
                                    <td className="text-end">
                                        <button onClick={() => cargarEdicion(c)} className="btn btn-sm btn-outline-warning me-2" title="Editar">
                                            <FaEdit />
                                        </button>
                                        <button onClick={() => eliminarCliente(c.id)} className="btn btn-sm btn-outline-danger" title="Eliminar">
                                            <FaTrash />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default PageClientList;