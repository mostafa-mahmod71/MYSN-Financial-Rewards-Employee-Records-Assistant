import { computed, DOCUMENT, inject, Injectable, signal } from '@angular/core';
import { NAV_LANG } from '../../../dictionary';

@Injectable({
  providedIn: 'root',
})
export class LanguageService {
   document = inject(DOCUMENT)
  currLang = signal<"ar"|"en">((localStorage.getItem('lang') as "ar"| "en") || "ar");

    lang(){
    if(this.document.dir === "rtl"){
      this.document.documentElement.dir = "ltr"
      this.document.documentElement.lang = "en"
      this.currLang.set("en")
      localStorage.setItem('lang' , "en")
    }else{
      this.document.dir = "rtl"
      this.document.documentElement.lang = "ar"
      this.currLang.set("ar")
      localStorage.setItem('lang', "ar")
          
    }
  }

}
