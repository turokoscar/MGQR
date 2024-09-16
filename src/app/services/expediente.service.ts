import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { ExpedienteResponse } from '../models/expediente-response';
import { ExpedienteConsultaResponse } from '../models/expediente-consulta-response';
import { Expediente } from '../models/expediente';
import { ExpedienteManagement } from '../models/expediente/expediente-management';

@Injectable({
  providedIn: 'root'
})
export class ExpedienteService {
  //1. Obtengo la ruta del api
  private apiUrl = environment.apiUrl;
  private fakeApi = environment.fakeApi+'/expedientes';

 //Obtengo el peso maximo del expediente
  pesoMaxKB: number = environment.file_max_length_kb;
  //2. Defino el constructor
  constructor( private http: HttpClient ) { }
  //3. Metodo para obtener todos los registros
  show(estado: number): Observable<Expediente[]>{
    return this.http.get<Expediente[]>(this.fakeApi);
  }
  //4. Método para obtener los datos de un expediente
  showById(id: number): Observable<Expediente>{
    const url = `${this.fakeApi}/${id}`;
    return this.http.get<Expediente>(url);
  }
  //5. Metodo para obtener todos los registros
  guardar(parametro: any): Observable<ExpedienteResponse> {
    const url = this.apiUrl+'/Expediente/Guardar';
    return this.http.post(url, parametro);
  }
  //6. Metodo para poder actualizar un registro
  update(expediente: ExpedienteManagement): Observable<ExpedienteManagement>{
    const url = this.fakeApi;
    return this.http.put<ExpedienteManagement>(url, expediente);
  }
  //7. Metodo para poder cargar archivos
  upload(formData: FormData): Observable<any> {
    const headers = new HttpHeaders({
      'accept': '/'
    });
    return this.http.post(this.apiUrl+'/General/upload', formData, { headers });
  }


  consultar(parametro: any): Observable<ExpedienteConsultaResponse> {
    return this.http.post(this.apiUrl+'/Expediente/Consultar',parametro);
  }
  // uploadFile(formData: FormData): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'accept': '/'
  //   });
  //   return this.http.post(this.apiUrl+'/General/upload', formData, { headers });


  // }


  // upload(formData: FormData): Observable<any> {
  //   return this.http.post<FormData>(`${this.apiUrl}/General/upload`, formData);
  // }


  //  uploadFile(file: Blob): Observable<any> {
  //   const form = new FormData();
  //   form.append('file', file);
  //   return this.http.post(this.apiUrl+'/General/upload', form, {
  //     headers: {
  //       'Content-type': 'multipart/form-data'
  //     }
  //   });
  // }

}
