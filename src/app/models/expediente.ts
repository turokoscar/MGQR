export interface Expediente {
  id?: number,
  tipo_canal?: number,
  tipo_expediente: number,
  codigo_expediente?: number,
  tipo_reclamo?: string,
  fecha?: Date,
  evidencia?: string,
  es_confidencial: number,
  tipo_documento?: string,
  numero_documento?: string,
  nombres?: string,
  apellido_paterno?: string,
  apellido_materno?: string,
  genero?: string,
  telefono?: number,
  celular?: number,
  email?: number,
  ubigeo?: string,
  direccion?: string,
  estado_proceso?: string,
  contenido_consulta?: string,
  comunidad?: string,
  cargo?: string,
  usuario_id?: number,
  estado?: number,
  create_at?: Date,
  update_at?: Date
}
