import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaGamepad, FaCalculator, FaMoneyBillWave, FaUserTag, FaCoffee, FaTrash, FaPlusCircle } from 'react-icons/fa';

const PageSessionNew = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // 1. ESTADOS DE BASE DE DATOS
    const [clientes, setClientes] = useState([]);
    const [computadoras, setComputadoras] = useState([]);
    const [tarifas, setTarifas] = useState({});
    const [membresias, setMembresias] = useState([]);
    const [productos, setProductos] = useState([]);

    // 2. ESTADOS DEL FORMULARIO
    const [idCliente, setIdCliente] = useState('');
    const [idPC, setIdPC] = useState('');
    const [horas, setHoras] = useState(1);

    // 3. ESTADOS DEL CARRITO
    const [carrito, setCarrito] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState('');

    // 4. ESTADOS PARA EL CÁLCULO
    const [costoTiempo, setCostoTiempo] = useState(0);
    const [costoProductos, setCostoProductos] = useState(0);
    const [descuentoDinero, setDescuentoDinero] = useState(0);
    const [totalPagar, setTotalPagar] = useState(0);
    const [infoMembresia, setInfoMembresia] = useState({ nombre: '', porc: 0 });

    // 5. CARGAR DATOS
    useEffect(() => {
        const fetchData = async () => {
            try {
                const resClients = await fetch('http://localhost:3001/clientes');
                const resPCs = await fetch('http://localhost:3001/computadoras');
                const resRates = await fetch('http://localhost:3001/tarifas');
                const resMem = await fetch('http://localhost:3001/membresias');
                const resProd = await fetch('http://localhost:3001/productos');

                setClientes(await resClients.json());
                setComputadoras(await resPCs.json());
                setTarifas(await resRates.json());
                setMembresias(await resMem.json());
                setProductos(await resProd.json());
            } catch (error) {
                console.error("Error conectando al puerto 3001:", error);
            }
        };
        fetchData();
    }, []);

    // DETECTAR SI VENIMOS DEL DASHBOARD
    useEffect(() => {
        if (location.state && location.state.pcPreseleccionada) {
            setIdPC(location.state.pcPreseleccionada);
        }
    }, [location]);

    // --- LÓGICA PARA DETECTAR CLIENTES QUE YA ESTÁN JUGANDO ---
    const nicksOcupados = computadoras
        .filter(pc => pc.estado === 'ocupado')
        .map(pc => pc.cliente);
    // -----------------------------------------------------------

    // 6. FUNCIONES DEL CARRITO
    const agregarProducto = () => {
        if (!productoSeleccionado) return;
        const prodReal = productos.find(p => p.id.toString() === productoSeleccionado.toString());

        if (prodReal.stock <= 0) return alert("¡No hay stock!");

        const nuevoItem = {
            id: prodReal.id,
            nombre: prodReal.nombre,
            precio: prodReal.precio,
            stockOriginal: prodReal.stock
        };

        setCarrito([...carrito, nuevoItem]);
        setProductoSeleccionado('');
    };

    const eliminarProducto = (index) => {
        const nuevoCarrito = [...carrito];
        nuevoCarrito.splice(index, 1);
        setCarrito(nuevoCarrito);
    };

    // 7. LÓGICA DE CÁLCULO
    useEffect(() => {
        let precioPC = 0;
        let montoDescuento = 0;
        let porcentaje = 0;
        let nombreMembresia = '';

        if (idPC && tarifas && horas > 0) {
            const pcSeleccionada = computadoras.find(pc => pc.id.toString() === idPC.toString());
            if (pcSeleccionada && tarifas[pcSeleccionada.tipo]) {
                precioPC = tarifas[pcSeleccionada.tipo].precio * horas;
            }
        }

        if (idCliente && precioPC > 0) {
            const clienteSeleccionado = clientes.find(c => c.id.toString() === idCliente.toString());
            if (clienteSeleccionado) {
                const membresiaCliente = membresias.find(m => m.id.toString() === clienteSeleccionado.id_membresia.toString());
                if (membresiaCliente) {
                    porcentaje = membresiaCliente.descuento;
                    nombreMembresia = membresiaCliente.nombre;
                    montoDescuento = (precioPC * porcentaje) / 100;
                }
            }
        }

        const totalProds = carrito.reduce((suma, item) => suma + item.precio, 0);

        setCostoTiempo(precioPC);
        setCostoProductos(totalProds);
        setInfoMembresia({ nombre: nombreMembresia, porc: porcentaje });
        setDescuentoDinero(montoDescuento);
        setTotalPagar((precioPC - montoDescuento) + totalProds);

    }, [idPC, horas, idCliente, carrito, computadoras, tarifas, clientes, membresias]);

    // 8. GUARDAR TODO (AQUÍ ESTÁ LA CLAVE DEL "TOTAL")
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!idCliente || !idPC) return alert("Faltan datos");

        // Validación: Cliente único
        const clienteObj = clientes.find(c => c.id.toString() === idCliente.toString());
        if (clienteObj && nicksOcupados.includes(clienteObj.nickname)) {
            return alert("¡Error! Este cliente ya tiene una sesión activa.");
        }

        // A. ACTUALIZAR STOCK PRODUCTOS
        for (const item of carrito) {
            try {
                await fetch(`http://localhost:3001/productos/${item.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ stock: item.stockOriginal - 1 })
                });
            } catch (error) { console.error("Error stock", error); }
        }

        const nombreCliente = clienteObj ? clienteObj.nickname : "Cliente";
        const ahora = new Date();
        const fechaHoy = ahora.toISOString().split('T')[0];
        const horaActual = ahora.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        try {
            // B. CAMBIAR ESTADO DE LA PC A "OCUPADO"
            await fetch(`http://localhost:3001/computadoras/${idPC}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    estado: 'ocupado',
                    cliente: nombreCliente,
                    hora_inicio: horaActual
                })
            });

            // C. GUARDAR EN EL HISTORIAL (REPORTES)
            // IMPORTANTE: Usamos el campo 'total' para que coincida con tu BD
            await fetch('http://localhost:3001/sesiones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_cliente: parseInt(idCliente),
                    cliente_nombre: nombreCliente, // Guardamos el nombre para facilitar el reporte
                    id_pc: parseInt(idPC),
                    fecha: fechaHoy,
                    hora_inicio: horaActual,
                    horas: horas,
                    total: totalPagar // <--- AQUÍ GUARDAMOS EL DINERO
                })
            });

        } catch (error) {
            console.error("Error guardando sesión", error);
            return alert("Error al procesar la sesión");
        }

        alert(`¡Cobro exitoso de $${totalPagar.toFixed(2)}! Guardado en reportes.`);
        navigate('/dashboard');
    };

    return (
        <div className="container d-flex justify-content-center align-items-center py-4" style={{ minHeight: '80vh' }}>
            <div className="card shadow-lg p-4 bg-dark text-white" style={{ width: '100%', maxWidth: '600px', borderRadius: '15px' }}>

                <div className="text-center mb-4">
                    <h2 className="fw-bold"><FaGamepad className="text-primary me-2" /> Nueva Sesión</h2>
                </div>

                <form onSubmit={handleSubmit}>

                    {/* ALQUILER */}
                    <h5 className="border-bottom pb-2 mb-3 text-secondary">🖥️ Alquiler de Equipo</h5>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-secondary small">Cliente</label>
                            <select className="form-select bg-secondary text-white border-0" value={idCliente} onChange={(e) => setIdCliente(e.target.value)} required>
                                <option value="">-- Buscar --</option>
                                {clientes.map(c => {
                                    const estaOcupado = nicksOcupados.includes(c.nickname);
                                    return (
                                        <option key={c.id} value={c.id} disabled={estaOcupado} style={{ color: estaOcupado ? '#ffadad' : 'white' }}>
                                            {c.nombre} ({c.nickname}) {estaOcupado ? '🔴' : ''}
                                        </option>
                                    );
                                })}
                            </select>
                            {infoMembresia.nombre && <small className="text-warning d-block mt-1" style={{ fontSize: '0.75rem' }}><FaUserTag /> {infoMembresia.nombre} ({infoMembresia.porc}% OFF)</small>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label text-secondary small">PC</label>
                            <select className="form-select bg-secondary text-white border-0" value={idPC} onChange={(e) => setIdPC(e.target.value)} required>
                                <option value="">-- Elegir --</option>
                                {computadoras.filter(pc => pc.estado === 'disponible' || pc.id == idPC).map(pc => {
                                    const precio = tarifas[pc.tipo]?.precio || 0;
                                    return <option key={pc.id} value={pc.id}>{pc.nombre} (${precio}/h)</option>
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label text-secondary small">Horas</label>
                        <input type="number" className="form-control bg-secondary text-white border-0" min="1" max="12" value={horas} onChange={(e) => setHoras(Number(e.target.value))} />
                    </div>

                    {/* CAFETERÍA */}
                    <h5 className="border-bottom pb-2 mb-3 text-secondary d-flex align-items-center gap-2">
                        <FaCoffee /> Cafetería
                    </h5>

                    <div className="input-group mb-3">
                        <select className="form-select bg-secondary text-white border-0" value={productoSeleccionado} onChange={(e) => setProductoSeleccionado(e.target.value)}>
                            <option value="">-- Agregar Producto --</option>
                            {productos.map(prod => (
                                <option key={prod.id} value={prod.id} disabled={prod.stock <= 0}>
                                    {prod.nombre} - ${prod.precio.toFixed(2)} (Stock: {prod.stock})
                                </option>
                            ))}
                        </select>
                        <button type="button" className="btn btn-primary" onClick={agregarProducto}>
                            <FaPlusCircle /> Agregar
                        </button>
                    </div>

                    {/* Lista Cafetería */}
                    {carrito.length > 0 && (
                        <div className="bg-secondary p-2 rounded mb-3 bg-opacity-25">
                            {carrito.map((item, index) => (
                                <div key={index} className="d-flex justify-content-between align-items-center mb-1 border-bottom border-secondary pb-1 small">
                                    <span>{item.nombre}</span>
                                    <div>
                                        <span className="me-3 fw-bold">${item.precio.toFixed(2)}</span>
                                        <button type="button" className="btn btn-sm btn-danger py-0 px-1" onClick={() => eliminarProducto(index)}>
                                            <FaTrash size={10} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            <div className="text-end fw-bold text-info mt-2 small">
                                Total Cafetería: ${costoProductos.toFixed(2)}
                            </div>
                        </div>
                    )}

                    {/* RESUMEN */}
                    <div className="bg-light text-dark p-3 rounded mb-4 shadow-sm">
                        <div className="d-flex justify-content-between small">
                            <span>Alquiler PC ({horas}h):</span>
                            <span>${costoTiempo.toFixed(2)}</span>
                        </div>
                        {descuentoDinero > 0 && (
                            <div className="d-flex justify-content-between text-success fw-bold small">
                                <span>Desc. Membresía:</span>
                                <span>- ${descuentoDinero.toFixed(2)}</span>
                            </div>
                        )}
                        {costoProductos > 0 && (
                            <div className="d-flex justify-content-between text-info fw-bold small">
                                <span>Productos:</span>
                                <span>+ ${costoProductos.toFixed(2)}</span>
                            </div>
                        )}
                        <hr className="my-2" />
                        <div className="d-flex justify-content-between align-items-center">
                            <div className="d-flex align-items-center gap-2 fw-bold">
                                <FaCalculator /> <span>A PAGAR:</span>
                            </div>
                            <span className="fs-1 fw-bold text-primary">${totalPagar.toFixed(2)}</span>
                        </div>
                    </div>

                    <button type="submit" className="btn btn-success w-100 py-3 fw-bold fs-5 shadow hover-scale">
                        <FaMoneyBillWave className="me-2" /> COBRAR E INICIAR
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PageSessionNew;