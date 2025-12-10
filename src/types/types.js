/**
 * Este archivo define las INTERFACES (Contratos de Datos) del sistema.
 * Se utiliza JSDoc para tipar la arquitectura en JavaScript estándar.
 */

// --- INTERFAZ 1: COMPUTADORA ---
/**
 * @typedef {Object} IComputadora
 * @property {number} id - Identificador único
 * @property {string} nombre - Nombre del equipo (ej. PC-01)
 * @property {string} specs - Especificaciones técnicas
 * @property {string} estado - 'Disponible' | 'Ocupada'
 * @property {number} id_sala - ID de la sala donde se ubica
 */

// --- INTERFAZ 2: CLIENTE ---
/**
 * @typedef {Object} ICliente
 * @property {number} id - Identificador único
 * @property {string} nombre - Nombre completo
 * @property {string} nickname - Apodo del gamer
 * @property {number} id_membresia - FK hacia Membresía
 */

// --- INTERFAZ 3: MEMBRESIA ---
/**
 * @typedef {Object} IMembresia
 * @property {number} id
 * @property {string} nombre - Nombre del rango (ej. VIP)
 * @property {number} descuento - Porcentaje de descuento
 * @property {number} horas_requeridas - Horas para alcanzar el nivel
 */

// --- INTERFAZ 4: SESION (ALQUILER) ---
/**
 * @typedef {Object} ISesion
 * @property {number} id
 * @property {number} id_cliente - Quién juega
 * @property {number} id_computadora - Dónde juega
 * @property {string} hora_inicio - Hora de registro
 * @property {number} horas - Cantidad de horas alquiladas
 * @property {number} total - Dinero total cobrado
 */

// --- INTERFAZ 5: USUARIO (SISTEMA) ---
/**
 * @typedef {Object} IUsuario
 * @property {number} id
 * @property {string} user - Nombre de usuario para login
 * @property {string} pass - Contraseña
 * @property {number} id_rol - 1: Admin, 2: Cajero
 */

// Exportamos un objeto vacío solo para que el archivo sea un módulo válido de JS
export const Types = {};