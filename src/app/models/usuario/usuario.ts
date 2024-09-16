export interface Usuario {
  id: number;                         // ID del usuario
  tipo_documento?: string | null;     // Tipo de identificación (opcional)
  dni: string;                        // DNI del usuario
  nombre: string;                     // Nombre del usuario
  apellido_paterno: string;           // Apellido paterno
  apellido_materno: string;           // Apellido materno
  telefono: string;                   // Teléfono del usuario
  email: string;                      // Correo electrónico
  area: string;                       // Area del usuario
  cargo: string;                      // Cargo del usuario
  rol: string;                        // Rol del usuario
}
