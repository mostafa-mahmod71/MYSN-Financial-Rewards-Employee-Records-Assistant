import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class EmpsearchService {
  private readonly http = inject(HttpClient);



  getEmp(code:string):Observable<any>{
    return this.http.get<any[]>(`${environment.baseUrl}/empsearch?code=${code.trim()}`).pipe(
      map(res=> res.length >0 ? res[0] :'الموظف غير موجود')
    )
  }
  updateBoxes(empId:string , data:any):Observable<any>{
    return this.http.patch(`${environment.baseUrl}/empsearch/${empId}`, data)
  }

}
