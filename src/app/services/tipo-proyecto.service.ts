import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { TipoProyecto } from '../models/tipo-proyecto';

@Injectable({
  providedIn: 'root'
})
export class TipoProyectoService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.apiUrl+'/General/GetTipoProyecto';
  //2. Defino el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todos los registros
  show(): Observable<TipoProyecto[]>{
    return this.http.get<TipoProyecto[]>(this.apiUrl);
  }
}
