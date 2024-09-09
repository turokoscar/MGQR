import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  //1. Declaro las variables a utilizar
  loginForm!: FormGroup;
  //2. Inicializo el constructor
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private _notificacion: NotificationService
  ) {}
  //3. Inicializo el componente
  ngOnInit(): void {
      this.showForm();
  }
  //4. Defino el formulario
  showForm():void{
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }
  //5. Proceso el formulario de inicio de sesión
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      if (email === 'admin@gmail.com' && password === '12345678') {
        this.router.navigate(['/admin']);
      } else {
        this._notificacion.showWarning("Error", "Las credenciales enviadas son incorrectas.");
      }
    }
  }

    // Método de conveniencia para acceder fácilmente a los controles del formulario en el template
    get formControls() {
      return this.loginForm.controls;
    }
}
