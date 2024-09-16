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
import { RecepcionComponent } from './modules/reclamo/recepcion/recepcion.component';
import { DenegacionComponent } from './modules/reclamo/denegacion/denegacion.component';
import { AtencionComponent } from './modules/reclamo/atencion/atencion.component';
import { ReasignacionComponent } from './modules/reclamo/reasignacion/reasignacion.component';
import { ReclamoManagementComponent } from './modules/reclamo/reclamo-management/reclamo-management.component';
import { MainComponent } from './main/reclamos/main/main.component';
import { VisualizacionComponent } from './modules/reclamo/visualizacion/visualizacion.component';
import { ReclamoAtencionMainComponent } from './modules/reclamo-atencion/reclamo-atencion-main/reclamo-atencion-main.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'reclamo', component: MainComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'resultado/:numeroExpediente/:codigoVerificacion', component: ResultadoComponent },
  { path: 'login', component: AuthComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'reclamo/create', component: ReclamoManagementComponent },
  { path: 'reclamo/:id', component: ReclamoManagementComponent },
  { path: 'recepcion', component: ReclamoRecepcionMainComponent },
  { path: 'atencion', component: ReclamoAtencionMainComponent },
  { path: 'recepcion/:id', component: RecepcionComponent },
  { path: 'denegacion/:id', component: DenegacionComponent },
  { path: 'atencion/:id', component: AtencionComponent },
  { path: 'reasignacion/:id', component: ReasignacionComponent },
  { path: 'visualizacion/:id', component: VisualizacionComponent },
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
