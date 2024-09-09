import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { DialogComponent } from 'src/app/components/dialog/dialog.component';


import { Distrito } from 'src/app/models/distrito';
import { Provincia } from 'src/app/models/provincia';
import { Region } from 'src/app/models/region';
import { TipoAtencion } from 'src/app/models/tipo-atencion';
import { TipoDocumento } from 'src/app/models/tipo-documento';
import { TipoReclamo } from 'src/app/models/tipo-reclamo';


import { NotificationService } from 'src/app/services/notification.service';
import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
import { TipoReclamoService } from 'src/app/services/tipo-reclamo.service';
import { TipoAtencionService } from 'src/app/services/tipo-atencion.service';
import { UbigeoService } from 'src/app/services/ubigeo.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { ExpedienteResponse } from 'src/app/models/expediente-response';

@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.scss']
})
export class ReclamoComponent implements OnInit {
  //1. Declaro las variables a utilizar
  primeraParteForm!: FormGroup;
  segundaParteForm!: FormGroup;

  
  tipoAtencion: TipoAtencion[] = [];
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
    private dialog: MatDialog,
    private _notificacion: NotificationService,
    private _tipoDocumento: TipoDocumentoService,
    private _tipoAtencion: TipoAtencionService,
    private _tipoReclamo: TipoReclamoService,
    private _ubigeo: UbigeoService,
    private _expediente: ExpedienteService,
    private router: Router
  ){}
  //3. Inicializo el componente
  ngOnInit(): void {
    this.showPrimerForm();
    this.showSegundoForm();
    this.showTipoAtencion();
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
      numero_celular: ['', [Validators.required, Validators.maxLength(9)]],
      correo_electronico: ['', Validators.required],
      comunidad: ['', Validators.required],
      cargo: ['', Validators.required],
      tipo_consulta: ['', Validators.required],
      contenido_consulta: ['', Validators.required],
      evidencia_consulta: [''],
      es_confidencial:['0']
    });
  }



  //6. Obtengo la lista de tipo de Atencion
  private showTipoAtencion(): void{
    this._tipoAtencion.show().subscribe({
      next: (data) => {
        this.tipoAtencion = data;
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: "+ e;
        this._notificacion.showError("Error: ", this.errorMessage);
      }
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
  //11. Genero un evento onchange para mostrar u ocultar el input de email
  onTipoPersonaChange(event: any) {
    this.showEmailField = event.value == '1';
  }
  //12. Deshabilita o habilita los campos según el valor del input Checkbox
  private onActivaReactividad(): void {
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
  //13. Método que se ejecuta cuando cambia el checkbox de confidencialidad
  activaConfidencialidad(): void {
    this.disabled = !this.disabled;
    this.onActivaReactividad();
  }
  //14. Proceso el formulario
  onSubmit():void{
    const formData = {
      form1: this.primeraParteForm.value,
      form2: this.segundaParteForm.value
    };
    localStorage.setItem('formData', JSON.stringify(formData));
   
    let param = {
      //("perTipDoc": ""+ 1,
      "tipo_canal": "1",
      "tipo_expediente": ""+this.primeraParteForm.value.tipo_persona,
      "tipo_reclamo_id": ""+this.segundaParteForm.value.tipo_consulta,
      "es_confidencial": ""+(this.segundaParteForm.value.es_confidencial==true,1,0),
      "tipo_documento_id": ""+this.segundaParteForm.value.tipo_documento,
      "numero_documento": ""+this.segundaParteForm.value.numero_documento,
      "genero": ""+this.segundaParteForm.value.genero,
      "nombre": ""+this.segundaParteForm.value.nombre,
      "apellido_paterno": ""+this.segundaParteForm.value.apellido_paterno,
      "apellido_materno": ""+this.segundaParteForm.value.apellido_materno,
      "ubigeo_id": ""+this.segundaParteForm.value.distrito,
      "direccion": ""+this.segundaParteForm.value.direccion,
      "telefono": ""+this.segundaParteForm.value.numero_telefono,
      "celular": ""+this.segundaParteForm.value.numero_celular,
      "email": ""+this.segundaParteForm.value.correo_electronico,
      "contenido_consulta": ""+this.segundaParteForm.value.contenido_consulta,
      "comunidad": ""+this.segundaParteForm.value.comunidad,
      "cargo": ""+this.segundaParteForm.value.cargo,
      "usuario_id": "1"
      
      
      //  "perReferencia": ""+this.segundaParteForm.value.evidencia_consulta
     }
     
     console.log(formData);

     this._expediente.guardar(param).subscribe({
      next: (data) => {
        if(data.id==0){
          this.openDialog();
          this.router.navigate(['../home']);
        }
         
      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: " + e;
      }
    });
  
}
    


  //15. Mostramos un cuadro de dialogo
  openDialog(): void {
    this.dialog.open(DialogComponent, {
      data: {
        title: 'Mensaje de información',
        message: 'Se registro exitosamente, así mismo se envió la confirmación a su correo personal'
      }
    });
  }
  //16. Establesco un valor por default para el boton guardar del formulario
  isFormValid(): boolean {
    return this.primeraParteForm.valid && this.segundaParteForm.valid;
  }
}
