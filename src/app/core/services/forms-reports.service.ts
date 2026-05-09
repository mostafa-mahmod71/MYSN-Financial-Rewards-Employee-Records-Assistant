import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FormsReportsService {
  private readonly http =inject(HttpClient);


getforms(type:string , month:string, year:string , user:string):Observable<any>{
  let req = `${environment.baseUrl}/allForms?`
  if(month?.trim()) req += `formMonth=${month.trim()}`
  if(year?.trim()) req += `&formYear=${year.trim()}`
  if(user !== "admin" && user?.trim()) req += `&userCreator=${user.trim()}`
  if(type !== "all" && type) req += `&formType=${type.trim()}`

  return this.http.get(req);
  // return this.http.get(`${environment.baseUrl}/allForms?formMonth=${month.trim()}&formYear=${year.trim()}&userCreator=${user.trim()}${type!=="all"?"&formType="+type.trim():""}`)
}
}
