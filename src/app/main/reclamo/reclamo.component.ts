import { Component } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-reclamo',
  templateUrl: './reclamo.component.html',
  styleUrls: ['./reclamo.component.scss']
})
export class ReclamoComponent {
  firstFormGroup = this._formBuilder.group({
    firstCtrl: ['', Validators.required],
  });
  secondFormGroup = this._formBuilder.group({
    secondCtrl: ['', Validators.required],
  });
  isEditable = false;
  showEmailField = false;

  constructor(private _formBuilder: FormBuilder) {}

  onTipoPersonaChange(event: any) {
    this.showEmailField = event.value === '1';
  }
}
