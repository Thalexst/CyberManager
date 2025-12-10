import { useState } from 'react';
import { createItem } from '../../services/api';
import { JuegoModel } from '../../types/InitialStates';
import { useFetch } from '../../hooks/useFetch';

function PageGameList() {
    const { data: juegos, reload: reloadJuegos } = useFetch('juegos');
    const [form, setForm] = useState(JuegoModel);

    const guardar = async (e) => {
        e.preventDefault();
        await createItem('juegos', form);
        alert("Juego agregado");
        setForm(JuegoModel);
        reloadJuegos();
    };

    return (
        <div className="container mt-4">
            <h2>🎮 Catálogo de Juegos</h2>
            <div className="card p-3 mb-3 bg-dark text-white border-secondary">
                <form onSubmit={guardar} className="d-flex gap-2">
                    <input className="form-control" placeholder="Título (ej. Valorant)" value={form.titulo} onChange={e => setForm({ ...form, titulo: e.target.value })} required />
                    <select className="form-select" value={form.genero} onChange={e => setForm({ ...form, genero: e.target.value })} required>
                        <option value="">Género</option>
                        <option value="FPS">Shooter (FPS)</option>
                        <option value="MOBA">MOBA</option>
                        <option value="RPG">RPG</option>
                        <option value="Sports">Deportes</option>
                    </select>
                    <button className="btn btn-primary">Guardar</button>
                </form>
            </div>
            <ul className="list-group">
                {juegos.map(j => (
                    <li key={j.id} className="list-group-item bg-dark text-white d-flex justify-content-between border-secondary">
                        <span>{j.titulo}</span>
                        <span className="badge bg-info text-dark">{j.genero}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default PageGameList;