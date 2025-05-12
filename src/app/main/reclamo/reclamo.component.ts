  import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
  import { Validators, FormBuilder, FormGroup } from '@angular/forms';
  import { MatDialog } from '@angular/material/dialog';
  import { Router } from '@angular/router';
  import { LowerCasePipe } from '@angular/common';
  import { environment } from 'src/environments/environment.development';
  import { DialogComponent } from 'src/app/components/dialog/dialog.component';


  import { Distrito } from 'src/app/models/distrito';
  import { Provincia } from 'src/app/models/provincia';
  import { Region } from 'src/app/models/region';
  import { TipoAtencion } from 'src/app/models/tipo-atencion';
  import { TipoDocumento } from 'src/app/models/tipo-documento';
  import { TipoReclamo } from 'src/app/models/tipo-reclamo';
  import { TipoProyecto } from 'src/app/models/tipo-proyecto';

  import { NotificationService } from 'src/app/services/notification.service';
  import { TipoDocumentoService } from 'src/app/services/tipo-documento.service';
  import { TipoReclamoService } from 'src/app/services/tipo-reclamo.service';
  import { TipoProyectoService } from 'src/app/services/tipo-proyecto.service';


  import { TipoAtencionService } from 'src/app/services/tipo-atencion.service';
  import { UbigeoService } from 'src/app/services/ubigeo.service';
  import { ExpedienteService } from 'src/app/services/expediente.service';
  import { ExpedienteResponse } from 'src/app/models/expediente-response';

  import { ExpedienteValidacionResponse } from 'src/app/models/expediente-validacion-response';

  import { ToastrService } from 'ngx-toastr';
  import { AlertService } from 'src/app/services/alert.service';
  import {SweetAlertIcon} from "sweetalert2";

  @Component({
    selector: 'app-reclamo',
    templateUrl: './reclamo.component.html',
    styleUrls: ['./reclamo.component.scss'],
    providers: [LowerCasePipe]
  })
  export class ReclamoComponent implements OnInit {

    @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

    //1. Declaro las variables a utilizar
    maxLengthDocumento: number = 15;
    environment = environment;
    maxFileSizeBytes = environment.file_max_length_kb * 1024;
    maxFileSizeMB: number = Math.round(environment.file_max_length_kb / 1024);
    allowedExtensions = environment.file_allow_exts;
    errorArchivo: string = '';
    acceptFileTypes: string = '';

    loading: boolean = false;
    isReadOnly: boolean = false;
    isCheckboxDisabled = false;
    primeraParteForm!: FormGroup;
    segundaParteForm!: FormGroup;
    tipoAtencion: TipoAtencion[] = [];
    tipoDocumentos: TipoDocumento[] = [];
    tipoReclamos: TipoReclamo[] = [];
    tipoProyectos: TipoProyecto[] = [];
    regiones: Region[] = [];
    provincias: Provincia[] = [];
    distritos: Distrito[] = [];
    showEmailField = false;
    showEnviarNotificacionField = true;
    showEnviarExpedienteField = false;
    dniValidado = false;
    loadingMessage: string = 'Espere un momento, se está procesando el formulario ...';

    listValidacionCorreo!:ExpedienteValidacionResponse;


    disabled: boolean = false;
    errorMessage: string = "";

   /******carga de imagen inicio */
    ArchivoSeleccionados: string = 'Sin imagen seleccionada';
    nombreArchivoSeleccionado: string = '';
    codigo_validacion:string='';
    ListFiles: any[] = [];
    formDataFiles = new FormData();
   //  urlPrevisualizacion: string | ArrayBuffer | null = '';


    expediente_id: any=0;
    numero_expediente: any="";
    esInterno: boolean = false;
    esSoloLectura: boolean = false;

    result_expediente:string="";
    result_dias:string="";
    result_contenido_consulta:string="";
    result_area_destino:string="";
    result_fecha:string="";
    result_estado:string="";

    es_confidencial:boolean=false;

    //2. Inicializo el constructor
    constructor(
      private toastr: ToastrService,
      private fb: FormBuilder,
      private dialog: MatDialog,
      private _notificacion: NotificationService,
      private _tipoDocumento: TipoDocumentoService,
      private _tipoAtencion: TipoAtencionService,
      private _tipoReclamo: TipoReclamoService,
      private _tipoProyecto: TipoProyectoService,
      private _ubigeo: UbigeoService,
      private _expediente: ExpedienteService,
      private router: Router,
      private lowerCasePipe: LowerCasePipe,
      private alertService: AlertService
    ){}
    ngOnInit(): void {
      this.esInterno = this.router.url.includes('/reclamo/create');
      this.initFormsAndData();

      const data = history.state.expediente;
      console.log(data);
      if (data) {
        this.esSoloLectura = true;
        this.precargarUbigeoDesdeDistrito(data.ubigeo_id);
        // 2. Precarga los datos si vienen desde "Ver detalle"
        this.primeraParteForm.patchValue({
          tipo_persona: data.procedencia_id,
          referencia: data.referencia,
        });
        this.esInterno=false;
        this.segundaParteForm.patchValue({
          tipo_documento: data.tipo_documento_id,
          numero_documento: data.documento,
          genero: data.genero,
          nombre: data.nombres,
          apellido_paterno: data.apellido_paterno,
          apellido_materno: data.apellido_materno,
          departamento: data.departamento_id,
          provincia: data.provincia_id,
          direccion: data.direccion,
          numero_telefono: data.telefono,
          numero_celular: data.celular,
          correo_electronico: data.email,
          comunidad: data.comunidad,
          cargo: data.cargo,
          tipo_consulta: data.tipo_reclamo_id,
          tipo_proyecto: data.tipo_proyecto_id,
          contenido_consulta: data.contenido_consulta,
          distrito: data.ubigeo_id
        });
        this.segundaParteForm.disable();
        this.primeraParteForm.disable();
        this.primeraParteForm.controls['referencia'].disable();
        this.primeraParteForm.controls['tipo_persona'].disable();
        this.showEnviarNotificacionField = false;
        this.showEnviarExpedienteField = false;
        this.segundaParteForm.controls['provincia'].disable();
        this.segundaParteForm.controls['distrito'].disable();
      }
    }
    initFormsAndData(): void {
      this.showPrimerForm();
      this.showSegundoForm();
      this.showTipoAtencion();
      this.showTipoDocumentos();
      this.showTipoReclamos();
      this.showTipoProyectos();
      this.showRegiones();
      this.onActivaReactividad();
      this.segundaParteForm.get('tipo_documento')?.valueChanges.subscribe((tipoDoc: number) => {
        if (tipoDoc === 1) { // 1 = DNI
          this.maxLengthDocumento = 8;
          this.setDocumentoMaxLength(8);
        } else if (tipoDoc === 2) { // 2 = Carnet de Extranjería (ajusta según tu ID real)
          this.maxLengthDocumento = 15;
          this.setDocumentoMaxLength(15);
        } else {
          this.maxLengthDocumento = 15;
          this.setDocumentoMaxLength(15);
        }
      });

      this.segundaParteForm.get('departamento')?.valueChanges.subscribe((departamentoId: string) => {
        if (!this.esSoloLectura && departamentoId) {
          this.segundaParteForm.get('provincia')?.enable();
          this.showProvincias(departamentoId);
          this.segundaParteForm.get('provincia')?.setValue(''); // Limpia selección previa
          this.segundaParteForm.get('distrito')?.setValue('');
          this.segundaParteForm.get('distrito')?.disable();
          this.distritos = [];
        }
      });

      this.segundaParteForm.get('provincia')?.valueChanges.subscribe((provinciaId: string) => {
        if (!this.esSoloLectura && provinciaId) {
          this.segundaParteForm.get('distrito')?.enable();
          this.showDistritos(provinciaId);
          this.segundaParteForm.get('distrito')?.setValue(''); // Limpia selección previa
        }
      });

    }
    private setDocumentoMaxLength(maxLength: number): void {
      const control = this.segundaParteForm.get('numero_documento');
      if (control) {
        control.setValidators([
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.maxLength(maxLength),
        ]);
        control.updateValueAndValidity();
      }
    }
    onDniInputBlur(): void {
      const dni = this.segundaParteForm.get('numero_documento')?.value;

      if (dni && dni.length === 8) {
        this.loadingMessage = 'Validando DNI en la RENIEC...';
        this.loading = true;

        this._expediente.buscarDni(dni).subscribe({
          next: (response) => {
            this.loading = false;
            if (response.c === 1 && response.d) {
              const data = response.d;
              this.segundaParteForm.patchValue({
                nombre: data.prenombres,
                apellido_paterno: data.primerApellido,
                apellido_materno: data.segundoApellido
              });

              this.segundaParteForm.controls['nombre'].disable();
              this.segundaParteForm.controls['apellido_paterno'].disable();
              this.segundaParteForm.controls['apellido_materno'].disable();
            } else {
              this.openDialogGeneral("Mensaje de Información", "Ocurrió un error al validar con el API RENIEC, ingrese sus datos de manera manual", "error");
              this.segundaParteForm.controls['nombre'].enable();
              this.segundaParteForm.controls['apellido_paterno'].enable();
              this.segundaParteForm.controls['apellido_materno'].enable();
            }
          },
          error: () => {
            this.loading = false;
            this.openDialogGeneral("Mensaje de Información", "Error al conectar con el servicio RENIEC", "error");
            this.segundaParteForm.controls['nombre'].enable();
            this.segundaParteForm.controls['apellido_paterno'].enable();
            this.segundaParteForm.controls['apellido_materno'].enable();
          }
        });
      }
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
        tipo_documento: [{ value: '', disabled: false }],
        numero_documento: [{ value: '', disabled: false },
          [Validators.pattern('^[0-9]*$'), Validators.maxLength(15)]
        ],
        fecha_ocurrencia: [''],
        tipo_canal: [''],
        genero: ['', Validators.required],
        nombre: ['',
          [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$'), Validators.maxLength(100)]
        ],
        apellido_paterno: ['',
          [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$'), Validators.maxLength(100)]
        ],
        apellido_materno: ['',
          [Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]*$'), Validators.maxLength(100)]
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
        tipo_proyecto: ['', Validators.required],

        evidencia_consulta: [''],
        es_confidencial: [false],
        codigo_validacion: ['', [Validators.pattern('^[0-9]*$'), Validators.maxLength(4)]],
        referencia: ['']

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
    //7. Obtengo los tipos de reclamos
    private showTipoProyectos(): void{
      this._tipoProyecto.show().subscribe({
        next: (data) => {
          this.tipoProyectos = data;
        },
        error: (e) => {
          this.errorMessage = "Se presentó un problema al realizar la operación: "+ e;
          this._notificacion.showError("Error: ", this.errorMessage);
        }
      });
    }
    precargarUbigeoDesdeDistrito(distritoId: string): void {
      this._ubigeo.getDistritoCompletoById(distritoId).subscribe({
        next: (distrito) => {
          const provincia = distrito.provincia;
          const region = provincia.region;

          const provinciaId = provincia.id;
          const departamentoId = region.id;

          this.showProvincias(departamentoId);
          this.showDistritos(provinciaId);
          console.log(distritoId);
          console.log(typeof +distritoId); // debe decir "number"

          this.segundaParteForm.patchValue({
            departamento: departamentoId,
            provincia: provinciaId,
            distrito: +distritoId
          });

        },
        error: (e) => console.error('Error al obtener distrito completo', e)
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
        this.isCheckboxDisabled = true;
      } else {
        this.showEmailField = false;
        emailControl?.clearValidators();
        this.isCheckboxDisabled = false;
      }
      emailControl?.updateValueAndValidity();
    }
    //12. Deshabilita o habilita los campos según el valor del input Checkbox
    private onActivaReactividad(): void {
      if (this.disabled) {
        // Caso confidencial: deshabilitar todo
        this.es_confidencial = true;
        this.segundaParteForm.controls['tipo_documento'].disable();
        this.segundaParteForm.controls['numero_documento'].disable();
        this.segundaParteForm.controls['nombre'].disable();
        this.segundaParteForm.controls['apellido_paterno'].disable();
        this.segundaParteForm.controls['apellido_materno'].disable();
        // Limpiar valores
        this.segundaParteForm.patchValue({
          tipo_documento: '0',
          numero_documento: '',
          nombre: '',
          apellido_paterno: '',
          apellido_materno: ''
        });
      } else {
        this.es_confidencial = false;
        this.segundaParteForm.controls['tipo_documento'].enable();
        this.segundaParteForm.controls['numero_documento'].enable();

        if (this.dniValidado) {
          this.segundaParteForm.controls['nombre'].disable();
          this.segundaParteForm.controls['apellido_paterno'].disable();
          this.segundaParteForm.controls['apellido_materno'].disable();
        } else {
          this.segundaParteForm.controls['nombre'].disable(); // o enable si deseas
          this.segundaParteForm.controls['apellido_paterno'].disable();
          this.segundaParteForm.controls['apellido_materno'].disable();
        }
      }
    }

    //13. Método que se ejecuta cuando cambia el checkbox de confidencialidad
    activaConfidencialidad(): void {
      this.disabled = this.segundaParteForm.get('es_confidencial')?.value || false;
      this.onActivaReactividad();
    }
    //14. Proceso el formulario
    onSubmitValidacion():void{
      this.loading = true;
      this.loadingMessage = 'Espere un momento, se está procesando el formulario ...';
      const formData = {
        form1: this.primeraParteForm.value,
        form2: this.segundaParteForm.value
      };
      localStorage.setItem('formData', JSON.stringify(formData));
      //Valida si selecciono el archivo
      const file: File = this.segundaParteForm.value.evidencia_consulta;
      if(!file){
        this.nombreArchivoSeleccionado="";
      }
      let param = {
        //("perTipDoc": ""+ 1,

        "tipo_documento_id": ""+(this.segundaParteForm.value.es_confidencial==true)? 1:this.segundaParteForm.value.tipo_documento,
        "numero_documento": ""+(this.segundaParteForm.value.es_confidencial==true,'',this.segundaParteForm.value.numero_documento),
        "nombres": ""+(this.segundaParteForm.value.es_confidencial==true,'',this.segundaParteForm.value.nombre),
        "apellido_paterno": ""+(this.segundaParteForm.value.es_confidencial==true,'',this.segundaParteForm.value.apellido_paterno),
        "apellido_materno": ""+(this.segundaParteForm.value.es_confidencial==true,'',this.segundaParteForm.value.apellido_materno),
        "tipo_canal": "1",
        "tipo_expediente": ""+this.primeraParteForm.value.tipo_persona,
        "tipo_reclamo_id": ""+this.segundaParteForm.value.tipo_consulta,
        "tipo_proyecto_id": ""+this.segundaParteForm.value.tipo_proyecto,

        "es_confidencial": ""+(this.es_confidencial==true,1,0),
        "genero": ""+this.segundaParteForm.value.genero,
        "ubigeo_id": ""+this.segundaParteForm.value.distrito,
        "direccion": ""+this.segundaParteForm.value.direccion,
        "telefono": ""+this.segundaParteForm.value.numero_telefono,
        "celular": ""+this.segundaParteForm.value.numero_celular,
        "email": ""+this.segundaParteForm.value.correo_electronico,
        "contenido_consulta": ""+this.segundaParteForm.value.contenido_consulta,
        "comunidad": ""+this.segundaParteForm.value.comunidad,
        "referencia": ""+this.segundaParteForm.value.referencia,
        "cargo": ""+this.segundaParteForm.value.cargo,
        "usuario_id": "1",
        "evidencia":this.nombreArchivoSeleccionado,
       }
        this._expediente.validacionCorreo(param).subscribe({
          next: (data:ExpedienteValidacionResponse) => {
            console.log(data);
            this.listValidacionCorreo=data;
            if(data.codigo_validacion!=""){
              // this.quitarImagen();
              this.openDialogGeneral("Mensaje de Información","Se  envio via correo su codigo de validacion","success");
              this.showEnviarNotificacionField = false;
              this.showEnviarExpedienteField = true;


            }
            this.loading = false;
          },
          error: (e) => {
            this.loading = false;
            this.errorMessage = "Se presentó un problema al realizar la operación: " + e;
          }
        });
  }

   //14. Proceso el formulario
   onSubmit():void{
    this.loading = true;
    this.loadingMessage = 'Espere un momento, se está procesando el formulario ...';
    const formData = {
      form1: this.primeraParteForm.value,
      form2: this.segundaParteForm.value
    };
    localStorage.setItem('formData', JSON.stringify(formData));
    //Valida si selecciono el archivo
    const file: File = this.segundaParteForm.value.evidencia_consulta;
    if(!file){
      this.nombreArchivoSeleccionado="";
    }
    let param = {
      //("perTipDoc": ""+ 1,


      "tipo_documento_id": ""+(this.segundaParteForm.value.es_confidencial==true)? 1:this.segundaParteForm.value.tipo_documento,
      // "numero_documento": ""+(this.segundaParteForm.value.es_confidencial==true)? '0':this.segundaParteForm.value.numero_documento,
      // "nombres": ""+(this.segundaParteForm.value.es_confidencial==true)?'':this.segundaParteForm.value.nombre,
      // "apellido_paterno": ""+(this.segundaParteForm.value.es_confidencial==true)?'':this.segundaParteForm.value.apellido_paterno,
      "numero_documento": ""+(this.segundaParteForm.value.es_confidencial==true,'',this.segundaParteForm.value.numero_documento),
      "nombres": ""+(this.segundaParteForm.value.es_confidencial==true,'',this.segundaParteForm.value.nombre),
      "apellido_paterno": ""+(this.segundaParteForm.value.es_confidencial==true,'',this.segundaParteForm.value.apellido_paterno),
      "apellido_materno": ""+(this.segundaParteForm.value.es_confidencial==true,'',this.segundaParteForm.value.apellido_materno),
      "tipo_canal": "1",
      "tipo_expediente": ""+this.primeraParteForm.value.tipo_persona,
      "tipo_reclamo_id": ""+this.segundaParteForm.value.tipo_consulta,
      "tipo_proyecto_id": ""+this.segundaParteForm.value.tipo_proyecto,

      "es_confidencial": ""+(this.es_confidencial==true,1,0),
      "genero": ""+this.segundaParteForm.value.genero,
      "ubigeo_id": ""+this.segundaParteForm.value.distrito,
      "direccion": ""+this.segundaParteForm.value.direccion,
      "telefono": ""+this.segundaParteForm.value.numero_telefono,
      "celular": ""+this.segundaParteForm.value.numero_celular,
      "email": ""+this.segundaParteForm.value.correo_electronico,
      "contenido_consulta": ""+this.segundaParteForm.value.contenido_consulta,
      "comunidad": ""+this.segundaParteForm.value.comunidad,
      "referencia": ""+this.segundaParteForm.value.referencia,
      "cargo": ""+this.segundaParteForm.value.cargo,
      "usuario_id": "1",
      "evidencia":this.nombreArchivoSeleccionado,
      "codigo_validacion":this.segundaParteForm.value.codigo_validacion,
     }


     let codigo=   param.codigo_validacion;



     console.log(codigo+"  --  "+this.listValidacionCorreo.codigo_validacion);
     if(codigo==this.listValidacionCorreo.codigo_validacion){
         //Primero guardo la data data del expediente
        this._expediente.guardar(param).subscribe({
          next: (data:ExpedienteResponse) => {
            console.log(data);
            if(data.id!=0){
              this.expediente_id=data.id;
              this.numero_expediente=data.expediente;

              let xlistFiles :File[] = [];
              // this.toastr.show("Cantidad",this.ListFiles.length.toString());


              console.log("guarddddd: "+this.ListFiles.length.toString());
              if (this.ListFiles.length > 0)
                {
                  this.ListFiles.forEach(element => {
                    xlistFiles.push(element.file);
                  });
                  let files: File[] = xlistFiles;
                  let formData = new FormData();
                  for (let i = 0; i < files.length; i++) {
                    let file: File = files[i];
                    formData.append("files", file);
                  }

                    console.log("forData:"+formData);

                  this._expediente.upload(formData).subscribe(response => {
                    console.log('File uploaded successfully', response);
                  }, error => {
                    console.error('Error uploading file', error);
                  });
              }

              this.quitarImagen();
              this.openDialog(data.expediente);
              if (this.esInterno) {
                this.router.navigate(['/recepcion']);
              } else {
                this.router.navigate(['../home']);
              }
            }
            this.loading = false;
          },
          error: (e) => {
            this.loading = false;
            this.errorMessage = "Se presentó un problema al realizar la operación: " + e;
          }
        });
     }else{
      this.loading = false;
      this.openDialogError("Errores","El codigo de validacion es incorrecto");
     }
  }
    onlyNumberInput(event: KeyboardEvent): void {
      const charCode = event.charCode;
      if (charCode < 48 || charCode > 57) {
        event.preventDefault(); // Solo permite del 0 al 9
      }
    }
    //15. Mostramos un cuadro de dialogo
    openDialog(codigo_expediente: any): void {
      this.alertService.showInfoAlert(codigo_expediente);
    }

    openDialogError(title: string, html: any): void {
      this.alertService.showAError(title,html);
    }

    openDialogGeneral(title: string, html: any, icon: string): void {
      this.alertService.showAlertGeneral(title,html,icon as SweetAlertIcon);
    }

    //16. Establesco un valor por default para el boton guardar del formulario
    isFormValid(): boolean {
      return this.primeraParteForm.valid && this.segundaParteForm.valid;
    }
    archivoSeleccionado(event: any): void {
      this.errorArchivo = ''; // limpia errores anteriores

      const file: File = event.target.files[0];
      if (!file) return;

      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      const size = file.size;

      if (!this.allowedExtensions.includes(extension)) {
        this.errorArchivo = `El tipo de archivo .${extension} no está permitido.`;
        this.quitarImagen();
        return;
      }

      if (size > this.maxFileSizeBytes) {
        this.errorArchivo = `El archivo supera el tamaño máximo de ${this.maxFileSizeMB} MB.`;
        this.quitarImagen();
        return;
      }

      const nuevoNombre = this.generarNombreArchivo(extension);
      const nuevoArchivo = new File([file], nuevoNombre, { type: file.type });

      this.nombreArchivoSeleccionado = nuevoNombre;
      this.segundaParteForm.controls['evidencia_consulta'].setValue(nuevoArchivo);
      this.ListFiles = [{ id: 1, extension, file: nuevoArchivo }];
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
    quitarImagen(): void {
      this.nombreArchivoSeleccionado = '';
      this.segundaParteForm.controls['evidencia_consulta'].setValue('');
      this.ArchivoSeleccionados = 'Sin archivo seleccionada';

      if (this.fileInput) {
        this.fileInput.nativeElement.value = '';
      }
    }
  }
