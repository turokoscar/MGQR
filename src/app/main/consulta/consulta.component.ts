import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NotificationService } from 'src/app/services/notification.service';

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
  //2. Inicializo el constructor
  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificationService,
    private router: Router
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
    this.router.navigate(['/resultado', this.numeroExpediente, this.codigoVerificacion]);
  }

}
