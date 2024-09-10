import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit, OnDestroy {
  //1. Declaro las variables a utilizar
  loginForm!: FormGroup;
  //2. Inicializo el constructor
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _authService: AuthService,
    private _notificacion: NotificationService,
    private renderer: Renderer2
  ) {}
  //3. Inicializo el componente
  ngOnInit(): void {
    this.renderer.addClass(document.body, 'bg-gradient-primary');
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
  //6. Eliminamos el fondo en el resto de componentes
  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'bg-gradient-primary');
  }
}
