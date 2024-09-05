import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclamoComponent } from './main/reclamo/reclamo.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './main/home/home.component';

const routes: Routes = [
  { path: 'reclamo', component: ReclamoComponent },
  { path: 'home', component: HomeComponent },
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
