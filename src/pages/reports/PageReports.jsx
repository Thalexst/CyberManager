import { useEffect, useState } from 'react';
import { FaChartLine, FaDollarSign, FaUserClock, FaCalendarAlt } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PageReports = () => {
    const [sesiones, setSesiones] = useState([]);
    const [stats, setStats] = useState({
        ingresosTotales: 0,
        sesionesTotales: 0,
        ingresosHoy: 0
    });

    // 1. CARGAR DATOS
    useEffect(() => {
        fetch('http://localhost:3001/sesiones')
            .then(res => res.json())
            .then(data => {
                setSesiones(data);
                calcularEstadisticas(data);
            })
            .catch(err => console.error("Error cargando reportes:", err));
    }, []);

    // 2. CALCULAR (Usando campo 'total')
    const calcularEstadisticas = (data) => {
        // Sumamos el campo 'total'
        const totalDinero = data.reduce((acc, curr) => acc + (curr.total || 0), 0);

        const fechaHoy = new Date().toISOString().split('T')[0];
        const dineroHoy = data
            .filter(s => s.fecha === fechaHoy)
            .reduce((acc, curr) => acc + (curr.total || 0), 0);

        setStats({
            ingresosTotales: totalDinero,
            sesionesTotales: data.length,
            ingresosHoy: dineroHoy
        });
    };

    // 3. DATOS PARA GRÁFICO (Últimos 5)
    const datosGrafico = sesiones.slice(-5).map(s => ({
        // Usamos cliente_nombre si existe, sino un genérico
        name: s.cliente_nombre || `Cliente ${s.id_cliente}`,
        Monto: s.total
    }));

    return (
        <div className="container-fluid p-4">
            <h2 className="mb-4 text-white fw-bold">📊 Reportes y Ganancias</h2>

            {/* TARJETAS */}
            <div className="row g-4 mb-5">
                <div className="col-md-4">
                    <div className="card bg-success text-white p-4 shadow h-100">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="opacity-75">INGRESOS TOTALES</h6>
                                <h1 className="fw-bold mb-0">${stats.ingresosTotales.toFixed(2)}</h1>
                            </div>
                            <FaDollarSign size={50} opacity={0.3} />
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card bg-primary text-white p-4 shadow h-100">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="opacity-75">SESIONES REALIZADAS</h6>
                                <h1 className="fw-bold mb-0">{stats.sesionesTotales}</h1>
                            </div>
                            <FaUserClock size={50} opacity={0.3} />
                        </div>
                    </div>
                </div>

                <div className="col-md-4">
                    <div className="card bg-warning text-dark p-4 shadow h-100">
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="opacity-75">GANANCIAS DE HOY</h6>
                                <h1 className="fw-bold mb-0">${stats.ingresosHoy.toFixed(2)}</h1>
                            </div>
                            <FaCalendarAlt size={50} opacity={0.3} />
                        </div>
                    </div>
                </div>
            </div>

            {/* GRÁFICO Y LISTA */}
            <div className="row g-4">
                <div className="col-lg-8">
                    <div className="card p-4 shadow h-100">
                        <h5 className="mb-4 text-secondary"><FaChartLine /> Últimas Ventas</h5>
                        <div style={{ height: '300px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={datosGrafico}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="Monto" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                <div className="col-lg-4">
                    <div className="card p-4 shadow h-100">
                        <h5 className="mb-4 text-secondary">Historial Reciente</h5>
                        <div className="list-group list-group-flush">
                            {sesiones.slice().reverse().slice(0, 5).map((sesion, index) => (
                                <div key={index} className="list-group-item d-flex justify-content-between align-items-center">
                                    <div>
                                        <strong>{sesion.cliente_nombre || `Cliente ${sesion.id_cliente}`}</strong>
                                        <div className="small text-muted">{sesion.fecha} - PC {sesion.id_pc}</div>
                                    </div>
                                    <span className="badge bg-success rounded-pill fs-6">
                                        ${(sesion.total || 0).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                            {sesiones.length === 0 && <p className="text-muted text-center">Aún no hay ventas.</p>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PageReports;