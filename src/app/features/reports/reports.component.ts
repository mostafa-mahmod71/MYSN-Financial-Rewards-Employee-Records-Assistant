import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Iuser } from '../../core/models/iuser';
import { FormsReportsService } from '../../core/services/forms-reports.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reports',
  imports: [ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  private readonly fb =inject(FormBuilder);
  private readonly formsReports = inject(FormsReportsService)
  private readonly router = inject(Router)

  user:Iuser = {} as Iuser ;
  ngOnInit(): void {
  this.user =  JSON.parse(sessionStorage.getItem('userToken')|| '[]');
  if(this.user.name && this.user.role){
    this.filterForm.patchValue({user:this.user.name})
    this.filterForm.patchValue({roleUser:this.user.role})

  }
  }

  filterForm: FormGroup = this.fb.group({
    type:['all'],
    month:[String(new Date().getMonth()+1),Validators.required],
    year:[String(new Date().getFullYear()),Validators.required],
    user:[''],
    roleUser:['']
  })

  currForms = signal<Iform[]>([])   ; 
getForms(){
  if(this.filterForm.invalid) return ;
  this.filterForm.updateValueAndValidity();

  let {type , month , year , user , roleUser} = this.filterForm.value
  this.formsReports.getforms(type , month , year ,user , roleUser).subscribe({
    next:(res)=>{
      this.currForms.set(res) ;
      if(res.length === 0) console.log(' لا توجد نتائج ')
    },
    error:(err) => console.log(err)
  })
}

 currForm = signal<Iform | null>(null)
print(ID:number , type:string){
  this.currForm.set(null)
  if(this.currForms().length>0){
    this.currForm.set( this.currForms().find(form => form.id === ID)|| null) 
    if(this.currForm()) localStorage.setItem('currForm', JSON.stringify(this.currForm()));
    const url = this.router.serializeUrl(this.router.createUrlTree(['/reports-viewer',type]));
    window.open(url, '_blank');
  }else{
    alert('عفواً لم يتم العثور على بيانات الاستمارة ')
  }

}



}
