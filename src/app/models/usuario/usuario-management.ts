export interface UsuarioManagement {
  id: number;                        // ID del usuario
  tipo_id?: number | null;            // Tipo de identificación (opcional)
  dni: string;                        // DNI del usuario
  nombre: string;                     // Nombre del usuario
  apellido_paterno: string;           // Apellido paterno
  apellido_materno: string;           // Apellido materno
  telefono: string;                   // Teléfono del usuario
  email: string;                      // Correo electrónico
  email_verified_at?: Date | null;    // Fecha de verificación de email (opcional)
  password: string;                   // Contraseña del usuario
  remember_token: string;             // Token de recordatorio
  estado: number;                     // Estado del usuario
  created_auth: number;               // Usuario que creó el registro
  updated_auth?: number | null;       // Usuario que actualizó el registro (opcional)
  created_at?: Date | null;           // Fecha de creación (opcional)
  updated_at?: Date | null;           // Fecha de actualización (opcional)
}
