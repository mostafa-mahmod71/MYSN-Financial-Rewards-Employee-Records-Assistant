import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { PRINT_BONUS } from '../../../dictionary'
import { LanguageService } from '../../core/services/language.service';

@Component({
  selector: 'app-print-preview',
  imports: [CommonModule],
  templateUrl: './bonus-pre-preview.html',
  styleUrl: './bonus-pre-preview.css',
})
export class PrintPreviewComponent {
private language = inject(LanguageService)
    currDate = new Date()
  dict = computed(()=> PRINT_BONUS[this.language.currLang()])
  bonusForm:formPreview  = JSON.parse(localStorage.getItem( 'form')|| '[]' ) ;
  empsForm:Emp[] = this.bonusForm.emps;

  

}