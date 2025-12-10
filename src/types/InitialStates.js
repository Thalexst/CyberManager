// Definición de Estructuras de Datos (Interfaces Implícitas)

export const ClienteModel = {
    nombre: '',
    nickname: ''
    // id_membresia se asigna automáticamente en el backend/lógica
};

export const ComputadoraModel = {
    nombre: '',
    specs: '',
    estado: 'Disponible',
    id_sala: '' // String vacío para obligar a seleccionar
};

export const MembresiaModel = {
    nombre: '',
    descuento: 0,
    horas_requeridas: 0
};

export const SesionModel = {
    id_cliente: '',
    id_computadora: '',
    horas: 1 // Mínimo 1 hora por defecto
};

export const ProductoModel = {
    nombre: '',
    precio: '',
    stock: ''
};

export const JuegoModel = {
    titulo: '',
    genero: ''
};