/**
 * Formatea un número a formato moneda (Ej: 10 -> $10.00)
 */
export const formatCurrency = (amount) => {
    const num = Number(amount);
    // Si no es número, devolvemos $0.00
    if (isNaN(num)) return '$0.00';

    // Formato estándar con 2 decimales
    return `$${num.toFixed(2)}`;
};

/**
 * Obtiene la fecha actual en formato local (Hora:Minuto)
 */
export const getCurrentTime = () => {
    return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Calcula el total a pagar
 */
export const calculateTotal = (horas, precioHora = 5) => {
    return horas * precioHora;
};