import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, ɵInternalFormsSharedModule } from '@angular/forms';
import { Iuser } from '../../core/models/iuser';
import { FormsReportsService } from '../../core/services/forms-reports.service';

@Component({
  selector: 'app-reports',
  imports: [ReactiveFormsModule],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.css',
})
export class ReportsComponent implements OnInit {
  private readonly fb =inject(FormBuilder);
  private readonly formsReports = inject(FormsReportsService)

  user:Iuser = {} as Iuser ;
  ngOnInit(): void {
  this.user =  JSON.parse(sessionStorage.getItem('userToken')|| '[]');
  if(this.user.name){
    this.filterForm.patchValue({user:this.user.name})

  }
  }

  filterForm: FormGroup = this.fb.group({
    type:['all'],
    month:[String(new Date().getMonth()+1),Validators.required],
    year:[String(new Date().getFullYear()),Validators.required],
    user:['']
  })

  currForms = signal<Iform[]>([] )   ; 

getForms(){
  if(this.filterForm.invalid) return ;
  this.filterForm.updateValueAndValidity();

  // let type = this.filterForm.get('type')?.value
  // let month = this.filterForm.get('month')?.value
  // let year = this.filterForm.get('year')?.value
  // let user = this.filterForm.get('user')?.value
  let {type , month , year , user} = this.filterForm.value
  this.formsReports.getforms(type , month , year ,user).subscribe({
    next:(res)=>{
      this.currForms.set(res) ;
      if(res.length === 0) console.log(' لا توجد نتائج ')
    },
    error:(err) => console.log(err)
  })
}


// this.filterForm.valueChanges.subscribe(()=>{
//   this.getforms();
// })
// this.filterForm.valueChanges.subscribe(() => {
//   this.getForms(); // هيبحث لوحده أول ما أي قيمة تتغير
// });

}
