import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ExpedienteResponse } from '../models/expediente-response';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.apiUrl+'/Expediente/Guardar';
  //2. Defino el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todos los registros
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
