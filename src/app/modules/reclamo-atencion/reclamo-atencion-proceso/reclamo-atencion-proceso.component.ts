import { SelectionModel } from '@angular/cdk/collections';
import { Component,EventEmitter, OnInit,Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Expediente } from 'src/app/models/expediente';
import { ExpedienteDetalleDto } from 'src/app/models/expediente-detalle-dto';
import { TipoProcedenciaReclamo } from 'src/app/models/tipo-procedencia-reclamo';
import { TipoReclamo } from 'src/app/models/tipo-reclamo';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { Usuario } from 'src/app/models/usuario/usuarioRol';
import { ExportService } from 'src/app/services/export.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AlertService } from 'src/app/services/alert.service';
import {SweetAlertIcon} from "sweetalert2";
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-reclamo-atencion-proceso',
  templateUrl: './reclamo-atencion-proceso.component.html',
  styleUrls: ['./reclamo-atencion-proceso.component.scss']
})
export class ReclamoAtencionProcesoComponent implements OnInit {
  //1. Generamos las variables iniciales
  loading: boolean = false;
  columnas: string[] = ['index','proyecto','numero', 'procedencia','tipo','canal', 'fecha',  'descripcion', 'usuario', 'plazo', 'acciones'];
  dataSource = new MatTableDataSource<Expediente>();
  dataSourceExp = new MatTableDataSource<ExpedienteDetalleDto>();
  selection = new SelectionModel<Expediente>(true, []);
  tipoReclamos: TipoReclamo[] = [];
  tipoProcedencia: TipoProcedenciaReclamo[] = [];
  modalVisible = false;
  esAprobacion = true;
  motivoRechazo = '';
  itemSeleccionado: any = null;
  filtrosActivos: any = null;
  respuestaReclamo: string = '';
  comentarioReclamo: string = '';
  derivarOtraArea: boolean | false = false;
  nombreArchivoRespuesta: string = '';
  usuarioSeleccionado = 0;
  usuarios: Usuario[] = [];
  filtro = {
    usuarioId: '0',
    rol: '0',
  };
  areas: string[] = ['Area 1', 'Area 2'];
  archivoAdjunto: File | null = null;
  id!: number;
  errorMessage: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //2. Inicializamos las variables en el constructor
  constructor(
    private _apiService: ExpedienteService,
    private _notificacion: NotificationService,
    private router: Router,
    private exportService: ExportService,
    private alertService: AlertService
  ){}
  //3. Inicializamos el componente
  ngOnInit(): void {
    this.showUsuarios();
  }
  @Output() cambiarPestaniaA = new EventEmitter<'proceso' | 'atendidos' | 'reasignado'>();

  cargarExpedientes(filtros: any): void {
    this.filtrosActivos = filtros;
    this.loading = true;
    this._apiService.listarPorFiltros(filtros).subscribe({
      next: (data) => {
        this.dataSourceExp.data = data;
        this.dataSourceExp.paginator = this.paginator;
        this.dataSourceExp.sort = this.sort;
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.errorMessage = "Se presentó un problema al listar los expedientes: " + e;
        this._notificacion.showError("Error", this.errorMessage);
      }
    });
  }
  getDownloadLink(nombreArchivo: string): string {
    return `${environment.apiUrl}/Expediente/DescargarEvidencia/${encodeURIComponent(nombreArchivo)}`;
  }
  verDetalle(row: any): void {
    this.router.navigate(['/reclamo/create'], {
      state: { expediente: row }
    });
  }
  aprobar(row: Expediente): void {
    this.esAprobacion = true;
    this.itemSeleccionado = row;
    this.derivarOtraArea=false;
    this.respuestaReclamo = '';
    this.comentarioReclamo = '';
    this.usuarioSeleccionado = 0;
    this.archivoAdjunto = null;
    console.log(row);
    console.log(this.itemSeleccionado);
    setTimeout(() => {
      this.modalVisible = true;
    });
  }
  cerrarModal(): void {
    this.modalVisible = false;
    this.itemSeleccionado = null;
    this.motivoRechazo = '';
    this.archivoAdjunto = null;
    this.usuarioSeleccionado = 0;
  }

  confirmarAccion(): void {
    if (!this.itemSeleccionado || !this.itemSeleccionado.idexpediente) {
      this.openDialogGeneral('Error', 'El expediente seleccionado no tiene un ID válido.', 'warning');
      return;
    }

    if (!this.respuestaReclamo.trim()) {
      this.openDialogGeneral('Campo requerido', 'Debe ingresar una respuesta al reclamo, queja o consulta.', 'warning');
      return;
    }

    const expedienteId = this.itemSeleccionado.idexpediente;
    var user_id=localStorage.getItem('id') ?? '1';
    const usuarioId = +user_id;
    const estado = this.derivarOtraArea ? 7 : 6; // 6: Atendido, 7: Reasignado

    let nombreArchivo = '';
    const archivosAdjuntos: File[] = [];

    if (this.archivoAdjunto) {
      const extension = this.archivoAdjunto.name.split('.').pop()?.toLowerCase() || '';
      const timestamp = new Date().getTime();
      const random = Math.random().toString(36).substring(2, 8);
      nombreArchivo = `${timestamp}-${random}.${extension}`;
      const archivoRenombrado = new File([this.archivoAdjunto], nombreArchivo, { type: this.archivoAdjunto.type });
      archivosAdjuntos.push(archivoRenombrado);
    }

    const payload = {
      id: expedienteId,
      usuarioId,
      estado,
      acciones: '',
      respuesta: this.respuestaReclamo.trim(),
      comentario: this.comentarioReclamo.trim(),
      evidencia: nombreArchivo,
      especialista: this.derivarOtraArea ? this.usuarioSeleccionado : usuarioId
    };

    this.loading = true;

    this._apiService.actualizarAtender(payload).subscribe({
      next: () => {
        if (archivosAdjuntos.length > 0) {
          const formData = new FormData();
          archivosAdjuntos.forEach(file => formData.append('files', file));

          this._apiService.upload(formData).subscribe({
            next: () => console.log('Archivo subido correctamente'),
            error: err => console.error('Error al subir archivo', err)
          });
        }

        const mensaje = this.derivarOtraArea
          ? 'El expediente ha sido derivado a otra área.'
          : 'El expediente ha sido atendido correctamente.';

        this.openDialogGeneral('Mensaje de Información', mensaje, 'success');
        this.cerrarModal();
        console.log(this.derivarOtraArea ? 'reasignado' : 'atendidos');
        this.cambiarPestaniaA.emit(this.derivarOtraArea ? 'reasignado' : 'atendidos');
        this.loading = false;
      },
      error: () => {
        this.loading = false;
        this.openDialogGeneral('Error', 'Ocurrió un problema al actualizar el estado.', 'warning');
      }
    });
  }

  onArchivoSeleccionado(event: any): void {
    this.archivoAdjunto = event.target.files[0] || null;
  }
  openDialogGeneral(title: string, html: any, icon: string): void {
    this.alertService.showAlertGeneral(title,html,icon as SweetAlertIcon);
  }
  getReferencia(referencia: string): void {
    this._apiService.listarReferenciaDetalle(referencia).subscribe({
      next: (data: ExpedienteDetalleDto) => {
        console.log(data);
        this.itemSeleccionado = data;
        this.router.navigate(['/reclamo/create'], {
          state: { expediente: this.itemSeleccionado }
        });
      },
      error: (err) => {
        this._notificacion.showError('Error', 'No se pudo obtener el detalle del expediente.');
        this.loading = false;
      }
    });
  }
  showUsuarios():void{
    //var rol_id=localStorage.getItem('rol') ?? '0';
    this.filtro = {
      usuarioId: '0',
      rol: '0'
    };
    this._apiService.showUsuariosRol(this.filtro).subscribe({
      next: (data) => {
        this.usuarios = data.filter(u => u.usuario_id !== +(localStorage.getItem('id')?.toString() ?? 1));
        this.usuarioSeleccionado=0;
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: "+ e;
        this._notificacion.showError("Error: ", this.errorMessage);
      }
    });
  }
  exportarExcel(): void {
    if (!this.filtrosActivos) {
      this._notificacion.showWarning('Aviso', 'No hay filtros definidos para exportar.');
      return;
    }
    const estado = this.filtrosActivos?.estado;
    let nombre = 'Reporte_GENERAL.xlsx';
    if (estado === 4) nombre = 'Reporte_PENDIENTES_ATENDER.xlsx';
    else if (estado === 5) nombre = 'Reporte_EN_PROCESO_ATENDER.xlsx';
    else if (estado === 6) nombre = 'Reporte_ATENDIDOS.xlsx';
    else if (estado === 7) nombre = 'Reporte_REASIGNADOS.xlsx';

    this._apiService.exportarExcelPorFiltros(this.filtrosActivos).subscribe({
      next: (data: Blob) => {
        const blob = new Blob([data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = nombre;
        a.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Error al exportar:', err);
        this._notificacion.showError('Error', 'No se pudo exportar el reporte.');
      }
    });
  }
}
