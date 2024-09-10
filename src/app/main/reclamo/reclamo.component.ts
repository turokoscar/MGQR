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

import { ToastrService } from 'ngx-toastr';

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
  disabled: boolean = false;
  errorMessage: string = "";

 /******carga de imagen inicio */
 ArchivoSeleccionados: string = 'Sin imagen seleccionada';
 nombreArchivoSeleccionado: string = '';
//  urlPrevisualizacion: string | ArrayBuffer | null = '';



  //2. Inicializo el constructor
  constructor(
    private toastr: ToastrService,
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
    this.segundaParteForm.get('es_confidencial')?.valueChanges.subscribe(value => {
      this.activaConfidencialidad();
    });
    this.primeraParteForm.get('email_institucional')?.valueChanges.subscribe(value => {
      this.segundaParteForm.get('correo_electronico')?.setValue(value, { emitEvent: false });
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
      numero_documento: [{ value: '', disabled: false },
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.maxLength(15)]
      ],
      genero: ['', Validators.required],
      nombre: [{ value: '', disabled: false },
        [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$'), Validators.maxLength(100)]
      ],
      apellido_paterno: [{ value: '', disabled: false },
        [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$'), Validators.maxLength(100)]
      ],
      apellido_materno: [{ value: '', disabled: false },
        [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$'), Validators.maxLength(100)]
      ],
      departamento: ['', Validators.required],
      provincia: [ { value: '', disabled: true} , Validators.required],
      distrito: [ { value: '', disabled: true} , Validators.required],
      direccion: ['', Validators.required],
      numero_telefono: ['',
        [Validators.pattern('^[0-9]*$'), Validators.maxLength(15)]
      ],
      numero_celular: ['',
        [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(9), Validators.maxLength(9)]
      ],
      correo_electronico: ['', [Validators.required, Validators.email, Validators.maxLength(100)]],
      comunidad: ['', Validators.required],
      cargo: ['',
        [Validators.required, Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$'), Validators.maxLength(100)]
      ],
      tipo_consulta: ['', Validators.required],
      contenido_consulta: ['',
        [Validators.required, Validators.maxLength(500)]
      ],
      evidencia_consulta: [''],
      es_confidencial: [false]
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
    const emailControl = this.primeraParteForm.get('email_institucional');
    if (event.value == '1') {
      this.showEmailField = true;
      emailControl?.setValidators([Validators.required, Validators.email]);
    } else {
      this.showEmailField = false;
      emailControl?.clearValidators();
    }
    emailControl?.updateValueAndValidity();
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
    this.disabled = this.segundaParteForm.get('es_confidencial')?.value || false;
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
      "nombres": ""+this.segundaParteForm.value.nombre,
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
      next: (data:ExpedienteResponse) => {
        console.log(data);
        if(data.id!=0){
          this.openDialog(data.expediente);
          this.router.navigate(['../home']);
        }

      },
      error: (e) => {
        this.errorMessage = "Se presentó un problema al realizar la operación: " + e;
      }
    });

}



  //15. Mostramos un cuadro de dialogo
  openDialog(codigo_expediente:any): void {
    this.dialog.open(DialogComponent, {
      width: '300px',
      maxWidth: '90vw',
      height: 'auto',
      data: {
        title: 'Mensaje de información',
        message: `Se registró exitosamente con el Nro de expediente: <strong>${codigo_expediente}</strong>, así mismo se envió la confirmación a su correo personal`
      }
    });
  }
  //16. Establesco un valor por default para el boton guardar del formulario
  isFormValid(): boolean {
    return this.primeraParteForm.valid && this.segundaParteForm.valid;
  }

  //12. Carga de imagen Inicio
  archivoSeleccionado(event: any) {
    const file = event.target.files[0];
    const nombreArchivo = file.name;
    const extension = nombreArchivo.split('.').pop()?.toLowerCase();
    if (extension === 'pdf' ) {
      if (file) {
        const nuevoNombre = this.generarNombreArchivo(extension);
        // No puedes cambiar directamente el nombre de un archivo, pero puedes crear un nuevo archivo con el nuevo nombre
        const nuevoArchivo = new File([file], nuevoNombre, { type: file.type });
        this.nombreArchivoSeleccionado = nuevoNombre;
        // const reader = new FileReader();
        // reader.onload = e => this.urlPrevisualizacion = reader.result as string;
        // reader.readAsDataURL(nuevoArchivo);
        // // Setear el valor del campo foto en el formulario
        // this.segundaParteForm.controls['evidencia_consulta'].setValue(nuevoArchivo);
      }
    } else {
      // this.ArchivoSeleccionados = 'seleccione un archivo JPG válido.'; // Valor predeterminado
      // this._notificacion.showWarning("Warning: ", "Por favor, seleccione un archivo JPG válido.");
      this.toastr.error('Warning',"Por favor, seleccione un archivo JPG válido.");
    }
  }
  //13. Genero un nombre para el archivo a cargar
  private generarNombreArchivo(extension: string): string {
    // Usar la fecha y hora actuales para crear una cadena única
    const timestamp = new Date().getTime();
    // Generar una cadena aleatoria
    const random = Math.random().toString(36).substring(2, 8);
    // Combinar ambos con la extensión para formar el nuevo nombre
    console.log(`${timestamp}-${random}.${extension}`);
    return `${timestamp}-${random}.${extension}`;
  }
  //14. Limpiamos input file
  quitarImagen() {
    this.nombreArchivoSeleccionado = '';
    //this.urlPrevisualizacion = null;
    this.segundaParteForm.controls['evidencia_consulta'].setValue('');
    this.ArchivoSeleccionados = 'Sin archivo seleccionada'; // Valor predeterminado
  }




}
