import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { last, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormsService implements OnInit {
  private readonly httpClient = inject(HttpClient)

    allForms = signal<Iform[]>([]);

  ngOnInit(): void {
    this.getAllForms()
  }
      //  with json-server || api
  // getAllForms():void{
  //    this.httpClient.get<any[]>(`${environment.baseUrl}/allForms`).subscribe({
  //     next:(res)=>{
  //       if(res){
  //         this.allForms.set(res)
  //       }
  //     },error:(err)=>{
  //       console.log(err)
  //     }
  //   })
  // }

      // static json 
  getAllForms():void{
     this.httpClient.get<{allForms:any[]}>(`${environment.baseUrl}`).subscribe({
      next:(res)=>{
        if(res){
          this.allForms.set(res.allForms)
        }
      },error:(err)=>{
        console.log(err)
      }
    })
  }

  saveForm(formdata:any):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/allForms`,formdata)
  }



}
