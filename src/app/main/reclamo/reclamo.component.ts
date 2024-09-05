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

  //2. Inicializo el constructor
  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificationService
  ){}

  //3. Inicializo el componente
  ngOnInit(): void {
    this.showPrimerForm();
    this.showSegundoForm();
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
      tipo_documento: ['', Validators.required],
      numero_documento: ['', [Validators.required]],
      genero: ['', Validators.required],
      nombre: ['', [Validators.required, Validators.maxLength(100)]],
      apellido_paterno: ['', [Validators.required, Validators.maxLength(100)]],
      apellido_materno: ['', [Validators.required, Validators.maxLength(100)]],
      departamento: ['', Validators.required],
      provincia: ['', Validators.required],
      distrito: ['', Validators.required],
      direccion: ['', [Validators.required, Validators.maxLength(255)]],
      numero_telefono: [''],
      numero_celular: [''],
      correo_electronico: ['', [Validators.required, Validators.email]],
      comunidad: ['', [Validators.required, Validators.maxLength(255)]],
      cargo: ['', Validators.required],
      tipo_consulta: ['', Validators.required],
      contenido_consulta: ['', [Validators.required, Validators.maxLength(500)]],
      evidencia_consulta: ['']
    })
  }

  onTipoPersonaChange(event: any) {
    this.showEmailField = event.value === '1';
  }

  onSubmit():void{
    this._notificacion.showSuccess('Mensaje de información', 'Su Ficha MGQR se registró exitosamente., así mismo se envío la confirmación al correo : info@gmail.com');
    console.log("Su Ficha fue generada correctamente");
  }
}
