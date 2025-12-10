import { useFetch } from '../../hooks/useFetch';
import { FaDesktop, FaGamepad, FaHeadset, FaUserAstronaut, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import PropTypes from 'prop-types';

// --- TARJETA DE ESTADÍSTICAS (KPI) ---
const StatCard = ({ title, count, icon, color }) => (
    <div className={`card h-100 border-start border-4 border-${color} position-relative overflow-hidden`}>
        <div className="card-body">
            <div className="d-flex justify-content-between align-items-center">
                <div>
                    {/* Título pequeño en gris claro */}
                    <p className="text-muted text-uppercase fw-bold mb-1" style={{ fontSize: '0.8rem', letterSpacing: '1px' }}>
                        {title}
                    </p>
                    {/* Número grande en blanco */}
                    <h2 className="mb-0 fw-bold text-white display-6">{count}</h2>
                </div>
                {/* Icono semitransparente */}
                <div className={`text-${color} opacity-25 display-4`}>
                    {icon}
                </div>
            </div>
        </div>
    </div>
);

StatCard.propTypes = {
    title: PropTypes.string,
    count: PropTypes.number,
    icon: PropTypes.element,
    color: PropTypes.string
};

// --- TARJETA DE PC (GAMER) ---
const PCCard = ({ pc, index }) => {
    const isAvailable = pc.estado === 'Disponible';
    const isMantenimiento = pc.estado === 'Mantenimiento';

    let statusColor = isAvailable ? 'success' : 'danger';
    let glowColor = isAvailable ? '#10b981' : '#ef4444'; // Verde : Rojo

    if (isMantenimiento) {
        statusColor = 'warning';
        glowColor = '#f59e0b'; // Amarillo
    }

    return (
        <div className="col-xl-2 col-lg-3 col-md-4 col-sm-6 mb-4">
            <div className={`card h-100 border-${statusColor}`}
                style={{ boxShadow: `0 0 15px ${glowColor}15` }}> {/* Sombra de color suave */}

                {/* Cabecera: Número y Estado */}
                <div className="d-flex justify-content-between align-items-center p-2 border-bottom border-secondary bg-black bg-opacity-25">
                    <span className="badge bg-secondary">#{index + 1}</span>
                    {/* Punto de luz */}
                    <div style={{
                        width: '10px', height: '10px', borderRadius: '50%',
                        backgroundColor: glowColor,
                        boxShadow: `0 0 8px ${glowColor}`
                    }}></div>
                </div>

                <div className="card-body text-center pt-4">
                    {/* Icono Principal */}
                    <div className="mb-3 display-5" style={{ color: glowColor, filter: `drop-shadow(0 0 5px ${glowColor})` }}>
                        <FaDesktop />
                    </div>

                    <h5 className="card-title text-white fw-bold mb-2">{pc.nombre}</h5>

                    {/* Specs */}
                    <div className="bg-black bg-opacity-50 p-2 rounded mb-3">
                        <small className="d-block text-muted" style={{ fontSize: '0.7rem' }}>Hardware</small>
                        <small className="text-info fw-bold" style={{ fontSize: '0.75rem' }}>{pc.specs}</small>
                    </div>

                    {/* Botón/Badge inferior */}
                    <div className={`d-grid`}>
                        <span className={`badge bg-${statusColor} text-dark fw-bold py-2`}>
                            {pc.estado.toUpperCase()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

PCCard.propTypes = {
    pc: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired
};

// --- DASHBOARD PRINCIPAL ---
function PageDashboard() {
    const { data: pcs, loading } = useFetch('computadoras');
    const { data: salas } = useFetch('salas');
    const { data: clientes } = useFetch('clientes');

    // Cálculos
    const totalPCs = pcs ? pcs.length : 0;
    const disponibles = pcs ? pcs.filter(p => p.estado === 'Disponible').length : 0;
    const ocupadas = pcs ? pcs.filter(p => p.estado === 'Ocupada').length : 0;

    const getSalaIcon = (nombre) => {
        if (nombre.toLowerCase().includes('arena')) return <FaGamepad className="text-warning" />;
        if (nombre.toLowerCase().includes('stream')) return <FaHeadset className="text-info" />;
        return <FaDesktop className="text-secondary" />;
    };

    if (loading) return <div className="text-white p-5 text-center">Iniciando sistema...</div>;

    return (
        <div className="container-fluid p-4">
            {/* 1. Header */}
            <div className="mb-5">
                <h2 className="fw-bold text-white"><span className="text-primary">Cyber</span>Manager 3000</h2>
                <p className="text-muted">Vista general del establecimiento</p>
            </div>

            {/* 2. Estadísticas Superiores */}
            <div className="row g-3 mb-5">
                <div className="col-md-3">
                    <StatCard title="Total Equipos" count={totalPCs} icon={<FaDesktop />} color="primary" />
                </div>
                <div className="col-md-3">
                    <StatCard title="Disponibles" count={disponibles} icon={<FaCheckCircle />} color="success" />
                </div>
                <div className="col-md-3">
                    <StatCard title="En Uso" count={ocupadas} icon={<FaUserAstronaut />} color="danger" />
                </div>
                <div className="col-md-3">
                    <StatCard title="Clientes" count={clientes ? clientes.length : 0} icon={<FaUserAstronaut />} color="info" />
                </div>
            </div>

            {/* 3. Listado por Salas */}
            {salas && salas.map(sala => {
                const pcsDeEstaSala = pcs ? pcs.filter(p => String(p.id_sala) === String(sala.id)) : [];
                if (pcsDeEstaSala.length === 0) return null;

                return (
                    <div key={sala.id} className="mb-5 animate__animated animate__fadeIn">
                        {/* Título de Sala */}
                        <div className="d-flex align-items-center mb-4 pb-2 border-bottom border-secondary">
                            <div className="display-6 me-3 opacity-75">{getSalaIcon(sala.nombre)}</div>
                            <div>
                                <h3 className="text-white m-0 fw-bold">{sala.nombre}</h3>
                                <small className="text-muted">{pcsDeEstaSala.length} terminales conectadas</small>
                            </div>
                        </div>

                        {/* Grid de PCs */}
                        <div className="row g-4">
                            {pcsDeEstaSala.map((pc, index) => (
                                <PCCard key={pc.id} pc={pc} index={index} />
                            ))}
                        </div>
                    </div>
                );
            })}

            {(!salas || salas.length === 0) && <p className="text-center text-muted mt-5">No se detectaron salas configuradas.</p>}
        </div>
    );
}

export default PageDashboard;