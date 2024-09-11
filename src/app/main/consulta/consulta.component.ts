import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';
import { ExpedienteService } from 'src/app/services/expediente.service';
import { ExpedienteConsultaResponse } from 'src/app/models/expediente-consulta-response';
@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  //1. Inicializo las variables
  formConsulta!: FormGroup;
  numeroExpediente: string = '';
  codigoVerificacion: string = '';
  resultadoDiv:boolean=false;
  resultadoFinal:any;
  //2. Inicializo el constructor
  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificationService,
    private router: Router,
    private _expediente: ExpedienteService,
  ){}
  //3. Inicializo el componente
  ngOnInit(): void {
    this.showFormulario();
  }
  //4. Genero el formulario de consulta
  showFormulario(): void {
    this.formConsulta = this.fb.group({
      numero_expediente: ['', Validators.required],
      codigo: ['', Validators.required]
    })
  }

  //5. Proceso el formulario


  consultarOtraVez(){
    this.resultadoDiv=false;
    this.lipmpiarFitros();
  }
  onSubmit():void {
    let param = {
      "expediente": ""+this.formConsulta.value.numero_expediente,
      "codigo_verificacion": ""+this.formConsulta.value.codigo,

     }
     //Primero guardo la data data del expediente
     this._expediente.consultar(param).subscribe({
      next: (data:ExpedienteConsultaResponse) => {
        this.resultadoFinal=data;
        // this.router.navigate(['/resultado', this.numeroExpediente, this.codigoVerificacion]);
        this.resultadoDiv=true;
      
      },
      error: (e) => {
       
      }
    });

    
  }

  
  lipmpiarFitros(){
    this.formConsulta.controls['numero_expediente'].setValue('');
    this.formConsulta.controls['codigo'].setValue('');
  }

}
