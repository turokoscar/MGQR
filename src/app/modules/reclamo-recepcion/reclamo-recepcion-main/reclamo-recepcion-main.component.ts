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
  errorMessage: string = '';
  filtro = {
    tipoCanalId: 0,
    tipoReclamoId: 0,
    tipoProyectoId: 0,
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
      tipoProyectoId: 0,
      codigoExpediente: null,
      estado: null
    };

    this.buscarConFiltros(); // Opcional: vuelve a cargar los expedientes sin filtros
}

  buscarConFiltros() {
    const filtrosConEstado = {
      ...this.filtro,
      tipoReclamoId: this.filtro.tipoReclamoId === 0 ? null : this.filtro.tipoReclamoId,
      tipoCanalId: this.filtro.tipoCanalId === 0 ? null : this.filtro.tipoCanalId,
      tipoProyectoId: this.filtro.tipoProyectoId === 0 ? null : this.filtro.tipoProyectoId,
      estado: 1 // Estado pendiente
    };
    this.reclamoPendiente.cargarExpedientes(filtrosConEstado);
  }

  activarPestania(pestania: 'atendido' | 'denegado') {
    console.log('Cambio de pestaña a:', pestania);

    const filtrosConEstado = {
      ...this.filtro,
      tipoReclamoId: this.filtro.tipoReclamoId === 0 ? null : this.filtro.tipoReclamoId,
      tipoCanalId: this.filtro.tipoCanalId === 0 ? null : this.filtro.tipoCanalId,
      tipoProyectoId: this.filtro.tipoProyectoId === 0 ? null : this.filtro.tipoProyectoId,
      estado: pestania === 'atendido' ? 2 : (pestania === 'denegado' ? 3 : null)
    };

    if (pestania === 'atendido') {
      this.reclamoAtendido.cargarExpedientes(filtrosConEstado);
    } else if (pestania === 'denegado') {
      this.reclamoDenegado.cargarExpedientes(filtrosConEstado);
    }
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
