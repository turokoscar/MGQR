export interface Expediente {
  id?: number;                        // ID del expediente
  tipo_canal?: string | null;         // Tipo de canal (opcional)
  tipo_expediente: string;            // Tipo de expediente
  codigo_expediente?: number | null;  // Código de expediente (opcional)
  tipo_reclamo?: string;              // Tipo de reclamo
  fecha?: Date | null;                // Fecha (opcional)
  evidencia?: string | null;          // Evidencia (opcional)
  es_confidencial: number;            // Indicador de confidencialidad
  tipo_documento?: string | null;     // Tipo de documento (opcional)
  numero_documento?: string | null;   // Número de documento (opcional)
  nombres?: string | null;            // Nombres (opcional)
  apellido_paterno?: string | null;   // Apellido paterno (opcional)
  apellido_materno?: string | null;   // Apellido materno (opcional)
  genero: string;                     // Género
  telefono?: string | null;           // Teléfono (opcional)
  celular?: string | null;            // Celular (opcional)
  email?: string | null;              // Email (opcional)
  ubigeo?: string;                    // Ubigeo
  direccion?: string;                  // Dirección
  estado_proceso: string;             // Estado del proceso
  contenido_consulta: string;         // Contenido de la consulta
  comunidad?: string | null;          // Comunidad (opcional)
  cargo?: string | null;              // Cargo (opcional)
  codigo_verificacion?: string | null;// Código de verificación (opcional)
}
