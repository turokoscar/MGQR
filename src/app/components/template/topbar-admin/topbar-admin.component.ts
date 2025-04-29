import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar-admin',
  templateUrl: './topbar-admin.component.html',
  styleUrls: ['./topbar-admin.component.scss']
})
export class TopbarAdminComponent {
  constructor(private router: Router) { }
  menuUsuarioActivo: boolean = false;
  usuario = {
    nombre: 'Pepito Ramos Chumpitaz',
    dni: '12345678',
    correo: 'pepito@example.com'
  };
  toggleUserMenu() {
    this.menuUsuarioActivo = !this.menuUsuarioActivo;
  }
  logout():void{
    //Aca puedo añadir procesos para borrar tokens y demas que deben definirse

    //Redirijo al login
    this.router.navigate(['/login']);
  }
}
