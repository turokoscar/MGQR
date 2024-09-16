import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ExpedienteSeguimientoManagement } from 'src/app/models/expediente-seguimiento/expediente-seguimiento-management';
import { ExpedienteManagement } from 'src/app/models/expediente/expediente-management';
import { Usuario } from 'src/app/models/usuario/usuario';
import { AlertService } from 'src/app/services/alert.service';
import { ExpedienteSeguimientoService } from 'src/app/services/expediente-seguimiento.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { NotificationService } from 'src/app/services/notification.service';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-atencion',
  templateUrl: './atencion.component.html',
  styleUrls: ['./atencion.component.scss']
})
export class AtencionComponent implements OnInit {
  loading: boolean = false;
  form!: FormGroup;
  id!: number;
  errorMessage: string = "";
  especialistas: Usuario[] = [];
  estado_atendido: number = 2;
  showEspecialista: boolean = true;
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
    this.showPersonal();
    this.onCulminaAtencionChange({ value: this.form.value.culmina_atencion });
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
      respuesta: ['', [Validators.required, Validators.maxLength(500)]],
      comentarios: ['', Validators.maxLength(500)],
      culmina_atencion: ['', Validators.required],
      especialista: ['', Validators.required],
      evidencia_respuesta: ['']
    })
  }
  //3. Muestro la relacion del personal
  private showPersonal():void{
    this._usuario.show().subscribe({
      next: (data) => {
        this.especialistas = Array.isArray(data) ? data: [data];
      },
      error: (e) => this.handleErrorResponse(e)
    });
  }
  //4. Muestro los datos del expediente en el formulario
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
  //5. Procesamos el formulario
  onSubmit():void{
    const culminaAtencionValue = this.form.value.culmina_atencion;
    const usuario_id = culminaAtencionValue === '0'
    ? this.form.value.especialista
    : 1;//Obtener el valor de usuario desde el token de inicio de sesion
    const expediente: ExpedienteManagement = {
      id: this.id,
      estado_proceso_id: this.estado_atendido,
      usuario_id: usuario_id
    }
    this.updateExpediente(expediente);
  }
  //6. Actualizamos la información del expediente
  private updateExpediente(expediente: ExpedienteManagement):void{
    this.loading = true;
    const expedienteId = expediente.id ?? 0;
    this._expediente.update(expediente).subscribe({
      next: (data) => {
        this.storeExpedienteSeguimiento(expedienteId);
        this.loading = false;
        const title = 'Mensaje de notificacion';
        const html = `El item a sido atendido con éxito. Se notificó al titular de la queja o reclamo.`;
        this._alerta.showAlert(title, html);
        this._router.navigate(['atencion']);
      },
      error: (e) => this.handleErrorResponse(e)
    });
  }
  //7. Generamos un nuevo registro en la tabla seguimiento
  private storeExpedienteSeguimiento(expedienteId: number):void{
    const seguimiento: ExpedienteSeguimientoManagement = {
      expediente_id: expedienteId,
      usuario_origen_id: 1, //Aqui debemos traer del token de inicio de sesion el id del usuario
      fecha_asignacion: new Date, //Definir de donde se trae esta fecha
      usuario_id: this.form.value.especialista,
      fecha_recepcion: new Date, //Definir de donde se trae esta fecha
      acciones_realizadas: this.form.value.respuesta,
      evidencia: this.form.value.evidencia_respuesta,
      fecha_atencion: new Date, //Definir de donde se trae esta fecha
      estado_proceso_id: this.estado_atendido
    }
    this._seguimiento.store(seguimiento).subscribe({
      error: (e) => this.handleErrorResponse(e)
    });
  }
  //8. Manejo de errores reutilizable
  private handleErrorResponse(error: any): void {
    this.loading = false;
    this.errorMessage = `Se presentó un problema: ${error}`;
    this._notificacion.showError('Error:', this.errorMessage);
  }
  //9. Método que se ejecuta cuando cambia la selección de culmina_atencion
  onCulminaAtencionChange(event: any): void {
    const culminaAtencionValue = event.value;
    this.showEspecialista = culminaAtencionValue === '0';
    if (!this.showEspecialista) {
      this.form.controls['especialista'].setValue('');
      this.form.controls['especialista'].clearValidators();
    } else {
      this.form.controls['especialista'].setValidators([Validators.required]);
    }
    this.form.controls['especialista'].updateValueAndValidity();
  }
}
