import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Usuario } from 'src/app/models/usuario/usuario';
import { AlertService } from 'src/app/services/alert.service';
import { ExpedienteSeguimientoService } from 'src/app/services/expediente-seguimiento.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-visualizacion',
  templateUrl: './visualizacion.component.html',
  styleUrls: ['./visualizacion.component.scss']
})
export class VisualizacionComponent implements OnInit {
  loading: boolean = false;
  form!: FormGroup;
  id!: number;
  errorMessage: string = "";
  especialistas: Usuario[] = [];
  estado_recepcionado: number = 1;
  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificationService,
    private _router: Router,
    private _aRoute: ActivatedRoute,
    private _expediente: ExpedienteService,
    private _usuario: UsuarioService,
    private _seguimiento: ExpedienteSeguimientoService,
    private _alerta: AlertService,
    private location: Location
  ){
    this.id = Number(this._aRoute.snapshot.paramMap.get('id'));
  }
  //1. Inicializo el componente
  ngOnInit(): void {
    if (!isNaN(this.id) && this.id !== 0) {
      this.showItem(this.id);
    }
    this.initForm();
  }
  //2. Genero el formulario
  private initForm():void{
    this.form = this.fb.group({
      codigo_expediente: [''],
      fecha_registro: [''],
      tipo_reclamo: [''],
      numero_documento: [''],
      nombre: [''],
      reclamo: ['']
    })
  }
  //3. Muestro los datos del expediente en el formulario
  private showItem(id: number):void{
    this.loading = true;
    this._expediente.showById(id).subscribe({
      next: (expediente) => {
        this.loading = false;
        this.form.patchValue({
          codigo_expediente: expediente.codigo_expediente,
          fecha_registro: expediente.fecha,
          tipo_reclamo: expediente.tipo_reclamo,
          numero_documento: expediente.numero_documento,
          nombre: expediente.nombres+' '+expediente.apellido_paterno+' '+expediente.apellido_materno,
          reclamo: expediente.contenido_consulta
        });
      },
      error: (e) => this.handleErrorResponse(e)
    });
  }
  //4. Manejo de errores reutilizable
  private handleErrorResponse(error: any): void {
    this.loading = false;
    this.errorMessage = `Se presentó un problema: ${error}`;
    this._notificacion.showError('Error:', this.errorMessage);
  }
  //5. Retorno a la pagina anterior
  retornar(): void {
    this.location.back();
  }
}
