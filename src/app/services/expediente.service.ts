import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ExpedienteResponse } from '../models/expediente-response';
import { Expediente } from '../models/expediente';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.apiUrl+'/Expediente/Guardar';
  private fakeApi = environment.fakeApi+'/expedientes';
  //2. Defino el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todos los registros
  show(estado: number): Observable<Expediente[]>{
    //Aca colocamos la logica para obtener los expedientes de acuerdo a su estado (Por ahora obviamos esto)
    return this.http.get<Expediente[]>(this.fakeApi);
  }
//   show(): Observable<TipoReclamo[]>{
//     return this.http.get<TipoReclamo[]>(this.apiUrl);
//   }

//   registrarExpediente(param:any): Observable<ExpedienteResponse[]>
//   {
//       return this.http.post(`${this.base}persona`, param);
//   }
  guardar(parametro: any): Observable<ExpedienteResponse> {
    return this.http.post(this.apiUrl,parametro);
  }


}
