import { SelectionModel } from '@angular/cdk/collections';
import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Expediente } from 'src/app/models/expediente';
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
  columnas: string[] = ['select','numero', 'procedencia', 'canal','tipo', 'fecha',  'descripcion', 'usuario', 'plazo', 'acciones'];
  dataSource = new MatTableDataSource<Expediente>();
  selection = new SelectionModel<Expediente>(true, []);
  tipoReclamos: TipoReclamo[] = [];
  tipoProcedencia: TipoProcedenciaReclamo[] = [];
  id!: number;
  numeroSeleccion!: number;
  textoFiltro:string = '';
  errorMessage: string = '';

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
    this.showData();
    this.showTipoReclamo();
    this.showTipoProcedencia();
  }

  @Output() cambiarPestania = new EventEmitter<'atendido' | 'denegado'>();

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
  //9. Obtengo todos los registros
  showData2():void{
    this.loading = true;
    const estadoPendiente = 1;
    console.log("llega aquiiiiiiiiiiiiiiii");
    this._apiService.show(estadoPendiente).subscribe({
      next: (data) => {
        console.log(this.dataSource.data);
        /*this.dataSource.data = data;*/
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.filterPredicate = this.createFilter();
        this.loading = false;
      },
      error: (e) => {
        this.loading = false;
        this.errorMessage = "Se presentó un problema al realizar la operación"+ e;
        this._notificacion.showError("Error", this.errorMessage);
      }
    });
  }
  //9. Obtengo todos los registros - versión solo con registro estático
  showData():void {
    this.loading = true;

    // Crear un elemento estático con todas las propiedades necesarias
    const registroEstatico1: Expediente = {
      id: 0,
      tipo_canal: 0,
      tipo_expediente: 'Interno',
      codigo_expediente: 99998,
      tipo_reclamo: 'Queja',
      fecha: new Date(),
      evidencia: '',
      es_confidencial: 0,
      tipo_documento: 'DNI',
      numero_documento: '00000000',
      nombres: 'Juan',
      apellido_paterno: 'Miranda',
      apellido_materno: 'Dextre',
      genero: 'N/A',
      telefono: 0,
      celular: 0,
      email: 0,
      ubigeo: '1',
      direccion: 'Web',
      estado_proceso: 'EJEMPLO',
      contenido_consulta: 'Este es un registro estático solo para demostración',
      comunidad: 'N/A',
      cargo: 'N/A',
      usuario_id: 0,
      estado: 1, // Estado pendiente
      create_at: new Date(),
      update_at: new Date()
    };

    const registroEstatico2: Expediente = {
          id: 1, // ID único para identificarlo fácilmente
          tipo_canal: 0,
          tipo_expediente: 'EJEMPLO 2',
          codigo_expediente: 99999,
          tipo_reclamo: 'Demostración',
          fecha: new Date(),
          evidencia: '',
          es_confidencial: 0,
          tipo_documento: 'DNI',
          numero_documento: '00000000',
          nombres: 'Registro',
          apellido_paterno: 'Estático',
          apellido_materno: 'Demo',
          genero: 'N/A',
          telefono: 0,
          celular: 0,
          email: 0,
          ubigeo: '1',
          direccion: 'Av. Ejemplo 123',
          estado_proceso: 'EJEMPLO',
          contenido_consulta: 'Este es un registro estático solo para demostración',
          comunidad: 'N/A',
          cargo: 'N/A',
          usuario_id: 0,
          estado: 1,
          create_at: new Date(),
          update_at: new Date()
        };
        this.dataSource.data = [registroEstatico1, registroEstatico2];

    // Configurar paginator y sort (con un pequeño timeout para asegurar que se han inicializado)
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = this.createFilter();
      this.loading = false;
    });
  }
  //10. Función para filtrar información de la lista de datos
  filterData(event: Event, filterType: keyof typeof this.filterValues) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.filterValues[filterType] = filterValue;
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //11. Función para crear el filtro personalizado
  createFilter(): (data: Expediente, filter: string) => boolean {
    return (data: Expediente, filter: string): boolean => {
      const searchTerms = JSON.parse(filter);
      return (
        (searchTerms.codigoExpediente === '' || (data.codigo_expediente?.toString().toLowerCase() || '').includes(searchTerms.codigoExpediente)) &&
        (searchTerms.tipoReclamo === '' || (data.tipo_reclamo?.toLowerCase() || '').includes(searchTerms.tipoReclamo)) &&
        (searchTerms.procedencia === '' || (data.tipo_expediente?.toLowerCase() || '').includes(searchTerms.procedencia))
      );
    };
  }
  //12. Para cambiar el filtro de reclamo o procedencia
  changeFilter(filterType: keyof typeof this.filterValues, value: string) {
    this.filterValues[filterType] = value.trim().toLowerCase();
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //13. Método para resetear los filtros
  resetFilters() {
    this.filterValues = {
      codigoExpediente: '',
      tipoReclamo: '',
      procedencia: ''
    };
    this.dataSource.filter = JSON.stringify(this.filterValues);
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  //14. Obtengo la lista de Tipos de eventos
  showTipoReclamo():void{
    this._tipoReclamo.show().subscribe({
      next: (data) => {
        this.tipoReclamos = data;
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: "+ e;
        this._notificacion.showError("Error: ", this.errorMessage);
      }
    });
  }
  //15. Obtengo los tipos de Procedencia de los reclamos
  showTipoProcedencia():void{
    this._tipoProcedencia.show().subscribe({
      next: (data) => {
        this.tipoProcedencia = data;
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: "+ e;
        this._notificacion.showError("Error: ", this.errorMessage);
      }
    });
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

  verDetalle(row: Expediente): void {
    console.log('Ver detalle de:', row);
    // Implementa aquí la lógica para ver detalles
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
      console.log("Confirmar accion");
      this.cambiarPestania.emit('atendido');
    } else {
      this.cambiarPestania.emit('denegado');
    }
    this.cerrarModal();
  }
}
