import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.scss']
})
export class ReclamoComponent {
  firstFormGroup = this._formBuilder.group({
    tipo_persona: ['', Validators.required],
    email_institucional: ['']
  });
  secondFormGroup = this._formBuilder.group({
    tipo_documento: ['', Validators.required],
    numero_documento: [''],
    genero: [''],
    nombre: [''],
    apellido_paterno: [''],
    apellido_materno: [''],
    departamento: [''],
    provincia: [''],
    distrito: [''],
    direccion: ['']
  });
  isEditable = false;
  showEmailField = false;

  constructor(private _formBuilder: FormBuilder) {}

  onTipoPersonaChange(event: any) {
    this.showEmailField = event.value === '1';
  }
}
