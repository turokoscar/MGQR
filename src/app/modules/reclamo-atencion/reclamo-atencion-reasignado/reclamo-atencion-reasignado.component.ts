import { SelectionModel } from '@angular/cdk/collections';
import { Component, EventEmitter, OnInit,Output, ViewChild } from '@angular/core';
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
import { TipoProcedenciaReclamoService } from 'src/app/services/tipo-procedencia-reclamo.service';
import { TipoReclamoService } from 'src/app/services/tipo-reclamo.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-reclamo-atencion-reasignado',
  templateUrl: './reclamo-atencion-reasignado.component.html',
  styleUrls: ['./reclamo-atencion-reasignado.component.scss']
})
export class ReclamoAtencionReasignadoComponent implements OnInit {
  //1. Generamos las variables iniciales
  loading: boolean = false;
  columnas: string[] = ['index','proyecto','numero', 'procedencia','tipo','canal', 'fecha',  'descripcion', 'usuario', 'plazo','usuarioi', 'acciones'];
  dataSource = new MatTableDataSource<Expediente>();
  dataSourceExp = new MatTableDataSource<ExpedienteDetalleDto>();
  selection = new SelectionModel<Expediente>(true, []);
  tipoReclamos: TipoReclamo[] = [];
  modalVisible = false;
  esAprobacion = true;
  itemSeleccionado: any = null;
  respuestaReclamo: string = '';
  comentarioReclamo: string = '';
  derivarOtraArea: boolean | true = true;
  especialistaSeleccionado = '';
  especialistas: string[] = ['Especialista 1', 'Especialista 2'];
  tipoProcedencia: TipoProcedenciaReclamo[] = [];
  id!: number;
  modalDeshabilitado: boolean = true;
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
    private exportService: ExportService
  ){}
  //3. Inicializamos el componente
  ngOnInit(): void {
  }
  @Output() cambiarPestaniaA = new EventEmitter<'proceso' | 'atendidos' | 'reasignado'>();
  //4. Verificamos que todos los elementos esten seleccionados
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    if (this.dataSource) {
      const numRows = this.dataSource?.data.length;
      return numSelected === numRows;
    }
    return false;
  }
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
  verAtencion(row: Expediente): void {
    this.itemSeleccionado = row;
    this.loading = true;

    this.respuestaReclamo = this.itemSeleccionado.respuesta || '';
    this.comentarioReclamo = this.itemSeleccionado.comentario || '';
    this.especialistaSeleccionado = this.itemSeleccionado.especialista_id?.toString() || '';
    this.derivarOtraArea = true;

    this.esAprobacion = true;
    this.modalVisible = true;
    this.modalDeshabilitado = true;
    this.loading = false;
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.itemSeleccionado = null;
    this.especialistaSeleccionado = '';
    this.modalDeshabilitado = false;
  }

}
