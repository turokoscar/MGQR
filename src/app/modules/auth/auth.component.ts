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
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }
  //5. Proceso el formulario de inicio de sesión
  onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      if (email === '12345678' && password === '12345678') {
        
        localStorage.setItem('Acceso',"ok");
        localStorage.setItem('tipo_proyecto_id',"1");
        localStorage.setItem('nombre_completo',"Leoncio Julio Ugarte");
        localStorage.setItem('dni',"12345678");
        localStorage.setItem('correo',"lugarte@serforbps.gob.pe");
        localStorage.setItem('rol',"1");
        localStorage.setItem('cargo',"Jefe de Proyecto Plantaciones");
        this.router.navigate(['/admin']);

      } else {
        this._notificacion.showWarning("Error", "Las credenciales enviadas son incorrectas.");
      }


      if (email === '44444444' && password === '44444444') {

        localStorage.setItem('Acceso',"ok");
        localStorage.setItem('tipo_proyecto_id',"0");
        localStorage.setItem('nombre_completo',"Meibel Arevalo Jimenez");
        localStorage.setItem('dni',"44444444");
        localStorage.setItem('correo',"marevalo@serforbps.gob.pe");
        localStorage.setItem('rol',"2");
        localStorage.setItem('cargo',"Gestión de riesgos");

        this.router.navigate(['/admin']);
      } else {
        this._notificacion.showWarning("Error", "Las credenciales enviadas son incorrectas.");
      }


      if (email === '55555555' && password === '55555555') {
        localStorage.setItem('Acceso',"ok");
        localStorage.setItem('tipo_proyecto_id',"0");
        localStorage.setItem('nombre_completo',"Daniel Martín Rivera Chumbiray");
        localStorage.setItem('dni',"55555555");
        localStorage.setItem('correo',"coordinadorkfw@serfor.gob.pe");
        localStorage.setItem('cargo',"Coordinador Ejecutivo de BPS");
        localStorage.setItem('rol',"3");

        
        this.router.navigate(['/admin']);
      } else {
        this._notificacion.showWarning("Error", "Las credenciales enviadas son incorrectas.");
      }


      if (email === '44328678' && password === '44328678') {
        localStorage.setItem('Acceso',"ok");
        localStorage.setItem('tipo_proyecto_id',"0");
        localStorage.setItem('nombre_completo',"Ricky Joel Blas Reyes");
        localStorage.setItem('cargo',"Administrador");
        localStorage.setItem('dni',"44328678");
        localStorage.setItem('correo',"rblas0527@gmail.com");
        
        localStorage.setItem('rol',"5");

        
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
