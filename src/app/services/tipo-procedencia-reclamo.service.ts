import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { TipoProcedenciaReclamo } from '../models/tipo-procedencia-reclamo';
@Injectable({
  providedIn: 'root'
})
export class TipoProcedenciaReclamoService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.fakeApi+'/tipo_procedencia_reclamo';
  //2. Defino el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todos los registros
  show(): Observable<TipoProcedenciaReclamo[]>{
    return this.http.get<TipoProcedenciaReclamo[]>(this.apiUrl);
  }
}
