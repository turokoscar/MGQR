import { Component } from '@angular/core';

@Component({
  selector: 'app-reclamo-recepcion-main',
  templateUrl: './reclamo-recepcion-main.component.html',
  styleUrls: ['./reclamo-recepcion-main.component.scss']
})
export class ReclamoRecepcionMainComponent {

  activarPestania(pestania: 'atendido' | 'denegado') {
    console.log('Cambio de pestaña a:', pestania);

    // IDs de los botones de las pestañas
    const tabIds = {
      atendido: '#nav-profile-tab',
      denegado: '#nav-contact-tab'
    };

    // Simular clic en el botón de la pestaña correspondiente
    const tab = document.querySelector(tabIds[pestania]!) as HTMLElement;
    if (tab) {
      tab.click(); // Esto activa la pestaña como si el usuario hiciera clic
    } else {
      console.warn('No se encontró el botón de pestaña con ID:', tabIds[pestania]);
    }
  }

}
