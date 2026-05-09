import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { EmpsearchService } from '../../core/services/empsearch.service';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { Iuser } from '../../core/models/iuser';
import { FormsService } from '../../core/services/forms.service';
import { CalcBonusFormService } from '../../core/services/calc-bonus-form.service';
import { forkJoin } from 'rxjs';
import { BONUS_LANG } from '../../../dictionary'
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-bonus',
  imports: [ReactiveFormsModule ],
  providers:[DatePipe],
  templateUrl: './bonus.component.html',
  styleUrl: './bonus.component.css',
})
export class BonusComponent implements OnInit, OnDestroy {
  private readonly fb = inject(FormBuilder);
  private readonly empSearch = inject(EmpsearchService);
  private readonly formsService = inject(FormsService);
  private readonly calcBonusService = inject(CalcBonusFormService)
  private readonly router = inject(Router);
  private fDate = inject(DatePipe);
  private language = inject (LanguageService)
  userData:Iuser = JSON.parse(sessionStorage.getItem('userToken') || '{}') 
  form = signal<formPreview>(JSON.parse(localStorage.getItem('form') || '{}'));
  autosave: any;
  currDate = new Date()
  formatedDate = this.fDate.transform(this.currDate , 'dd/MM/yyy')
  ngOnInit(): void {
    // مع كل تشغيل للكومبوننت يجيب ال form من ال local storage ويعمل صفوف على قد ال emps وبعدين يخزن ويعرض
    this.previewForm();
    if(this.userData.name ){
      this.bonusForm.patchValue({userCreator:this.userData.name})
    }
    this.autosave = setInterval(() => {
      localStorage.setItem('form', JSON.stringify(this.bonusForm.getRawValue()));
      this.form.set(this.bonusForm.getRawValue());
    }, 60000);
    
  }
  ngOnDestroy(): void {
    clearInterval(this.autosave);
  }
  dict = computed(()=> BONUS_LANG[this.language.currLang()])
  // search emp name with code
  getEmp(event: Event, index: number) {
    const code = (event.target as HTMLInputElement).value;
    const currRow = this.empsArray.at(index) as FormGroup;
    const isduplicate = this.empsArray.getRawValue().some((emp , i )=> emp.code === code && i !== index)
    /// لو الكود مكرر
    if(isduplicate){
      currRow.get('name')?.setValue("duplicated code",{emitEvent:true})
      currRow.get('code')?.setErrors({duplicate:true})
      return; 
    }
    if (code.length > 3) {
      this.empSearch.getEmp(code).subscribe({
        next: (res) => {
          currRow.get('id')?.setValue(res.id);
          currRow.get('name')?.setValue(res.name, { emitEvent: true });
          currRow.get('taxBox')?.setValue(res.taxBox);
          currRow.get('inshBox')?.setValue(res.inshBox);
        },
        error: (err) => console.log(err),
      });
    } else {
      currRow.patchValue({ name: '' });
      currRow.patchValue({ taxBox: '' });
      currRow.patchValue({ inshBox: '' });
    }
  }

  totalForm = signal<number>(0);
  calcTotal() {
    this.totalForm.set(0);
    this.empsArray.controls.forEach((value) =>
      this.totalForm.update((curr) => curr + Number(value.get('value')?.value) || 0),
    );
    this.bonusForm.get('total')?.setValue(this.totalForm());
  }

  taxList: RegExp = /^(\.1|\.15|\.2|\.225|\.25|\.275)$/;

  // الاستمارة
  bonusForm: FormGroup = this.fb.group({
    formDescription: ['', Validators.required],
    formType:['',Validators.required],
    formMonth:['',[Validators.required ,Validators.pattern(/^(?:[1-9]|1[0-2])$/) ] ],
    formYear:['',[Validators.required ,Validators.pattern(/^2[01][0-9]{2}$/)] ],
    emps: this.fb.array([this.createEmpRow()]),
    total: [0],
    userCreator:[''],
    createdAt: [this.formatedDate],
  });

  // صف جديد فاضي emps
  createEmpRow(): FormGroup {
    return this.fb.group({
      id:[''],
      code: ['', [Validators.required, Validators.pattern(/^[0-9]{4,8}$/)]],
      name: [{ value: '', disabled: true }],
      value: [
        null,
        [
          Validators.required,
          Validators.max(999000),
          Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$'),
        ],
      ],
      inshType: ['without'],
      inshBox: [''],
      taxType: ['auto'],
      taxBox:[''],
      taxPerc: ['', Validators.pattern(this.taxList)],
    });
  }

  // اختصار لتسمية ال emps في ال bonus form
  get empsArray() {
    return this.bonusForm.get('emps') as FormArray;
  }
  addNewRow() {
    this.empsArray.push(this.createEmpRow());
  }
  deleteRow(index: number) {
    this.empsArray.removeAt(index);
    localStorage.setItem('form', JSON.stringify(this.bonusForm.getRawValue()));
    this.form.set(this.bonusForm.getRawValue());
    this.calcTotal();
  }

  // اظهار بيانات ال form
  previewForm() {
    if (this.form().emps && this.form().emps.length > 0) {
      this.empsArray.clear();
      this.form().emps.forEach(() => {
        this.addNewRow();
      });
      this.bonusForm.patchValue(this.form());
      this.calcTotal();
    }
  }
  clearForm(verify?:boolean) {
    if (verify || confirm('are you sure you want to clear all data ? ')) {
      localStorage.removeItem('form');
      this.empsArray.clear();
      this.bonusForm.reset({
        formDescription: '',
        createdAt: new Date().toLocaleDateString(),
        total: 0,
      });
      this.totalForm.set(0);
      setTimeout(() => {
        this.addNewRow();
      }, 0);
    }
  }

  // prPreviewOpn = signal<boolean>(false);

  prPreviewToggle() {
    // this.prPreviewOpn.update(val=> !val)
    this.calcTotal();
    const url = this.router.serializeUrl(this.router.createUrlTree(['/printPreview']));
    window.open(url, '_blank');
    localStorage.setItem('form', JSON.stringify(this.bonusForm.getRawValue()));
  }

  saveForm(){
    if(this.bonusForm.valid){
      const formsData = this.bonusForm.getRawValue()
      const calcedEmps = this.calcBonusService.clac(formsData.emps)

      const finalForm = {
        ...formsData,
        emps:calcedEmps,
          formTotal:{
            totalValue:this.totalForm(),
            totalComInsurance:calcedEmps.reduce((acc:any , e:any)=> {
              Object.keys(e.comInsurance).forEach(k => acc[k] = Number(((acc[k] || 0 ) + e.comInsurance[k]).toFixed(2)))
              return acc
            }, {}),
            totalEmpInsurance:calcedEmps.reduce((acc:any , e:any)=> {
              Object.keys(e.empInsurance).forEach(k => acc[k] = Number(((acc[k] || 0 ) + e.empInsurance[k]).toFixed(2)))
              return acc
            }, {}),
            totalDues:calcedEmps.reduce((acc:number , e:any)=> acc +Number(e.dues), 0),
            totalTaxes:calcedEmps.reduce((acc:number , e:any)=> acc +Number(e.taxes), 0),
            totalWarMartyrs:calcedEmps.reduce((acc:number , e:any)=> acc +Number(e.warMartyrs), 0),
            totalDeducated:calcedEmps.reduce((acc:number , e:any)=> acc +Number((e.deducted).toFixed(2)), 0),
            totalNet:calcedEmps.reduce((acc:number , e:any)=> acc +Number(e.net), 0),
          }
      }

    this.formsService.saveForm(finalForm).subscribe({
      next:()=> {
        const allReq =  calcedEmps.map((emp)=>{
          const updatedBoxes ={
            taxBox: emp.taxBox,
            inshBox:emp.inshBox
          } 
           return this.empSearch.updateBoxes(emp.id ,updatedBoxes )
        })
        if(allReq.length >0 ){
            forkJoin(allReq).subscribe({
              next:(res)=>{
                  alert(` form saved succesfully with all employees :) ${res.length} `)
                  this.clearForm(true)
                
              },
            error:(err)=> console.log('Error updating boxes:', err)
          })
        
    } else{
      this.clearForm(true)
    }
  },error:(err)=> console.log('error saving form ' , err)
});
}else{
  console.log("form isn't valid try again later ")
}
}
  
  }
