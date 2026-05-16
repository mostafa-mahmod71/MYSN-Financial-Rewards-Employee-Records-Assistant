import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class FormsReportsService {
  private readonly http =inject(HttpClient);

  // with json-server || api
// getforms(type:string , month:string, year:string , user:string):Observable<any>{
//   let req = `${environment.baseUrl}/allForms?`
//   if(month?.trim()) req += `formMonth=${month.trim()}`
//   if(year?.trim()) req += `&formYear=${year.trim()}`
//   if(user !== "admin" && user?.trim()) req += `&userCreator=${user.trim()}`
//   if(type !== "all" && type) req += `&formType=${type.trim()}`

//   return this.http.get(req);
//   // return this.http.get(`${environment.baseUrl}/allForms?formMonth=${month.trim()}&formYear=${year.trim()}&userCreator=${user.trim()}${type!=="all"?"&formType="+type.trim():""}`)
// }

  // with static json
getAll():Observable<any>{
  return this.http.get(environment.baseUrl)
}
getforms(type:string , month:string, year:string , user:string , roleUser:string):Observable<any>{
  return this.getAll().pipe(
    map((data:any)=>{
      let forms =data.allForms || [];
      return forms.filter((f:any)=>{
        const mMonth = month.trim() ? String(f.formMonth) === month.trim() : false ;
        const mYear = year.trim() ? String(f.formYear) === year.trim() :false ;
        const mUser = (roleUser !== "admin" && user.trim())? f.userCreator === user.trim():true ;
        const mType = (type !== "all"&& type )? f.formType === type : true ;
        return mMonth && mYear && mUser &&  mType
      })
      
    })
  )
  

}
}
