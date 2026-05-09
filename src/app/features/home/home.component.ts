import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { FormsService } from '../../core/services/forms.service';
import { Iuser } from '../../core/models/iuser';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HOME_LANG } from '../../../dictionary';
import { LanguageService } from '../../core/services/language.service';


@Component({
  selector: 'app-home',
  imports: [DatePipe , DecimalPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit , OnDestroy {
private readonly formsService =inject(FormsService)
private language = inject(LanguageService);
user = signal<Iuser>(JSON.parse(sessionStorage.getItem('userToken') || '{}'))

private timer :any ;
ngOnInit() {
  this.formsService.getAllForms()
  this.timer = setInterval(() => {
    this.today.set(new Date());
  }, 60000);
}
ngOnDestroy(): void {
  clearInterval(this.timer);
}
  // language 
  dict = computed(()=> HOME_LANG[this.language.currLang()])

today= signal<Date>(new Date()) ;
userForms = computed(()=>{
  const all = this.formsService.allForms();
  const currentUser = this.user().name;
  return all.filter(f => f.userCreator === currentUser )
})
totalNet = computed(()=>{
  return this.userForms().reduce((acc , form)=>{
    return acc + form.formTotal.totalNet ;
  },0)
})
latestForm = computed(()=>{
  const forms = this.userForms();
  return forms.length > 0 ? forms[forms.length -1 ] : null ;
})







}
