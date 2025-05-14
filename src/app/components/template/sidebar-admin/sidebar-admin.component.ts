import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.scss']
})
export class SidebarAdminComponent implements OnInit {

  nombre_completo?: string = '';
  cargo?: string = '';
  rol?: string = '';
 //3. Inicializo el componente
 ngOnInit(): void {

    this.nombre_completo=localStorage.getItem('nombre_completo')?.toString();
    this.cargo=localStorage.getItem('cargo')?.toString();
    this.rol=localStorage.getItem('rol')?.toString();
  }

  
}
