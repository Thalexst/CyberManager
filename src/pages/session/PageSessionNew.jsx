import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// 1. IMPORTAR API Y HOOKS (Subiendo 2 niveles ../../)
import api, { createItem, updateItem } from '../../services/api';
import { useFetch } from '../../hooks/useFetch';

// 2. ¡ESTA ES LA LÍNEA QUE FALTABA! Importar el Modelo
import { SesionModel } from '../../types/InitialStates';

function PageSessionNew() {
    // Cargar listas necesarias
    const { data: clientes } = useFetch('clientes');
    const { data: pcs } = useFetch('computadoras');
    const { data: membresias } = useFetch('membresias');
    const { data: sesiones } = useFetch('sesiones');

    // Usar el modelo importado
    const [form, setForm] = useState(SesionModel);

    const navigate = useNavigate();

    const guardarSesion = async (e) => {
        e.preventDefault();

        // 1. Guardar Sesión
        await createItem('sesiones', {
            ...form,
            hora_inicio: new Date().toLocaleTimeString(),
            total: form.horas * 5
        });

        // 2. Actualizar PC a Ocupada
        if (pcs) {
            const pcOriginal = pcs.find(p => String(p.id) === String(form.id_computadora));
            if (pcOriginal) {
                await updateItem('computadoras', form.id_computadora, { ...pcOriginal, estado: 'Ocupada' });
            }
        }

        // 3. Verificar Ascenso
        await verificarAscensoCliente(form.id_cliente);

        alert('¡Sesión iniciada correctamente!');
        navigate('/dashboard');
    };

    const verificarAscensoCliente = async (idCliente) => {
        try {
            const resCliente = await api.get(`/clientes/${idCliente}`);
            const clienteActual = resCliente.data;

            // Nota: Usamos una petición fresca de sesiones para asegurar el cálculo
            const resSesiones = await api.get('/sesiones');
            const todasSesiones = resSesiones.data;

            const misSesiones = todasSesiones.filter(s => String(s.id_cliente) === String(idCliente));
            const horasTotales = misSesiones.reduce((total, s) => total + parseInt(s.horas), 0);

            const membresiasOrdenadas = [...membresias].sort((a, b) => (b.horas_requeridas || 0) - (a.horas_requeridas || 0));
            const nuevaMembresia = membresiasOrdenadas.find(m => horasTotales >= (m.horas_requeridas || 0));

            if (nuevaMembresia && String(nuevaMembresia.id) !== String(clienteActual.id_membresia)) {
                await updateItem('clientes', idCliente, { ...clienteActual, id_membresia: nuevaMembresia.id });
                alert(`🎉 ¡FELICIDADES! El cliente ha subido al rango: ${nuevaMembresia.nombre}`);
            }
        } catch (error) {
            console.error("Error verificando ascenso:", error);
        }
    };

    return (
        <div className="container mt-4">
            <div className="card p-4 mx-auto bg-dark text-white border-secondary" style={{ maxWidth: '600px' }}>
                <h2 className="mb-4 text-center">🎮 Nueva Sesión (Alquiler)</h2>

                <form onSubmit={guardarSesion}>
                    <div className="mb-3">
                        <label className="form-label">Seleccionar Cliente:</label>
                        <select className="form-select" required onChange={e => setForm({ ...form, id_cliente: e.target.value })}>
                            <option value="">-- Buscar Cliente --</option>
                            {clientes && clientes.map(c => (
                                <option key={c.id} value={c.id}>{c.nickname} ({c.nombre})</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Seleccionar PC Disponible:</label>
                        <select className="form-select" required onChange={e => setForm({ ...form, id_computadora: e.target.value })}>
                            <option value="">-- Buscar PC --</option>
                            {pcs && pcs.filter(pc => pc.estado === 'Disponible').map(pc => (
                                <option key={pc.id} value={pc.id}>{pc.nombre} - {pc.specs}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Horas a jugar:</label>
                        <input type="number" className="form-control" min="1" value={form.horas} onChange={e => setForm({ ...form, horas: e.target.value })} />
                    </div>

                    <button className="btn btn-success w-100 py-2 fw-bold">🚀 Iniciar Tiempo</button>
                </form>
            </div>
        </div>
    );
}

export default PageSessionNew;