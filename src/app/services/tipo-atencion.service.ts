import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { TipoAtencion } from '../models/tipo-atencion';

@Injectable({
  providedIn: 'root'
})
export class TipoAtencionService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.apiUrl+'/General/GetTipoAtencion';
  //2. Defino el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todos los registros
  show(): Observable<TipoAtencion[]>{
    return this.http.get<TipoAtencion[]>(this.apiUrl);
  }
}
