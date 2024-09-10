import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclamoComponent } from './main/reclamo/reclamo.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './main/home/home.component';
import { ConsultaComponent } from './main/consulta/consulta.component';
import { ResultadoComponent } from './main/resultado/resultado.component';
import { AuthComponent } from './modules/auth/auth.component';
import { AdminComponent } from './modules/admin/admin.component';
import { ReclamoRecepcionMainComponent } from './modules/reclamo-recepcion/reclamo-recepcion-main/reclamo-recepcion-main.component';
import { ReclamoRecepcionManagementComponent } from './modules/reclamo-recepcion/reclamo-recepcion-management/reclamo-recepcion-management.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'reclamo', component: ReclamoComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'resultado/:numeroExpediente/:codigoVerificacion', component: ResultadoComponent },
  { path: 'login', component: AuthComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'recepcion', component: ReclamoRecepcionMainComponent },
  { path: 'recepcion/:id', component: ReclamoRecepcionManagementComponent },
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
