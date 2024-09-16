import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ExpedienteSeguimiento } from '../models/expediente-seguimiento/expediente-seguimiento';
import { ExpedienteSeguimientoManagement } from '../models/expediente-seguimiento/expediente-seguimiento-management';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteSeguimientoService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.fakeApi+'/expediente_seguimiento';
  constructor( private http: HttpClient ) { }
  //2. Obtengo la trazabilidad de un expediente
  showByExpediente(codExpediente: number): Observable<ExpedienteSeguimiento[]>{
    return this.http.get<ExpedienteSeguimiento[]>(this.apiUrl);
  }
  //3. Creo un nuevo registro
  store(expedienteSeguimiento: ExpedienteSeguimientoManagement): Observable<ExpedienteSeguimientoManagement>{
    return this.http.post<ExpedienteSeguimientoManagement>(this.apiUrl, expedienteSeguimiento);
  }
  //4. Actualizo el registro
  update(expedienteSeguimiento: ExpedienteSeguimientoManagement): Observable<ExpedienteSeguimientoManagement>{
    const url = this.apiUrl;
    return this.http.put<ExpedienteSeguimientoManagement>(url, expedienteSeguimiento);
  }
}
