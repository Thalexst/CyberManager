import { useState } from 'react';
import { createItem } from '../../services/api';
import { MembresiaModel } from '../../types/InitialStates';
// IMPORTAMOS EL HOOK
import { useFetch } from '../../hooks/useFetch';

function PageMembershipList() {
    // 1. Usamos el Hook
    const { data: membresias, reload: reloadMembresias } = useFetch('membresias');
    const [formMembresia, setFormMembresia] = useState(MembresiaModel);

    const guardarMembresia = async (e) => {
        e.preventDefault();

        const payload = {
            ...formMembresia,
            descuento: Number(formMembresia.descuento),
            horas_requeridas: Number(formMembresia.horas_requeridas)
        };

        await createItem('membresias', payload);
        alert('Membresía creada correctamente');

        setFormMembresia(MembresiaModel);
        reloadMembresias(); // Recargar
    };

    // Ordenamos visualmente (opcional, pero recomendado)
    const membresiasOrdenadas = [...membresias].sort((a, b) => (a.horas_requeridas || 0) - (b.horas_requeridas || 0));

    return (
        <div className="container mt-4">
            <h2 className="mb-4">💳 Gestión de Membresías</h2>

            <div className="card p-4 mb-4 bg-dark text-white border-secondary" style={{ maxWidth: '800px' }}>
                <h4>Crear Nivel / Rango</h4>
                <p className="text-muted small">Define las horas necesarias para subir de nivel.</p>

                <form onSubmit={guardarMembresia} className="row g-2 align-items-end">
                    <div className="col-md-5">
                        <input className="form-control" placeholder="Nombre (Ej. Veterano)" value={formMembresia.nombre} onChange={e => setFormMembresia({ ...formMembresia, nombre: e.target.value })} required />
                    </div>
                    <div className="col-md-2">
                        <input type="number" className="form-control" placeholder="% Desc" value={formMembresia.descuento} onChange={e => setFormMembresia({ ...formMembresia, descuento: e.target.value })} />
                    </div>
                    <div className="col-md-3">
                        <input type="number" className="form-control" placeholder="Horas Req." value={formMembresia.horas_requeridas} onChange={e => setFormMembresia({ ...formMembresia, horas_requeridas: e.target.value })} required />
                    </div>
                    <div className="col-md-2">
                        <button className="btn btn-warning w-100">Crear</button>
                    </div>
                </form>
            </div>

            <ul className="list-group">
                {membresiasOrdenadas.map(m => (
                    <li key={m.id} className="list-group-item d-flex justify-content-between align-items-center bg-dark text-white border-secondary">
                        <div>
                            <span className="fw-bold fs-5 text-warning">{m.nombre}</span>
                            <br />
                            <small className="text-muted">Desbloqueo: <span className="text-info">{m.horas_requeridas || 0} horas</span></small>
                        </div>
                        <span className="badge bg-primary rounded-pill">Desc: {m.descuento}%</span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
export default PageMembershipList;