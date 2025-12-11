import { useState } from 'react';
// 1. Importamos deleteItem para que funcione el borrado
import { createItem, updateItem, deleteItem } from '../../services/api';
import { ProductoModel } from '../../types/InitialStates';
import { useFetch } from '../../hooks/useFetch';
import { formatCurrency } from '../../utils/formatters';
import { FaEdit, FaTrash, FaHamburger, FaSave, FaPlus } from 'react-icons/fa';

function PageProductList() {
    // Hook para cargar productos
    const { data: productos, reload: reloadProductos } = useFetch('productos');

    // Estados para el formulario y edición
    const [form, setForm] = useState(ProductoModel);
    const [editingId, setEditingId] = useState(null);

    // --- FUNCIÓN GUARDAR (CREAR O EDITAR) ---
    const guardar = async (e) => {
        e.preventDefault();

        // Convertimos a números para evitar errores en la BD
        const productoAEnviar = {
            ...form,
            precio: Number(form.precio),
            stock: Number(form.stock)
        };

        try {
            if (editingId) {
                // MODO EDICIÓN
                await updateItem('productos', editingId, productoAEnviar);
                alert("✅ Producto actualizado correctamente");
                setEditingId(null);
            } else {
                // MODO CREACIÓN
                await createItem('productos', productoAEnviar);
                alert("✅ Producto agregado al inventario");
            }

            // Limpiamos todo
            setForm(ProductoModel);
            reloadProductos(); // Recargamos la lista
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("❌ Ocurrió un error al guardar. Revisa la consola.");
        }
    };

    // --- FUNCIÓN CARGAR DATOS PARA EDITAR ---
    const cargarEdicion = (producto) => {
        setForm(producto);       // Rellena los inputs
        setEditingId(producto.id); // Activa modo edición
        window.scrollTo({ top: 0, behavior: 'smooth' }); // Sube la pantalla
    };

    // --- FUNCIÓN ELIMINAR ---
    const eliminar = async (id) => {
        if (confirm("¿Seguro que deseas borrar este producto?")) {
            try {
                await deleteItem('productos', id);
                reloadProductos(); // Recargamos la lista
            } catch (error) {
                console.error(error);
                alert("❌ Error al eliminar");
            }
        }
    };

    return (
        <div className="container mt-4">
            <h2 className="text-white mb-4">🍔 Cafetería / Productos</h2>

            {/* --- FORMULARIO DE GESTIÓN --- */}
            <div className={`card p-4 mb-5 border-secondary shadow ${editingId ? 'bg-primary bg-opacity-10 border-primary' : 'bg-dark text-white'}`}>
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="m-0 text-primary">
                        {editingId ? <><FaEdit /> Editando Producto</> : <><FaPlus /> Nuevo Producto</>}
                    </h5>

                    {editingId && (
                        <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => { setEditingId(null); setForm(ProductoModel) }}
                        >
                            Cancelar Edición
                        </button>
                    )}
                </div>

                <form onSubmit={guardar} className="row g-3">
                    <div className="col-md-6">
                        <label className="small text-muted">Nombre del Producto</label>
                        <input
                            className="form-control"
                            placeholder="Ej. Coca Cola"
                            value={form.nombre}
                            onChange={e => setForm({ ...form, nombre: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="small text-muted">Precio ($)</label>
                        <input
                            type="number"
                            step="0.50"
                            className="form-control"
                            placeholder="0.00"
                            value={form.precio}
                            onChange={e => setForm({ ...form, precio: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-md-3">
                        <label className="small text-muted">Stock Inicial</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="0"
                            value={form.stock}
                            onChange={e => setForm({ ...form, stock: e.target.value })}
                            required
                        />
                    </div>
                    <div className="col-12 text-end">
                        <button className={`btn px-4 fw-bold ${editingId ? 'btn-primary' : 'btn-success'}`}>
                            {editingId ? <><FaSave /> Actualizar</> : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>

            {/* --- LISTADO DE PRODUCTOS --- */}
            <div className="row g-3">
                {productos && productos.map(p => (
                    <div className="col-md-4 col-lg-3" key={p.id}>
                        <div className="card h-100 bg-dark text-white border-secondary position-relative shadow-sm hover-effect">

                            {/* Botones Flotantes (Editar / Eliminar) */}
                            <div className="position-absolute top-0 end-0 p-2 d-flex gap-1 bg-dark rounded-bottom-start border-bottom border-start border-secondary" style={{ opacity: 0.9 }}>
                                <button
                                    onClick={() => cargarEdicion(p)}
                                    className="btn btn-sm text-warning p-1"
                                    title="Editar"
                                >
                                    <FaEdit />
                                </button>
                                <button
                                    onClick={() => eliminar(p.id)}
                                    className="btn btn-sm text-danger p-1"
                                    title="Eliminar"
                                >
                                    <FaTrash />
                                </button>
                            </div>

                            <div className="card-body text-center pt-5">
                                <div className="display-4 text-muted mb-3 opacity-25">
                                    <FaHamburger />
                                </div>

                                <h5 className="card-title fw-bold text-truncate px-2">{p.nombre}</h5>

                                <div className="my-3">
                                    <h3 className="text-warning m-0">{formatCurrency(p.precio)}</h3>
                                </div>

                                <span className={`badge ${p.stock < 10 ? 'bg-danger' : 'bg-success'} text-dark`}>
                                    Stock: {p.stock} un.
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {(!productos || productos.length === 0) && (
                    <div className="col-12 text-center text-muted mt-5">
                        No hay productos en la cafetería.
                    </div>
                )}
            </div>
        </div>
    );
}

export default PageProductList;