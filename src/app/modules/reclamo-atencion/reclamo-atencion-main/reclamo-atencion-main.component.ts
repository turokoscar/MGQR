import {Component, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import { TipoReclamo } from 'src/app/models/tipo-reclamo';
import { TipoReclamoService } from 'src/app/services/tipo-reclamo.service';
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
import {ReclamoAtencionPendienteComponent} from "../reclamo-atencion-pendiente/reclamo-atencion-pendiente.component";
import {ReclamoAtencionProcesoComponent} from "../reclamo-atencion-proceso/reclamo-atencion-proceso.component";
import {ReclamoAtencionReasignadoComponent} from "../reclamo-atencion-reasignado/reclamo-atencion-reasignado.component";
import {ReclamoAtencionAtendidoComponent} from "../reclamo-atencion-atendido/reclamo-atencion-atendido.component";
import {TipoProyectoService} from "../../../services/tipo-proyecto.service";
import {TipoProyecto} from "../../../models/tipo-proyecto";
import { AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-reclamo-atencion-main',
  templateUrl: './reclamo-atencion-main.component.html',
  styleUrls: ['./reclamo-atencion-main.component.scss']
})
export class ReclamoAtencionMainComponent implements OnInit, AfterViewInit {
  loading: boolean = false;
  usuario_id: string = '';
  tipoReclamos: TipoReclamo[] = [];
  tipoProyectos: TipoProyecto[] = [];
  tipoProcedencia: TipoProcedenciaReclamo[] = [];
  deshabilitarProyecto: boolean = false;
  dataSource = new MatTableDataSource<Expediente>();
  pestaniaActiva: 'pendiente' | 'proceso' | 'atendidos' | 'reasignado' = 'pendiente';
  errorMessage: string = '';
  filtro = {
    tipoCanalId: 0,
    tipoReclamoId: 0,
    tipoProyectoId: 1,
    codigoExpediente: null,
    estado: null,
    usuarioId: '0',
    modulo: 2
  };

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild('reclamoPendientes') reclamoPendientes!: ReclamoAtencionPendienteComponent;
  @ViewChild('reclamoProceso') reclamoProceso!: ReclamoAtencionProcesoComponent;
  @ViewChild('reclamoReasignado') reclamoReasignado!: ReclamoAtencionReasignadoComponent;
  @ViewChild('reclamoAtendidos') reclamoAtendidos!: ReclamoAtencionAtendidoComponent;

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
  usuario = {
    nombre: localStorage.getItem('nombre_completo')?.toString(),
    dni: localStorage.getItem('dni')?.toString(),
    id: localStorage.getItem('id')?.toString(),
    rol: localStorage.getItem('rol')?.toString()  ?? 1,
    correo: localStorage.getItem('correo')?.toString()
  };
  //3. Inicializamos el componente
  ngOnInit(): void {
    this.showTipoReclamo();
    this.showTipoProyecto();
    this.showTipoProcedencia();
    this.validaUsuario();
    console.log("este usuario",this.usuario_id);
  }
  ngAfterViewInit(): void {
    // Aquí ya está disponible el ViewChild
    this.buscarConFiltros();
  }

  limpiarFiltros(): void {
      this.filtro = {
        tipoCanalId: 0,
        tipoReclamoId: 0,
        tipoProyectoId: this.filtro.tipoProyectoId,
        codigoExpediente: null,
        estado: null,
        usuarioId: this.usuario_id,
        modulo: 2
      };

      this.buscarConFiltros(); // Opcional: vuelve a cargar los expedientes sin filtros
  }

  buscarConFiltros() {

    const filtrosConEstado = {
      ...this.filtro,
      tipoReclamoId: this.filtro.tipoReclamoId === 0 ? null : this.filtro.tipoReclamoId,
      tipoCanalId: this.filtro.tipoCanalId === 0 ? null : this.filtro.tipoCanalId,
      tipoProyectoId:  this.filtro.tipoProyectoId === 0 ? null :  this.filtro.tipoProyectoId,
      usuarioId: this.usuario_id === '0' ? null : this.usuario_id,
      estado: this.pestaniaActiva === 'pendiente' ? 4 :
              this.pestaniaActiva === 'proceso' ? 5 :
              this.pestaniaActiva === 'atendidos' ? 6 :
              this.pestaniaActiva === 'reasignado' ? 7 : null
    };

    if (this.pestaniaActiva === 'pendiente') {
      this.reclamoPendientes.cargarExpedientes(filtrosConEstado);
    } else if (this.pestaniaActiva === 'proceso') {
      this.reclamoProceso.cargarExpedientes(filtrosConEstado);
    }else if (this.pestaniaActiva === 'atendidos') {
      this.reclamoAtendidos.cargarExpedientes(filtrosConEstado);
    } else if (this.pestaniaActiva === 'reasignado') {
      this.reclamoReasignado.cargarExpedientes(filtrosConEstado);
    }
  }

  activarPestaniaA(pestania: 'pendiente' | 'proceso' | 'atendidos' | 'reasignado') {
    this.pestaniaActiva = pestania; // 🔑 ACTUALIZAS ESTO PRIMERO

    // Activar visualmente la pestaña
    const tabIds = {
      pendiente: '#nav-home-tab',
      proceso: '#nav-profile-tab',
      atendidos: '#nav-contact-tab',
      reasignado: '#nav-reasignado-tab'
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
  validaUsuario():void{
    if(this.usuario.rol==="4" || this.usuario.rol==="5" || this.usuario.rol==="6"){
      this.usuario_id="0";
      this.filtro.tipoProyectoId=0;
      this.deshabilitarProyecto = false;
    }else{
      this.usuario_id=String(this.usuario.id);
      this.filtro.tipoProyectoId= +this.usuario.rol;
      this.deshabilitarProyecto = true;
    }
  }

}
