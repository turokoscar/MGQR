import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Distrito } from 'src/app/models/distrito';
import { Provincia } from 'src/app/models/provincia';
import { Region } from 'src/app/models/region';
import { TipoDocumento } from 'src/app/models/tipo-documento';
import { TipoReclamo } from 'src/app/models/tipo-reclamo';
import { NotificationService } from 'src/app/services/notification.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { TipoReclamoService } from 'src/app/services/tipo-reclamo.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';

@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.scss']
})
export class ReclamoComponent implements OnInit {
  //1. Declaro las variables a utilizar
  primeraParteForm!: FormGroup;
  segundaParteForm!: FormGroup;
  tipoDocumentos: TipoDocumento[] = [];
  tipoReclamos: TipoReclamo[] = [];
  regiones: Region[] = [];
  provincias: Provincia[] = [];
  distritos: Distrito[] = [];
  showEmailField = false;
  disabled = false;
  errorMessage: string = "";

  //2. Inicializo el constructor
  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificationService,
    private _tipoDocumento: TipoDocumentoService,
    private _tipoReclamo: TipoReclamoService,
    private _ubigeo: UbigeoService
  ){}
  //3. Inicializo el componente
  ngOnInit(): void {
    this.showPrimerForm();
    this.showSegundoForm();
    this.showTipoDocumentos();
    this.showTipoReclamos();
    this.showRegiones();
    // Observa cambios en la variable disabled
    this.onActivaReactividad();
    this.segundaParteForm.get('departamento')?.valueChanges.subscribe(region => {
      if (region) {
        this.showProvincias(region);
        this.segundaParteForm.get('provincia')?.enable();
      } else {
        this.segundaParteForm.get('provincia')?.disable();
        this.segundaParteForm.get('distrito')?.disable();
      }
    });
    this.segundaParteForm.get('provincia')?.valueChanges.subscribe(provincia => {
      if (provincia) {
        this.showDistritos(provincia);
        this.segundaParteForm.get('distrito')?.enable();
      } else {
        this.segundaParteForm.get('distrito')?.disable();
      }
    });
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
      provincia: [ { value: '', disabled: true} , Validators.required],
      distrito: [ { value: '', disabled: true} , Validators.required],
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
  //6. Obtengo la lista de documentos
  private showTipoDocumentos(): void{
    this._tipoDocumento.show().subscribe({
      next: (data) => {
        this.tipoDocumentos = data;
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: "+ e;
        this._notificacion.showError("Error: ", this.errorMessage);
      }
    });
  }
  //7. Obtengo los tipos de reclamos
  private showTipoReclamos(): void{
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
  //8. Obtengo la lista de regiones
  showRegiones(){
    const filtro = 0;
    this._ubigeo.showRegiones(filtro).subscribe({
      next: (data) => {
        this.regiones = Array.isArray(data) ? data : [data];
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: " + e;
      }
    });
  }
  //9. Muestro las provincias de una region
  showProvincias(region: string){
    this._ubigeo.showProvincias(region).subscribe({
      next: (data) => {
        this.provincias = Array.isArray(data) ? data: [data];
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: " + e;
      }
    });
  }
  //10. Muestro los distritos de una provincia
  showDistritos(provincia: string){
    this._ubigeo.showDistritos(provincia).subscribe({
      next: (data) => {
        this.distritos = Array.isArray(data) ? data: [data];
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: " + e;
      }
    });
  }









  onTipoPersonaChange(event: any) {
    this.showEmailField = event.value === '1';
  }

  onActivaReactividad(): void {
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
    this.onActivaReactividad();  // Aplica la lógica de activación/desactivación
  }

  onSubmit():void{
    this._notificacion.showSuccess('Mensaje de información', 'Su Ficha MGQR se registró exitosamente., así mismo se envío la confirmación al correo : info@gmail.com');
    console.log("Su Ficha fue generada correctamente");
  }
}
