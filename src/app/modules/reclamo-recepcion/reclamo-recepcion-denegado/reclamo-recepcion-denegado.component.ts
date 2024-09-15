import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Expediente } from 'src/app/models/expediente';
import { TipoProcedenciaReclamo } from 'src/app/models/tipo-procedencia-reclamo';
import { TipoReclamo } from 'src/app/models/tipo-reclamo';
import { AuthService } from 'src/app/services/auth.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { NotificationService } from 'src/app/services/notification.service';
import { TipoProcedenciaReclamoService } from 'src/app/services/tipo-procedencia-reclamo.service';
import { TipoReclamoService } from 'src/app/services/tipo-reclamo.service';

@Component({
  selector: 'app-reclamo-recepcion-denegado',
  templateUrl: './reclamo-recepcion-denegado.component.html',
  styleUrls: ['./reclamo-recepcion-denegado.component.scss']
})
export class ReclamoRecepcionDenegadoComponent implements OnInit {
 //1. Generamos las variables iniciales
 loading: boolean = false;
 columnas: string[] = ['select','numero', 'procedencia', 'tipo', 'fecha',  'descripcion', 'usuario', 'ubigeo'];
 dataSource = new MatTableDataSource<Expediente>();
 selection = new SelectionModel<Expediente>(true, []);
 tipoReclamos: TipoReclamo[] = [];
 tipoProcedencia: TipoProcedenciaReclamo[] = [];
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
   private _tipoProcedencia: TipoProcedenciaReclamoService
 ){}
 //3. Inicializamos el componente
 ngOnInit(): void {
   this.showData();
   this.showTipoReclamo();
   this.showTipoProcedencia();
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
 //9. Obtengo todos los registros
 showData():void{
   this.loading = true;
   const estadoAtendido = 1;
   this._apiService.show(estadoAtendido).subscribe({
     next: (data) => {
       this.dataSource.data = data;
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
 //17. Mostramos un registro
 view(): void{

 }
}
