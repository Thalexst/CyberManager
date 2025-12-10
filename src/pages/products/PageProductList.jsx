import { useState } from 'react';
import { createItem } from '../../services/api';
import { ProductoModel } from '../../types/InitialStates';
// IMPORTAMOS EL HOOK Y UTILS
import { useFetch } from '../../hooks/useFetch';
import { formatCurrency } from '../../utils/formatters';

function PageProductList() {
    const { data: productos, reload: reloadProductos } = useFetch('productos');
    const [form, setForm] = useState(ProductoModel);

    const guardar = async (e) => {
        e.preventDefault();
        await createItem('productos', form);
        alert("Producto guardado");
        setForm(ProductoModel);
        reloadProductos(); // Recargar
    };

    return (
        <div className="container mt-4">
            <h2>🍔 Cafetería / Productos</h2>
            <div className="card p-3 mb-3 bg-dark text-white border-secondary">
                <form onSubmit={guardar} className="d-flex gap-2">
                    <input className="form-control" placeholder="Producto" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} required />
                    <input type="number" className="form-control" placeholder="Precio" value={form.precio} onChange={e => setForm({ ...form, precio: e.target.value })} required style={{ width: '100px' }} />
                    <input type="number" className="form-control" placeholder="Stock" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} required style={{ width: '100px' }} />
                    <button className="btn btn-success">Agregar</button>
                </form>
            </div>
            <div className="row">
                {productos.map(p => (
                    <div className="col-md-3 mb-3" key={p.id}>
                        <div className="card bg-secondary text-white text-center p-3 h-100">
                            <h5 className="card-title">{p.nombre}</h5>
                            {/* Usamos el formatter de dinero aquí */}
                            <h3 className="text-warning my-3">{formatCurrency(p.precio)}</h3>
                            <small className="text-light">Stock: {p.stock} un.</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default PageProductList;