import { useState, useEffect, useCallback } from 'react';
// IMPORTANTE: Ajustamos la ruta para salir de 'hooks' (..) y entrar a 'services'
import { getItems } from '../services/api';

/**
 * Hook personalizado para cargar datos de cualquier endpoint.
 * Maneja automáticamente la carga (loading) y los errores.
 */
export const useFetch = (endpoint) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // useCallback evita que la función se cree de nuevo en cada render
    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await getItems(endpoint);
            setData(response.data);
            setError(null);
        } catch (err) {
            console.error(`Error en useFetch (${endpoint}):`, err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    // Cargar los datos automáticamente al iniciar
    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Retornamos 'data', 'loading' y la función 'reload' para recargar manualmente
    return { data, loading, error, reload: fetchData };
};