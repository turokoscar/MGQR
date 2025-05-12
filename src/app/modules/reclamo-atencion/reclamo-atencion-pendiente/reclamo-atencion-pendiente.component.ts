import { SelectionModel } from '@angular/cdk/collections';
import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Expediente } from 'src/app/models/expediente';
import { ExpedienteDetalleDto } from 'src/app/models/expediente-detalle-dto';
import { TipoProcedenciaReclamo } from 'src/app/models/tipo-procedencia-reclamo';
import { TipoReclamo } from 'src/app/models/tipo-reclamo';
import { AuthService } from 'src/app/services/auth.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { ExportService } from 'src/app/services/export.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AlertService } from 'src/app/services/alert.service';
import {SweetAlertIcon} from "sweetalert2";
import { TipoProcedenciaReclamoService } from 'src/app/services/tipo-procedencia-reclamo.service';
import { TipoReclamoService } from 'src/app/services/tipo-reclamo.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-reclamo-atencion-pendiente',
  templateUrl: './reclamo-atencion-pendiente.component.html',
  styleUrls: ['./reclamo-atencion-pendiente.component.scss']
})
export class ReclamoAtencionPendienteComponent implements OnInit {
  //1. Generamos las variables iniciales
  loading: boolean = false;
  columnas: string[] = ['index','proyecto','numero', 'procedencia','tipo','canal', 'fecha',  'descripcion', 'usuario', 'plazo', 'acciones'];
  dataSource = new MatTableDataSource<Expediente>();
  dataSourceExp = new MatTableDataSource<ExpedienteDetalleDto>();
  selection = new SelectionModel<Expediente>(true, []);
  tipoReclamos: TipoReclamo[] = [];
  tipoProcedencia: TipoProcedenciaReclamo[] = [];
  esAtencion = true;
  modalVisible = false;
  itemSeleccionado: any = null;
  id!: number;
  numeroSeleccion!: number;
  textoFiltro:string = '';
  errorMessage: string = '';
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
  @Output() cambiarPestania = new EventEmitter<'proceso' | 'atendidos' | 'reasignado'>();

  cargarExpedientes(filtros: any): void {
    this.loading = true;
    this._apiService.listarPorFiltros(filtros).subscribe({
      next: (data) => {
        console.log(data);
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
  //4. Verificamos que todos los elementos esten seleccionados
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    if (this.dataSource) {
      const numRows = this.dataSource?.data.length;
      return numSelected === numRows;
    }
    return false;
  }
  verDetalle(row: any): void {
    this.router.navigate(['/reclamo/create'], {
      state: { expediente: row }
    });
  }
  aprobar(row: Expediente): void {
    this.esAtencion = true;
    this.itemSeleccionado = row;
    console.log(row);
    console.log(this.itemSeleccionado);
    setTimeout(() => {
      this.modalVisible = true;
    });
  }
  openDialogGeneral(title: string, html: any, icon: string): void {
    this.alertService.showAlertGeneral(title,html,icon as SweetAlertIcon);
  }
  confirmarAccion(): void {
  if (!this.itemSeleccionado || !this.itemSeleccionado.idexpediente) {
    this.openDialogGeneral('Error', 'El expediente seleccionado no tiene un ID válido.', 'warning');
    return;
  }
  const expedienteId = this.itemSeleccionado.idexpediente;
  const usuarioId = 1; // O el ID real del usuario actual si está disponible
  const estado = 4; // 4 = proceso

  const payload = {
    id: expedienteId,
    usuarioId: usuarioId,
    estado: estado,
    motivo: ""
  };

   this.loading = true;
   this._apiService.actualizarEstado(payload).subscribe({
    next: () => {
      const mensaje = 'Se movió correctamente el expediente N°'+this.itemSeleccionado.expediente+' a la bandeja En Proceso.';
      const icono = 'success';

      this.openDialogGeneral('Mensaje de Información', mensaje, icono);

      this.cerrarModal(); // cierra modal
      this.cambiarPestania.emit('proceso');
    },
    error: () => {
      this.openDialogGeneral('Error', 'Ocurrió un problema al actualizar el estado del expediente', 'warning');
    }
  });
}

  cerrarModal(): void {
    this.modalVisible = false;
    this.itemSeleccionado = null;
  }
  //5. Habilitamos los botones para editar y eliminar
  habilitaBotones(numero:number){
    this.numeroSeleccion = numero;
  }
  //6. Seleccionamos todos los registros
  masterToggle() {
    if (this.isAllSelected()) {
      this.selection.clear();
      this.habilitaBotones(0);
      return;
    }
    if(this.dataSource){
      this.selection.select(...this.dataSource.data);
      this.habilitaBotones(this.selection.selected.length);
    }
  }
}
