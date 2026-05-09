import { HttpClient } from '@angular/common/http';
import { inject, Injectable, OnInit, signal } from '@angular/core';
import { environment } from '../../../environments/environment';
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
  getAllForms():void{
     this.httpClient.get<any[]>(`${environment.baseUrl}/allForms`).subscribe({
      next:(res)=>{
        if(res){
          this.allForms.set(res)
        }
      },error:(err)=>{
        console.log(err)
      }
    })
  }

  saveForm(formdata:any):Observable<any>{
    return this.httpClient.post(`${environment.baseUrl}/allForms`,formdata)
  }



  // net  في ال function دي هنمسك 
  //  هنمسك كل emp ونلوب عليه بناءا على نوع التأمينات هناخد الشامل نحسب عليه او هيكون زيرو وهنلوب على النسب نضربها في الشامل
  //  بتاعت ال 11 اهم عشان نطلع الصافي وهيتسجل نوع التأمينات مع ال موظف عشان العرض وكذلك في الضرايب هنسجل الوعاء نفسو وممكن نسجل مبلغ الضريبة والشهداء
}
