import { Component, Renderer2, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { NotificationService } from 'src/app/services/notification.service';
import { AlertService } from 'src/app/services/alert.service';
import {SweetAlertIcon} from "sweetalert2";

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
    private renderer: Renderer2,
    private alertService: AlertService
  ) {}
  //3. Inicializo el componente
  ngOnInit(): void {
    this.renderer.addClass(document.body, 'bg-gradient-primary');
    this.showForm();
  }
  //4. Defino el formulario
  showForm():void{
    this.loginForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  openDialogGeneral(title: string, html: any, icon: string): void {
    this.alertService.showAlertGeneral(title,html,icon as SweetAlertIcon);
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this._authService.login(email, password).subscribe({
        next: (response) => {
          const { token, usuario, rol, usuarioId } = response;

          // Almacenar el token y los datos del usuario
          localStorage.setItem('token', response.token);
          localStorage.setItem('dni', this.loginForm.value.email); // el DNI es el login
          localStorage.setItem('correo', response.usuario);
          localStorage.setItem('cargo', response.rol);
          localStorage.setItem('rol', response.rolId.toString());
          localStorage.setItem('id', response.usuarioId.toString());
          localStorage.setItem('nombre_completo', `${response.nombre} ${response.apellidoPaterno} ${response.apellidoMaterno}`);
          localStorage.setItem('Acceso', 'ok');


          this.router.navigate(['/admin']);
        },
        error: (error) => {
          this._notificacion.showWarning('Error', error?.error?.mensaje || 'Credenciales incorrectas');
          this.openDialogGeneral('Error', 'Credenciales incorrectas.', 'warning');
        }
      });
    }
  }

  //6. Eliminamos el fondo en el resto de componentes
  ngOnDestroy(): void {
    this.renderer.removeClass(document.body, 'bg-gradient-primary');
  }
}
