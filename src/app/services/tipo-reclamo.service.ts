import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { TipoReclamo } from '../models/tipo-reclamo';

@Injectable({
  providedIn: 'root'
})
export class TipoReclamoService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.apiUrl+'/tipo_reclamo';
  //2. Defino el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todos los registros
  show(): Observable<TipoReclamo[]>{
    return this.http.get<TipoReclamo[]>(this.apiUrl);
  }
}
