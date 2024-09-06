import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { TipoDocumento } from '../models/tipo-documento';

@Injectable({
  providedIn: 'root'
})
export class TipoDocumentoService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.apiUrl+'/tipo_documento';
  //2. Defino el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todos los registros
  show(): Observable<TipoDocumento[]>{
    return this.http.get<TipoDocumento[]>(this.apiUrl);
  }
}
