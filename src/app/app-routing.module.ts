import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReclamoComponent } from './main/reclamo/reclamo.component';
import { AppComponent } from './app.component';
import { HomeComponent } from './main/home/home.component';
import { ConsultaComponent } from './main/consulta/consulta.component';
import { ResultadoComponent } from './main/resultado/resultado.component';

const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'reclamo', component: ReclamoComponent },
  { path: 'consulta', component: ConsultaComponent },
  { path: 'resultado/:numeroExpediente/:codigoVerificacion', component: ResultadoComponent },
  { path: '',   redirectTo: 'home', pathMatch: 'full' },
  { path: '**', redirectTo: 'home'  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
