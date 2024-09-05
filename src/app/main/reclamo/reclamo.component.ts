import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.scss']
})
export class ReclamoComponent implements OnInit {
  //1. Declaro las variables a utilizar
  primeraParteForm!: FormGroup;
  segundaParteForm!: FormGroup;
  showEmailField = false;
  disabled = false;

  //2. Inicializo el constructor
  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificationService
  ){}

  //3. Inicializo el componente
  ngOnInit(): void {
    this.showPrimerForm();
    this.showSegundoForm();
    // Observa cambios en la variable disabled
    this.onToggleConfidentiality();
  }

  //4. Estructuro la primera parte del formulario
  private showPrimerForm():void{
    this.primeraParteForm = this.fb.group({
      tipo_persona: ['', Validators.required],
      email_institucional: ['']
    })
  }

  //5. Estructuro la segunda parte del formulario
  private showSegundoForm():void{
    this.segundaParteForm = this.fb.group({
      tipo_documento: [{ value: '', disabled: false }, Validators.required],
      numero_documento: [{ value: '', disabled: false }, Validators.required],
      genero: ['', Validators.required],
      nombre: [{ value: '', disabled: false }, Validators.required],
      apellido_paterno: [{ value: '', disabled: false }, Validators.required],
      apellido_materno: [{ value: '', disabled: false }, Validators.required],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', Validators.required],
      numero_telefono: [''],
      numero_celular: [''],
      correo_electronico: ['', Validators.required],
      comunidad: ['', Validators.required],
      cargo: ['', Validators.required],
      tipo_consulta: ['', Validators.required],
      contenido_consulta: ['', Validators.required],
      evidencia_consulta: ['']
    });
  }

  onTipoPersonaChange(event: any) {
    this.showEmailField = event.value === '1';
  }

  onToggleConfidentiality(): void {
    // Deshabilita o habilita los campos según el valor de disabled
    if (this.disabled) {
      this.segundaParteForm.controls['tipo_documento'].disable();
      this.segundaParteForm.controls['numero_documento'].disable();
      this.segundaParteForm.controls['nombre'].disable();
      this.segundaParteForm.controls['apellido_paterno'].disable();
      this.segundaParteForm.controls['apellido_materno'].disable();
    } else {
      this.segundaParteForm.controls['tipo_documento'].enable();
      this.segundaParteForm.controls['numero_documento'].enable();
      this.segundaParteForm.controls['nombre'].enable();
      this.segundaParteForm.controls['apellido_paterno'].enable();
      this.segundaParteForm.controls['apellido_materno'].enable();
    }
  }

  // Método que se ejecuta cuando cambia el checkbox de confidencialidad
  activaConfidencialidad(): void {
    this.disabled = !this.disabled; // Cambia el estado de confidencialidad
    this.onToggleConfidentiality();  // Aplica la lógica de activación/desactivación
  }

  onSubmit():void{
    this._notificacion.showSuccess('Mensaje de información', 'Su Ficha MGQR se registró exitosamente., así mismo se envío la confirmación al correo : info@gmail.com');
    console.log("Su Ficha fue generada correctamente");
  }
}
