export interface ExpedienteSeguimientoManagement {
  id?: number;                        // ID del seguimiento
  expediente_id?: number;             // ID del expediente
  usuario_origen_id?: number;         // ID del usuario origen
  fecha_asignacion?: Date;            // Fecha de asignación
  usuario_id?: number;                // ID del usuario responsable
  fecha_recepcion?: Date | null;     // Fecha de recepción (opcional)
  acciones_realizadas?: string;       // Acciones realizadas
  evidencia?: string;                 // Evidencia (archivo o descripción)
  fecha_atencion?: Date | null;      // Fecha de atención (opcional)
  estado_proceso_id?: number;         // ID del estado del proceso
}
