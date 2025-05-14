import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { TipoReclamo } from 'src/app/models/tipo-reclamo';
import { TipoReclamoService } from 'src/app/services/tipo-reclamo.service';
import { TipoProyecto } from 'src/app/models/tipo-proyecto';
import { TipoProyectoService } from 'src/app/services/tipo-proyecto.service';
import { TipoProcedenciaReclamo } from 'src/app/models/tipo-procedencia-reclamo';
import { TipoProcedenciaReclamoService } from 'src/app/services/tipo-procedencia-reclamo.service';
import {ExpedienteService} from "../../../services/expediente.service";
import {NotificationService} from "../../../services/notification.service";
import {AuthService} from "../../../services/auth.service";
import {ExportService} from "../../../services/export.service";
import { Router, ActivatedRoute } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import {Expediente} from "../../../models/expediente";
import {ReclamoRecepcionPendienteComponent} from "../reclamo-recepcion-pendiente/reclamo-recepcion-pendiente.component";
import {ReclamoRecepcionAtendidoComponent} from "../reclamo-recepcion-atendido/reclamo-recepcion-atendido.component";
import {ReclamoRecepcionDenegadoComponent} from "../reclamo-recepcion-denegado/reclamo-recepcion-denegado.component";
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-reclamo-recepcion-main',
  templateUrl: './reclamo-recepcion-main.component.html',
  styleUrls: ['./reclamo-recepcion-main.component.scss']
})
export class ReclamoRecepcionMainComponent implements OnInit, AfterViewInit {
  loading: boolean = false;
  tipoReclamos: TipoReclamo[] = [];
  tipoProyectos: TipoProyecto[] = [];
  tipoProcedencia: TipoProcedenciaReclamo[] = [];
  dataSource = new MatTableDataSource<Expediente>();
  pestaniaActiva: 'pendiente' | 'atendido' | 'denegado' = 'pendiente';
  errorMessage: string = '';

  tipo_filtro_id:number=0;
  
  

  filtro = {
    tipoCanalId: 0,
    tipoReclamoId: 0,
    tipoProyectoId: 1,
    codigoExpediente: null,
    estado: null
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('reclamoPendiente') reclamoPendiente!: ReclamoRecepcionPendienteComponent;
  @ViewChild('reclamoAtendido') reclamoAtendido!: ReclamoRecepcionAtendidoComponent;
  @ViewChild('reclamoDenegado') reclamoDenegado!: ReclamoRecepcionDenegadoComponent;

  constructor(
    private _apiService: ExpedienteService,
    private _notificacion: NotificationService,
    private _login: AuthService,
    private router: Router,
    private aRoute: ActivatedRoute,
    private _tipoReclamo: TipoReclamoService,
    private _tipoProyecto: TipoProyectoService,
    private _tipoProcedencia: TipoProcedenciaReclamoService,
    private exportService: ExportService
  ){}
  //3. Inicializamos el componente
  ngOnInit(): void {
    this.showTipoReclamo();
    this.showTipoProyecto();
    this.showTipoProcedencia();
  }

  ngAfterViewInit(): void {
    // Aquí ya está disponible el ViewChild
    this.buscarConFiltros();
  }

  limpiarFiltros(): void {
    this.filtro = {
      tipoCanalId: 0,
      tipoReclamoId: 0,
      tipoProyectoId:1,
      codigoExpediente: null,
      estado: null
    };

    this.buscarConFiltros(); // Opcional: vuelve a cargar los expedientes sin filtros
}

  buscarConFiltros() {

    var rol_id=localStorage.getItem('rol');

    if(rol_id=="1"){
      this.tipo_filtro_id=1;
    }
    else if(rol_id=="2"){
      this.tipo_filtro_id=2;
    }
    else if(rol_id=="4"){
      this.tipo_filtro_id=0;
    }
    else if(rol_id=="5"){
      this.tipo_filtro_id=0;
    }
    else if(rol_id=="6"){
      this.tipo_filtro_id=0;
    }
  
    const filtrosConEstado = {
      ...this.filtro,
      tipoReclamoId: this.filtro.tipoReclamoId === 0 ? null : this.filtro.tipoReclamoId,
      tipoCanalId: this.filtro.tipoCanalId === 0 ? null : this.filtro.tipoCanalId,
      tipoProyectoId:  this.filtro.tipoProyectoId === 0 ? null :  this.tipo_filtro_id,
      //tipoProyectoId:  this.tipo_filtro_id,
      
      estado: this.pestaniaActiva === 'pendiente' ? 1 :
              this.pestaniaActiva === 'atendido' ? 2 :
              this.pestaniaActiva === 'denegado' ? 3 : null
    };

    if (this.pestaniaActiva === 'pendiente') {
      this.reclamoPendiente.cargarExpedientes(filtrosConEstado);
    } else if (this.pestaniaActiva === 'atendido') {
      this.reclamoAtendido.cargarExpedientes(filtrosConEstado);
    } else if (this.pestaniaActiva === 'denegado') {
      this.reclamoDenegado.cargarExpedientes(filtrosConEstado);
    }
  }

  activarPestania(pestania: 'pendiente' | 'atendido' | 'denegado') {
    this.pestaniaActiva = pestania; // 🔑 ACTUALIZAS ESTO PRIMERO

    // Activar visualmente la pestaña
    const tabIds = {
      pendiente: '#nav-home-tab',
      atendido: '#nav-profile-tab',
      denegado: '#nav-contact-tab'
    };

    const tab = document.querySelector(tabIds[pestania]!) as HTMLElement;
    if (tab) {
      tab.click(); // cambia visualmente
    }

    // 🧠 Esperar al DOM para actualizar y luego filtrar
    setTimeout(() => {
      this.buscarConFiltros(); // ahora sí busca correctamente
    }, 300);
  }




  showTipoReclamo():void{
    this._tipoReclamo.show().subscribe({
      next: (data) => {
        this.tipoReclamos = [
          { id: 0, descripcion: 'TODOS' }, // <-- Añadido manualmente
          ...data
        ];
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: "+ e;
        this._notificacion.showError("Error: ", this.errorMessage);
      }
    });
  }
  showTipoProyecto():void{
    this._tipoProyecto.show().subscribe({
      next: (data) => {
        this.tipoProyectos = [
          { id: 0, descripcion: 'TODOS' }, // <-- Añadido manualmente
          ...data
        ];
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
        this.tipoProcedencia = [
          { id: 0, descripcion: 'TODOS' }, // <-- Añadido manualmente
          ...data
        ];
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: "+ e;
        this._notificacion.showError("Error: ", this.errorMessage);
      }
    });
  }

}
