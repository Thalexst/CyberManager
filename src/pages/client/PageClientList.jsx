import { useState } from 'react';
import { createItem, updateItem } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';

// 1. ¡ESTA ES LA LÍNEA QUE FALTABA! Importar el Modelo
import { ClienteModel } from '../../types/InitialStates';

function PageClientList() {
    const { data: clientes, reload: reloadClientes } = useFetch('clientes');
    const { data: membresias } = useFetch('membresias');
    const { data: sesiones } = useFetch('sesiones');

    // Usar el modelo importado
    const [formCliente, setFormCliente] = useState(ClienteModel);

    const guardarCliente = async (e) => {
        e.preventDefault();

        const membresiaBase = membresias ? membresias.find(m => (parseInt(m.horas_requeridas) || 0) === 0) : null;
        const idBase = membresiaBase ? membresiaBase.id : (membresias?.[0]?.id || "1");

        await createItem('clientes', { ...formCliente, id_membresia: idBase });

        alert('Cliente registrado.');
        setFormCliente(ClienteModel);
        reloadClientes();
    };

    const recalcularNiveles = async () => {
        if (!membresias || !sesiones) return;
        if (!confirm("¿Deseas recalcular el nivel de todos los clientes?")) return;

        let actualizados = 0;
        const membresiasOrdenadas = [...membresias].sort((a, b) => (parseInt(b.horas_requeridas) || 0) - (parseInt(a.horas_requeridas) || 0));

        for (const cliente of clientes) {
            const misSesiones = sesiones.filter(s => String(s.id_cliente) === String(cliente.id));
            const horasTotales = misSesiones.reduce((total, s) => total + (parseInt(s.horas) || 0), 0);
            const nuevaMembresia = membresiasOrdenadas.find(m => horasTotales >= (parseInt(m.horas_requeridas) || 0));

            if (nuevaMembresia && String(nuevaMembresia.id) !== String(cliente.id_membresia)) {
                await updateItem('clientes', cliente.id, { ...cliente, id_membresia: nuevaMembresia.id });
                actualizados++;
            }
        }
        alert(`Proceso terminado. Se actualizaron ${actualizados} clientes.`);
        reloadClientes();
    };

    // Helpers
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
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>👥 Base de Datos de Clientes</h2>
                <button onClick={recalcularNiveles} className="btn btn-warning fw-bold shadow">
                    🔄 Recalcular Rangos
                </button>
            </div>

            <div className="card p-4 mb-4 bg-dark text-white border-secondary">
                <h4>Registrar Nuevo Cliente</h4>
                <p className="text-muted small">Los nuevos clientes comienzan automáticamente con la membresía básica.</p>

                <form onSubmit={guardarCliente} className="row g-3">
                    <div className="col-md-6">
                        <input className="form-control bg-secondary text-white border-0" placeholder="Nombre" value={formCliente.nombre} onChange={e => setFormCliente({ ...formCliente, nombre: e.target.value })} required />
                    </div>
                    <div className="col-md-6">
                        <input className="form-control bg-secondary text-white border-0" placeholder="Nickname" value={formCliente.nickname} onChange={e => setFormCliente({ ...formCliente, nickname: e.target.value })} required />
                    </div>
                    <div className="col-12">
                        <button className="btn btn-success w-100">Registrar Cliente</button>
                    </div>
                </form>
            </div>

            <div className="table-responsive">
                <table className="table table-dark table-hover table-bordered border-secondary align-middle">
                    <thead className="table-active">
                        <tr>
                            <th>Nickname</th>
                            <th>Nombre Real</th>
                            <th>Rango Actual</th>
                            <th className="text-center">Horas Jugadas</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clientes && clientes.map(c => {
                            const nombreMemb = getNombreMembresia(c.id_membresia);
                            return (
                                <tr key={c.id}>
                                    <td className="fw-bold text-info">{c.nickname}</td>
                                    <td>{c.nombre}</td>
                                    <td><span className={`badge ${getBadgeColor(nombreMemb)} px-3 py-2 rounded-pill`}>{nombreMemb}</span></td>
                                    <td className="text-center fw-bold fs-5">{getHorasTotales(c.id)}</td>
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