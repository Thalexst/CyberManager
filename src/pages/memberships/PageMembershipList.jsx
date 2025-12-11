import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '../../services/api';
import { MembresiaModel } from '../../types/InitialStates';
import { useFetch } from '../../hooks/useFetch';
import { FaEdit, FaTrash, FaSave, FaIdCard } from 'react-icons/fa';

function PageMembershipList() {
    const { data: membresias, reload: reloadMembresias } = useFetch('membresias');
    const [formMembresia, setFormMembresia] = useState(MembresiaModel);
    const [editingId, setEditingId] = useState(null);

    const guardarMembresia = async (e) => {
        e.preventDefault();
        const payload = {
            ...formMembresia,
            descuento: Number(formMembresia.descuento),
            horas_requeridas: Number(formMembresia.horas_requeridas)
        };

        if (editingId) {
            await updateItem('membresias', editingId, payload);
            alert('Membresía actualizada');
            setEditingId(null);
        } else {
            await createItem('membresias', payload);
            alert('Membresía creada');
        }

        setFormMembresia(MembresiaModel);
        reloadMembresias();
    };

    const eliminar = async (id) => {
        if (confirm("¿Eliminar este nivel? Los usuarios con este nivel podrían quedar sin rango.")) {
            await deleteItem('membresias', id);
            reloadMembresias();
        }
    };

    const membresiasOrdenadas = membresias ? [...membresias].sort((a, b) => (a.horas_requeridas || 0) - (b.horas_requeridas || 0)) : [];

    return (
        <div className="container mt-4">
            <h2 className="text-white mb-4">💳 Niveles y Membresías</h2>

            {/* FORMULARIO */}
            <div className={`card p-4 mb-4 border-secondary text-white ${editingId ? 'bg-primary bg-opacity-10' : 'bg-dark'}`} style={{ maxWidth: '800px' }}>
                <div className="d-flex justify-content-between mb-2">
                    <h5 className="m-0">{editingId ? '✏️ Editar Nivel' : '➕ Crear Nuevo Nivel'}</h5>
                    {editingId && <button className="btn btn-sm btn-light" onClick={() => { setEditingId(null); setFormMembresia(MembresiaModel) }}>Cancelar</button>}
                </div>

                <form onSubmit={guardarMembresia} className="row g-2 align-items-end">
                    <div className="col-md-5">
                        <label className="small text-muted">Nombre del Rango</label>
                        <input className="form-control" placeholder="Ej. Veterano" value={formMembresia.nombre} onChange={e => setFormMembresia({ ...formMembresia, nombre: e.target.value })} required />
                    </div>
                    <div className="col-md-2">
                        <label className="small text-muted">% Desc.</label>
                        <input type="number" className="form-control" value={formMembresia.descuento} onChange={e => setFormMembresia({ ...formMembresia, descuento: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                        <label className="small text-muted">Horas Requeridas</label>
                        <input type="number" className="form-control" value={formMembresia.horas_requeridas} onChange={e => setFormMembresia({ ...formMembresia, horas_requeridas: e.target.value })} required />
                    </div>
                    <div className="col-md-2">
                        <button className={`btn w-100 ${editingId ? 'btn-primary' : 'btn-warning'}`}>
                            {editingId ? <FaSave /> : 'Crear'}
                        </button>
                    </div>
                </form>
            </div>

            {/* LISTA */}
            <ul className="list-group">
                {membresiasOrdenadas.map(m => (
                    <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-secondary mb-2 rounded">
                        <div className="d-flex align-items-center gap-3">
                            <div className="fs-2 text-warning"><FaIdCard /></div>
                            <div>
                                <span className="fw-bold fs-5 text-white">{m.nombre}</span>
                                <div className="d-flex gap-3 small">
                                    <span className="text-info">Requisito: {m.horas_requeridas} hrs</span>
                                    <span className="text-success">Descuento: {m.descuento}%</span>
                                </div>
                            </div>
                        </div>
                        <div>
                            <button onClick={() => { setFormMembresia(m); setEditingId(m.id); window.scrollTo(0, 0) }} className="btn btn-outline-light btn-sm me-2"><FaEdit /></button>
                            <button onClick={() => eliminar(m.id)} className="btn btn-outline-danger btn-sm"><FaTrash /></button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default PageMembershipList;