import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import {saveAs} from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportData(data: any[], format: string): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    switch (format) {
      case 'excel':
        this.exportToExcel(ws);
        break;
      case 'csv':
        this.exportToCsv(ws);
        break;
      case 'json':
        this.exportToJson(data);
        break;
      case 'text':
        this.exportToText(data);
        break;
      default:
        console.error('Formato no soportado:', format);
    }
  }
  private exportToExcel(ws: XLSX.WorkSheet): void {
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Consolidado');
    XLSX.writeFile(wb, 'data-expedientes.xlsx');
  }
  private exportToCsv(ws: XLSX.WorkSheet): void {
    const csvData: string = XLSX.utils.sheet_to_csv(ws);
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'data.csv');
  }
  private exportToJson(data: any[]): void {
    const jsonData: string = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json;charset=utf-8;' });
    saveAs(blob, 'data.json');
  }
  private exportToText(data: any[]): void {
    const textData: string = data.map(item => JSON.stringify(item)).join('\n');
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8;' });
    saveAs(blob, 'data.txt');
  }
}
