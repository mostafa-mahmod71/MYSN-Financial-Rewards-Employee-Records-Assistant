import { Component, computed, DOCUMENT, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Iuser } from '../../core/models/iuser';
import { NAV_LANG } from '../../../dictionary';
import { initFlowbite } from 'flowbite';
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  private readonly router = inject(Router)
  private language = inject(LanguageService)
  // private d\zocument = inject(DOCUMENT);
  // currLang = signal<"ar"|"en">((localStorage.getItem('lang') as "ar"| "en") || "ar");
  user = signal<Iuser|null>(JSON.parse(sessionStorage.getItem('userToken')|| 'null'))
  dict = computed(()=> NAV_LANG[this.language.currLang()])


ngOnInit(): void {
  this.language.document.documentElement.dir = this.language.currLang() === 'ar' ? 'rtl' : 'ltr';
  initFlowbite()
}

  lang(){
    this.language.lang()
  }

  menuisOpen = signal<boolean>(false);
  salaryisOpen = signal<boolean>(false);
  toggleMainMenu(){
    this.menuisOpen.update(val=> !val);
  }
  togglesalarymenu(){
    this.salaryisOpen.update(val => !val);
  }

  logout(){

    sessionStorage.removeItem('userToken')
    this.router.navigate(['login'])
    this.toggleMainMenu()

  }
}
