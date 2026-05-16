import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable, tap } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

        //  with json-server
  // signin(loginform:any):Observable<any>{
  //   return this.httpClient.get(`${environment.baseUrl}/users?name=${loginform.name}&pass=${loginform.pass}`)
  // }

        //  with static json
  getData():Observable<{users:any[]}>{
    return this.httpClient.get<{users:any[]}>(`${environment.baseUrl}`)
  }
    signin(loginform:any):Observable<any>{
      return this.getData().pipe(
        map(data => data.users.filter((u:any)=> u.name === loginform.name && u.pass === loginform.pass))
      )
  }
  
}
