import { HttpClient,HttpHeaders } from '@angular/common/http';
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

 //Obtengo el peso maximo del expediente
  pesoMaxKB: number = environment.file_max_length_kb;
  //2. Defino el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todos los registros
  show(estado: number): Observable<Expediente[]>{
  //4. Aca colocamos la logica para obtener los expedientes de acuerdo a su estado (Por ahora obviamos esto)
    return this.http.get<Expediente[]>(this.fakeApi);
  }
  //4. Metodo para obtener todos los registros
  guardar(parametro: any): Observable<ExpedienteResponse> {
    return this.http.post(this.apiUrl,parametro);
  }
  
  // //5. Metodo para poder cargar archivos
  // uploadFile(formData: FormData): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'accept': '/'
  //   });

  //   return this.http.post(this.apiUrlarchivo, formData, { headers });
  // }


}
