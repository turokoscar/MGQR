import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Expediente } from 'src/app/models/expediente';
import { AuthService } from 'src/app/services/auth.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-reclamo-recepcion-pendiente',
  templateUrl: './reclamo-recepcion-pendiente.component.html',
  styleUrls: ['./reclamo-recepcion-pendiente.component.scss']
})
export class ReclamoRecepcionPendienteComponent implements OnInit {
  //1. Generamos las variables iniciales
  loading: boolean = false;
  columnas: string[] = ['select','numero', 'fecha', 'tipo', 'descripcion', 'usuario', 'ubigeo'];
  dataSource = new MatTableDataSource<Expediente>();
  selection = new SelectionModel<Expediente>(true, []);
  id!: number;
  numeroSeleccion!: number;
  textoFiltro:string = '';
  errorMessage: string = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  //2. Inicializamos las variables en el constructor
  constructor(
    private _apiService: ExpedienteService,
    private _notificacion: NotificationService,
    private _login: AuthService,
    private router: Router,
    private aRoute: ActivatedRoute
  ){}

  //3. Inicializamos el componente
  ngOnInit(): void {
    this.showData();
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
    const estadoPendiente = 1;
    this._apiService.show(estadoPendiente).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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
  filterData(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }
  //11. Eliminamos un registro
  delete():void{

  }
  //12. Editamos un registro
  edit(): void{

  }
}
