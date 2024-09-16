export interface ExpedienteManagement {
  id?: number;                        // ID del expediente
  tipo_canal?: number | null;         // Tipo de canal (opcional)
  tipo_expediente?: number;            // Tipo de expediente
  codigo_expediente?: number | null;  // Código de expediente (opcional)
  tipo_reclamo_id?: number;            // ID del tipo de reclamo
  fecha?: Date | null;                // Fecha (opcional)
  evidencia?: string | null;          // Evidencia (opcional)
  es_confidencial?: number;            // Indicador de confidencialidad
  tipo_documento_id?: number | null;  // ID del tipo de documento (opcional)
  numero_documento?: string | null;   // Número de documento (opcional)
  nombres?: string | null;            // Nombres (opcional)
  apellido_paterno?: string | null;   // Apellido paterno (opcional)
  apellido_materno?: string | null;   // Apellido materno (opcional)
  genero?: number;                     // Género
  telefono?: string | null;           // Teléfono (opcional)
  celular?: string | null;            // Celular (opcional)
  email?: string | null;              // Email (opcional)
  ubigeo_id?: number;                  // ID del ubigeo
  direccion?: string;                  // Dirección
  estado_proceso_id?: number;          // ID del estado del proceso
  contenido_consulta?: string;         // Contenido de la consulta
  comunidad?: string | null;          // Comunidad (opcional)
  cargo?: string | null;              // Cargo (opcional)
  codigo_verificacion?: string | null;// Código de verificación (opcional)
  usuario_id?: number;                 // ID del usuario
  estado?: number;                     // Estado
}
