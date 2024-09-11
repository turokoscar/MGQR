import { Component, Input } from '@angular/core';
@Component({
  selector: 'app-loading-app',
  templateUrl: './loading-app.component.html',
  styleUrls: ['./loading-app.component.scss']
})
export class LoadingAppComponent {
  @Input() isLoading: boolean = false;
}
