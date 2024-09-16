import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { Usuario } from '../models/usuario/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.fakeApi+'/usuario';
  constructor( private http: HttpClient ) { }
  //2. Obtengo la lista de usuarios
  show(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.apiUrl);
  }
}
