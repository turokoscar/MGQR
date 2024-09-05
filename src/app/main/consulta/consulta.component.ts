import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.component.html',
  styleUrls: ['./consulta.component.scss']
})
export class ConsultaComponent implements OnInit {
  //1. Inicializo las variables
  formConsulta!: FormGroup;
  //2. Inicializo el constructor
  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificationService
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
  onSubmit():void {

  }

}
