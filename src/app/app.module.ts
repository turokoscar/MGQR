import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ToastrModule } from 'ngx-toastr';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppComponent } from './app.component';
import { ReclamoComponent } from './main/reclamo/reclamo.component';
import { HomeComponent } from './main/home/home.component';
import { HeaderComponent } from './template/header/header.component';
import { FooterComponent } from './template/footer/footer.component';
import { IntroComponent } from './main/intro/intro.component';
import { ConsultaComponent } from './main/consulta/consulta.component';
import { ResultadoComponent } from './main/resultado/resultado.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatStepperModule} from '@angular/material/stepper';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatSelectModule} from '@angular/material/select';
import {MatIconModule} from '@angular/material/icon';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import { MatDialogModule } from '@angular/material/dialog';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTableModule} from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';

import { DialogComponent } from './components/dialog/dialog.component';
import { AuthComponent } from './modules/auth/auth.component';
import { AdminComponent } from './modules/admin/admin.component';
import { HeaderAdminComponent } from './components/template/header-admin/header-admin.component';
import { FooterAdminComponent } from './components/template/footer-admin/footer-admin.component';
import { SidebarAdminComponent } from './components/template/sidebar-admin/sidebar-admin.component';
import { TopbarAdminComponent } from './components/template/topbar-admin/topbar-admin.component';
import { ReclamoRecepcionMainComponent } from './modules/reclamo-recepcion/reclamo-recepcion-main/reclamo-recepcion-main.component';
import { TitleComponent } from './components/title/title.component';
import { DescriptionComponent } from './components/description/description.component';
import { ReclamoRecepcionPendienteComponent } from './modules/reclamo-recepcion/reclamo-recepcion-pendiente/reclamo-recepcion-pendiente.component';
import { ReclamoRecepcionAtendidoComponent } from './modules/reclamo-recepcion/reclamo-recepcion-atendido/reclamo-recepcion-atendido.component';
import { SpinnerComponent } from './components/spinner/spinner.component';
import { LoadingAppComponent } from './components/loading-app/loading-app.component';
import { ReclamoRecepcionDenegadoComponent } from './modules/reclamo-recepcion/reclamo-recepcion-denegado/reclamo-recepcion-denegado.component';
import { RecepcionComponent } from './modules/reclamo/recepcion/recepcion.component';
import { DenegacionComponent } from './modules/reclamo/denegacion/denegacion.component';
import { AtencionComponent } from './modules/reclamo/atencion/atencion.component';
import { ReasignacionComponent } from './modules/reclamo/reasignacion/reasignacion.component';
import { ReclamoManagementComponent } from './modules/reclamo/reclamo-management/reclamo-management.component';
import { MainComponent } from './main/reclamos/main/main.component';
import { VisualizacionComponent } from './modules/reclamo/visualizacion/visualizacion.component';
import { ReclamoAtencionMainComponent } from './modules/reclamo-atencion/reclamo-atencion-main/reclamo-atencion-main.component';
import { ReclamoAtencionPendienteComponent } from './modules/reclamo-atencion/reclamo-atencion-pendiente/reclamo-atencion-pendiente.component';
import { ReclamoAtencionProcesoComponent } from './modules/reclamo-atencion/reclamo-atencion-proceso/reclamo-atencion-proceso.component';
import { ReclamoAtencionAtendidoComponent } from './modules/reclamo-atencion/reclamo-atencion-atendido/reclamo-atencion-atendido.component';
import { ReclamoAtencionReasignadoComponent } from './modules/reclamo-atencion/reclamo-atencion-reasignado/reclamo-atencion-reasignado.component';


@NgModule({
  declarations: [
    AppComponent,
    ReclamoComponent,
    HomeComponent,
    HeaderComponent,
    FooterComponent,
    IntroComponent,
    ConsultaComponent,
    ResultadoComponent,
    DialogComponent,
    AuthComponent,
    AdminComponent,
    HeaderAdminComponent,
    FooterAdminComponent,
    SidebarAdminComponent,
    TopbarAdminComponent,
    ReclamoRecepcionMainComponent,
    TitleComponent,
    DescriptionComponent,
    ReclamoRecepcionPendienteComponent,
    ReclamoRecepcionAtendidoComponent,
    SpinnerComponent,
    LoadingAppComponent,
    ReclamoRecepcionDenegadoComponent,
    RecepcionComponent,
    DenegacionComponent,
    AtencionComponent,
    ReasignacionComponent,
    ReclamoManagementComponent,
    MainComponent,
    VisualizacionComponent,
    ReclamoAtencionMainComponent,
    ReclamoAtencionPendienteComponent,
    ReclamoAtencionProcesoComponent,
    ReclamoAtencionAtendidoComponent,
    ReclamoAtencionReasignadoComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 3000, // Puedes configurar opciones globales aquí
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
    MatSlideToggleModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatIconModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatDividerModule,
    MatListModule,
    MatDialogModule,
    MatTabsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatProgressBarModule,
    SweetAlert2Module.forRoot(),
    MatProgressSpinnerModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
