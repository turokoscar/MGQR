import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor( private notification: ToastrService) { }

  public showSuccess(title: string, message: string): void {
    this.notification.success(message, title, {
      timeOut: 3000,
      progressBar: true
    });
  }

  public showInfo(title: string, message: string): void {
    this.notification.info(message, title, {
      timeOut: 3000,
      progressBar: true
    });
  }

  public showWarning(title: string, message: string): void {
    this.notification.warning(message, title, {
      timeOut: 3000,
      progressBar: true
    });
  }

  public showError(title: string, message: string): void {
    this.notification.error(message, title, {
      timeOut: 3000,
      progressBar: true
    });
  }
}
