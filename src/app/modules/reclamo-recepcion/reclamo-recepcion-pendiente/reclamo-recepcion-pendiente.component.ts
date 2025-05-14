import { SelectionModel } from '@angular/cdk/collections';
import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Expediente } from 'src/app/models/expediente';
import { ExpedienteDetalleDto } from 'src/app/models/expediente-detalle-dto';
import { AuthService } from 'src/app/services/auth.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TipoReclamo } from 'src/app/models/tipo-reclamo';
import { TipoReclamoService } from 'src/app/services/tipo-reclamo.service';
import { TipoProcedenciaReclamo } from 'src/app/models/tipo-procedencia-reclamo';
import { TipoProcedenciaReclamoService } from 'src/app/services/tipo-procedencia-reclamo.service';
import { ExportService } from 'src/app/services/export.service';
import { AlertService } from 'src/app/services/alert.service';
import {SweetAlertIcon} from "sweetalert2";
import { environment } from 'src/environments/environment.development';


@Component({
  selector: 'app-reclamo-recepcion-pendiente',
  templateUrl: './reclamo-recepcion-pendiente.component.html',
  styleUrls: ['./reclamo-recepcion-pendiente.component.scss']
})
export class ReclamoRecepcionPendienteComponent implements OnInit {
  //1. Generamos las variables iniciales
  loading: boolean = false;
  columnas: string[] = ['index','proyecto','numero', 'procedencia','tipo','canal', 'fecha',  'descripcion', 'usuario', 'plazo', 'acciones'];
  dataSource = new MatTableDataSource<Expediente>();
  dataSourceExp = new MatTableDataSource<ExpedienteDetalleDto>();
  selection = new SelectionModel<Expediente>(true, []);
  tipoReclamos: TipoReclamo[] = [];
  tipoProcedencia: TipoProcedenciaReclamo[] = [];
  id!: number;
  numeroSeleccion!: number;
  textoFiltro:string = '';
  errorMessage: string = '';

  alertaVisible: boolean = false;
  alertaTitulo: string = 'Mensaje de Notificación';
  alertaMensaje: string = '';

  modalVisible = false;
  esAprobacion = true;
  hayReferencia = false;
  itemSeleccionado: any = null;
  especialistaSeleccionado = '';
  especialistas: string[] = ['Especialista 1', 'Especialista 2'];
  motivoRechazo = '';
  archivoAdjunto: File | null = null;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  filterValues: { codigoExpediente: string; tipoReclamo: string; procedencia: string } = {
    codigoExpediente: '',
    tipoReclamo: '',
    procedencia: ''
  };
  //2. Inicializamos las variables en el constructor
  constructor(
    private _apiService: ExpedienteService,
    private _notificacion: NotificationService,
    private _login: AuthService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private _tipoReclamo: TipoReclamoService,
    private _tipoProcedencia: TipoProcedenciaReclamoService,
    private exportService: ExportService,
    private alertService: AlertService
  ){}
  //3. Inicializamos el componente
  ngOnInit(): void {
  }

  @Output() cambiarPestania = new EventEmitter<'atendido' | 'denegado'>();

  cargarExpedientes(filtros: any): void {
    this.loading = true;
    this._apiService.listarPorFiltros(filtros).subscribe({
      next: (data) => {
        console.log(data);
        this.dataSourceExp.data = data;
        this.dataSourceExp.paginator = this.paginator;
        this.dataSourceExp.sort = this.sort;
        this.dataSourceExp.filterPredicate = this.createFilter();
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

  //11. Función para crear el filtro personalizado
  createFilter(): (data: ExpedienteDetalleDto, filter: string) => boolean {
    return (data: ExpedienteDetalleDto, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return (
        (searchTerms.codigoExpediente === '' || (data.expediente?.toString().toLowerCase() || '').includes(searchTerms.codigoExpediente)) &&
        (searchTerms.tipoReclamo === '' || (data.tipo_reclamo?.toLowerCase() || '').includes(searchTerms.tipoReclamo)) &&
        (searchTerms.procedencia === '' || (data.procedencia?.toLowerCase() || '').includes(searchTerms.procedencia))
      );
    };
  }

  cerrarAlerta() {
    this.alertaVisible = false;
  }

  verDetalle(row: any): void {
    this.router.navigate(['/reclamo/create'], {
      state: { expediente: row }
    });
  }

  aprobar(row: Expediente): void {
    this.esAprobacion = true;
    this.itemSeleccionado = row;
    if (this.itemSeleccionado.referencia==='' || this.itemSeleccionado.referencia === null) {
      this.hayReferencia=false;
    }else{
      this.hayReferencia=true;
    }
    setTimeout(() => {
      this.modalVisible = true;
    });
  }

  rechazar(row: Expediente): void {
    this.esAprobacion = false;
    this.itemSeleccionado = row;
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

  onArchivoSeleccionado(event: any): void {
    this.archivoAdjunto = event.target.files[0] || null;
  }

  confirmarAccion(): void {
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
  if (this.hayReferencia && !this.motivoRechazo.trim()) {
    this.openDialogGeneral('Motivo requerido', 'Debe ingresar un motivo.', 'warning');
    return;
  }
  if (this.hayReferencia && !this.motivoRechazo.trim()) {
      this.openDialogGeneral('Motivo requerido', 'Debe ingresar un motivo.', 'warning');
      return;
  }
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
    usuarioId: usuarioId,
    estado: estado,
    acciones: this.esAprobacion ? "" : this.motivoRechazo.trim(),
    respuesta: '',
    comentario: '',
    evidencia: nombreArchivo,
    especialista: ''
  };
   this.loading = true;
   this._apiService.actualizarAtender(payload).subscribe({
    next: () => {
      const mensaje = this.esAprobacion
        ? 'Se aprobó correctamente el expediente N°'+this.itemSeleccionado.expediente+'.'
        : 'Se denegó correctamente el expediente.';
      const icono = this.esAprobacion ? 'success' : 'warning';

      this.openDialogGeneral('Mensaje de Información', mensaje, icono);

      this.cerrarModal(); // cierra modal
      this.cambiarPestania.emit(this.esAprobacion ? 'atendido' : 'denegado');
    },
    error: () => {
      this.openDialogGeneral('Error', 'Ocurrió un problema al actualizar el estado del expediente', 'warning');
    }
  });
}

  openDialogGeneral(title: string, html: any, icon: string): void {
    this.alertService.showAlertGeneral(title,html,icon as SweetAlertIcon);
  }
  aceptarAccion(): void {
    this.cerrarAlerta();
    if (this.esAprobacion) {
      this.cambiarPestania.emit('atendido');
    } else {
      this.cambiarPestania.emit('denegado');
    }
    this.cerrarModal();
  }
}
