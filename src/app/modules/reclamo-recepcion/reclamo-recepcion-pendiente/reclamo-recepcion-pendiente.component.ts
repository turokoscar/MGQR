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


@Component({
  selector: 'app-reclamo-recepcion-pendiente',
  templateUrl: './reclamo-recepcion-pendiente.component.html',
  styleUrls: ['./reclamo-recepcion-pendiente.component.scss']
})
export class ReclamoRecepcionPendienteComponent implements OnInit {
  //1. Generamos las variables iniciales
  loading: boolean = false;
  columnas: string[] = ['index','numero', 'procedencia','tipo','canal', 'fecha',  'descripcion', 'usuario', 'plazo', 'acciones'];
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
    private exportService: ExportService
  ){}
  //3. Inicializamos el componente
  ngOnInit(): void {
    //this.showData();
    //this.cargarExpedientes();
  }

  @Output() cambiarPestania = new EventEmitter<'atendido' | 'denegado'>();

  cargarExpedientes(filtros: any): void {
    this.loading = true;
    this._apiService.listarPorFiltros(filtros).subscribe({
      next: (data) => {
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

  //4. Verificamos que todos los elementos esten seleccionados
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    if (this.dataSource) {
      const numRows = this.dataSource?.data.length;
      return numSelected === numRows;
    }
    return false;
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
  //7. Seleccionamos una fila específica
  seleccionar(row: Expediente){
    this.selection.toggle(row);
    this.habilitaBotones(this.selection.selected.length);
  }
  //8. Método que genera etiquetas dinámicas para los checkboxes en función de si se trata de la operación "Seleccionar todo" o de la selección individual de una fila específica. La etiqueta indica al usuario qué acción realizar (seleccionar o deseleccionar) y el identificador de la fila afectada.
  checkboxLabel(row?: Expediente): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id}`;
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

  //16. Llamamos al formulario para la recepción de un expediente
  recepcionar():void{
    this.loading = true;
    if (this.selection.selected.length > 0) {
      const registro = this.selection.selected[0];
      if (registro && registro.id) {
        this.router.navigate(['recepcion', registro.id]);
        this.loading = false;
      }
      else{
        this.loading = false;
        this._notificacion.showError("Atención:", "El registro no tiene un ID válido: "+registro);
      }
    }
    else{
      this.loading = false;
      this._notificacion.showError("Atención:", "No se ha seleccionado ningún registro.");
    }
  }
  //17. Llamamos al formulario para denegar un expediente
  denegar():void{
    this.loading = true;
    if (this.selection.selected.length > 0) {
      const registro = this.selection.selected[0];
      if (registro && registro.id) {
        this.router.navigate(['denegacion', registro.id]);
        this.loading = false;
      }
      else{
        this.loading = false;
        this._notificacion.showError("Atención:", "El registro no tiene un ID válido: "+registro);
      }
    }
    else{
      this.loading = false;
      this._notificacion.showError("Atención:", "No se ha seleccionado ningún registro.");
    }
  }
  //18. Exportamos la información requerida
  export(format: string): void {
    this.exportService.exportData(this.dataSource.data, format);
  }

  mostrarAlerta(titulo: string, mensaje: string) {
    this.alertaTitulo = titulo;
    this.alertaMensaje = mensaje;
    this.alertaVisible = true;
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
    this.modalVisible = true;
  }

  rechazar(row: Expediente): void {
    this.esAprobacion = false;
    this.itemSeleccionado = row;
    this.modalVisible = true;
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
    if (this.esAprobacion) {
      this.mostrarAlerta(
        'Mensaje de Notificación',
        'El Ítem ha sido admitido con éxito con el <strong>Expediente N° EXP240001</strong> y se notificó al titular.'
      );
    } else {
      this.mostrarAlerta(
        'Mensaje de Notificación',
        'El Ítem ha sido Denegado con exito y se notificó al titular de la queja o reclamo.'
      );
    }
    this.cerrarModal();
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
