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
  respuestaReclamo: string = '';
  comentarioReclamo: string = '';
  derivarOtraArea: boolean | '' = '';

  especialistaSeleccionado = '';
  especialistas: string[] = ['Especialista 1', 'Especialista 2'];
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
  }
  @Output() cambiarPestania = new EventEmitter<'proceso' | 'atendidos' | 'reasignado'>();

  cargarExpedientes(filtros: any): void {
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
    this.especialistaSeleccionado = '';
  }
  confirmarAccion2(): void {
    if (!this.itemSeleccionado || !this.itemSeleccionado.idexpediente) {
      this.openDialogGeneral('Error', 'El expediente seleccionado no tiene un ID válido.', 'warning');
      return;
    }
    const expedienteId = this.itemSeleccionado.idexpediente;
    const usuarioId = 1; // O el ID real del usuario actual si está disponible
    const estado = this.esAprobacion ? 2 : 3; // 2 = ATENDIDO, 3 = DENEGADO
    if (!this.esAprobacion && !this.motivoRechazo.trim()) {
      this.openDialogGeneral('Motivo requerido', 'Debe ingresar un motivo para denegar.', 'warning');
      return;
    }
    const payload = {
      id: expedienteId,
      usuarioId: usuarioId,
      estado: estado,
      motivo: this.esAprobacion ? "" : this.motivoRechazo.trim()
    };

     this.loading = true;
     this._apiService.actualizarEstado(payload).subscribe({
      next: () => {
        const mensaje = this.esAprobacion
          ? 'Se aprobó correctamente el expediente N°'+this.itemSeleccionado.expediente+'.'
          : 'Se denegó correctamente el expediente.';
        const icono = this.esAprobacion ? 'success' : 'warning';

        this.openDialogGeneral('Mensaje de Información', mensaje, icono);

        this.cerrarModal(); // cierra modal
        this.cambiarPestania.emit(this.esAprobacion ? 'atendidos' : 'reasignado');
      },
      error: () => {
        this.openDialogGeneral('Error', 'Ocurrió un problema al actualizar el estado del expediente', 'warning');
      }
    });
  }
  confirmarAccion(): void {
    if (!this.itemSeleccionado || !this.itemSeleccionado.idexpediente) {
      this.openDialogGeneral('Error', 'El expediente seleccionado no tiene un ID válido.', 'warning');
      return;
    }

    if (this.esAprobacion && !this.respuestaReclamo.trim()) {
      this.openDialogGeneral('Campo requerido', 'Debe ingresar una respuesta al reclamo, queja o consulta.', 'warning');
      return;
    }

    const expedienteId = this.itemSeleccionado.idexpediente;
    const usuarioId = 1; // o id real
    const estado = this.derivarOtraArea ? 6 : 5;

    /*const payload = {
      id: expedienteId,
      usuarioId,
      estado,
      respuesta: this.respuestaReclamo.trim(),
      comentario: this.comentarioReclamo?.trim() || '',
      evidencia: this.archivoAdjunto?.name || '',
      especialista: this.derivarOtraArea ? this.especialistaSeleccionado : ''
    };*/
    const payload = {
      id: expedienteId,
      usuarioId: usuarioId,
      estado: estado,
      motivo: this.esAprobacion ? "" : this.motivoRechazo.trim()
    };

    this.loading = true;
    this._apiService.actualizarEstado(payload).subscribe({
      next: () => {
        const mensaje = this.derivarOtraArea
          ? 'El expediente ha sido derivado a otra área.'
          : 'El expediente ha sido atendido correctamente.';
        this.openDialogGeneral('Mensaje de Información', mensaje, 'success');
        this.cerrarModal();
        this.cambiarPestania.emit(this.derivarOtraArea ? 'reasignado' : 'atendidos');
      },
      error: () => {
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
}
