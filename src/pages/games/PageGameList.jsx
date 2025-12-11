import { useState } from 'react';
import { createItem, updateItem, deleteItem } from '../../services/api';
import { JuegoModel } from '../../types/InitialStates';
import { useFetch } from '../../hooks/useFetch';
import { FaEdit, FaTrash, FaGamepad, FaSave } from 'react-icons/fa';

function PageGameList() {
    const { data: juegos, reload: reloadJuegos } = useFetch('juegos');
    const [form, setForm] = useState(JuegoModel);
    const [editingId, setEditingId] = useState(null);

    const guardar = async (e) => {
        e.preventDefault();
        if (editingId) {
            await updateItem('juegos', editingId, form);
            alert("Juego actualizado");
            setEditingId(null);
        } else {
            await createItem('juegos', form);
            alert("Juego agregado");
        }
        setForm(JuegoModel);
        reloadJuegos();
    };

    const eliminar = async (id) => {
        if (confirm("¿Eliminar este juego del catálogo?")) {
            await deleteItem('juegos', id);
            reloadJuegos();
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-white mb-4">🎮 Catálogo de Juegos</h2>

            {/* FORMULARIO */}
            <div className={`card p-3 mb-4 text-white border-secondary ${editingId ? 'bg-primary bg-opacity-10 border-primary' : 'bg-dark'}`}>
                <div className="d-flex justify-content-between mb-2">
                    <h5 className="m-0">{editingId ? '✏️ Editar Juego' : '➕ Nuevo Juego'}</h5>
                    {editingId && <button className="btn btn-sm btn-secondary" onClick={() => { setEditingId(null); setForm(JuegoModel) }}>Cancelar</button>}
                </div>
                <form onSubmit={guardar} className="d-flex gap-2">
                    <input className="form-control" placeholder="Título (ej. Valorant)" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required />
                    <select className="form-select" value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })} required>
                        <option value="">Género</option>
                        <option value="FPS">FPS</option>
                        <option value="MOBA">MOBA</option>
                        <option value="RPG">RPG</option>
                        <option value="Sports">Deportes</option>
                        <option value="Sandbox">Sandbox</option>
                    </select>
                    <button className={`btn px-4 fw-bold ${editingId ? 'btn-primary' : 'btn-success'}`}>
                        {editingId ? <FaSave /> : 'Guardar'}
                    </button>
                </form>
            </div>

            {/* LISTA */}
            <div className="row">
                <div className="col-12">
                    <ul className="list-group">
                        {juegos && juegos.map(j => (
                            <li key={j.id} className="list-group-item bg-dark text-white border-secondary d-flex justify-content-between align-items-center mb-2 rounded">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="fs-3 text-secondary"><FaGamepad /></div>
                                    <div>
                                        <h5 className="m-0 fw-bold">{j.titulo}</h5>
                                        <span className="badge bg-info text-dark">{j.genero}</span>
                                    </div>
                                </div>
                                <div>
                                    <button onClick={() => { setForm(j); setEditingId(j.id); window.scrollTo(0, 0) }} className="btn btn-outline-warning btn-sm me-2"><FaEdit /></button>
                                    <button onClick={() => eliminar(j.id)} className="btn btn-outline-danger btn-sm"><FaTrash /></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
export default PageGameList;