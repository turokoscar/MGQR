import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { Distrito } from '../models/distrito';
import { Provincia } from '../models/provincia';
import { Region } from '../models/region';

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  //1. Obtengo la ruta del Api
  private apiUrl = environment.apiUrl;
  private apiRegion = this.apiUrl+'/General/GetRegion';
  private apiProvincia = this.apiUrl+'/General/GetProvincia';
  private apiDistrito = this.apiUrl+'/General/GetDistrito'
  //2. Inicializo el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todas las regiones del país
  showRegiones(id: number): Observable<Region[]> {
    const url = `${this.apiRegion}/${id}`;  // Asegúrate de usar la URL correcta con el id
    return this.http.get<Region[]>(url);
  }
  //4. Metodo para obtener todas las provincias de una región
  showProvincias(codigo: string): Observable<Provincia[]>{
    const url = `${this.apiProvincia}/${codigo}`;
    return this.http.get<Provincia[]>(url);
  }
  //5. Metodo para obtener todos los distritos de una provincia
  showDistritos(codigo: string): Observable<Distrito[]>{
    const url = `${this.apiDistrito}/${codigo}`;
    return this.http.get<Distrito[]>(url);
  }
}
