import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';
@Injectable({
  providedIn: 'root'
})
export class AlertService {
  constructor() { }

  // Método para mostrar el mensaje informativo con el número de expediente
  showInfoAlert(codigo_expediente: any): void {
    Swal.fire({
      title: 'Mensaje de información',
      html: `Se registró exitosamente con el Nro de expediente: <strong>${codigo_expediente}</strong>. Así mismo, se notificó vía correo su código de verificación para que pueda realizar seguimiento a su expediente.`,
      icon: 'success',
      confirmButtonColor: '#006650',
      confirmButtonText: 'Aceptar'
    });
  }
}
