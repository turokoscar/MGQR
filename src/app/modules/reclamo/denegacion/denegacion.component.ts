import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpedienteSeguimientoManagement } from 'src/app/models/expediente-seguimiento/expediente-seguimiento-management';
import { ExpedienteManagement } from 'src/app/models/expediente/expediente-management';
import { AlertService } from 'src/app/services/alert.service';
import { ExpedienteSeguimientoService } from 'src/app/services/expediente-seguimiento.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-denegacion',
  templateUrl: './denegacion.component.html',
  styleUrls: ['./denegacion.component.scss']
})
export class DenegacionComponent implements OnInit {
  loading: boolean = false;
  form!: FormGroup;
  id!: number;
  errorMessage: string = "";
  estado_denegado: number = 2;
  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificationService,
    private _router: Router,
    private _aRoute: ActivatedRoute,
    private _expediente: ExpedienteService,
    private _usuario: UsuarioService,
    private _seguimiento: ExpedienteSeguimientoService,
    private _alerta: AlertService
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
      reclamo: [''],
      comentarios: ['', [Validators.maxLength(500), Validators.required]]
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
  //4. Procesamos el formulario
  onSubmit():void{
    const expediente: ExpedienteManagement = {
      id: this.id,
      estado_proceso_id: this.estado_denegado,
      usuario_id: 1
    }
    this.updateExpediente(expediente);
  }
  //5. Actualizamos la información del expediente
  private updateExpediente(expediente: ExpedienteManagement):void{
    this.loading = true;
    const expedienteId = expediente.id ?? 0;
    this._expediente.update(expediente).subscribe({
      next: (data) => {
        this.storeExpedienteSeguimiento(expedienteId);
        this.loading = false;
        const title = 'Mensaje de notificacion';
        const html = `El item a sido denegado con éxito. Se notificó al titular de la queja o reclamo.`;
        this._alerta.showAlert(title, html);
        this._router.navigate(['recepcion']);
      },
      error: (e) => this.handleErrorResponse(e)
    });
  }
  //6. Generamos un nuevo registro en la tabla seguimiento
  private storeExpedienteSeguimiento(expedienteId: number):void{
    const seguimiento: ExpedienteSeguimientoManagement = {
      expediente_id: expedienteId,
      usuario_origen_id: 1, //Aqui debemos traer del token de inicio de sesion el id del usuario
      fecha_asignacion: new Date, //Definir de donde se trae esta fecha
      usuario_id: 1, //Aqui debemos traer del token de inicio de sesion el id del usuario
      fecha_recepcion: new Date, //Definir de donde se trae esta fecha
      acciones_realizadas: this.form.value.comentarios,
      fecha_atencion: new Date, //Definir de donde se trae esta fecha
      estado_proceso_id: this.estado_denegado
    }
    this._seguimiento.store(seguimiento).subscribe({
      error: (e) => this.handleErrorResponse(e)
    });
  }
  //7. Manejo de errores reutilizable
  private handleErrorResponse(error: any): void {
    this.loading = false;
    this.errorMessage = `Se presentó un problema: ${error}`;
    this._notificacion.showError('Error:', this.errorMessage);
  }
}
