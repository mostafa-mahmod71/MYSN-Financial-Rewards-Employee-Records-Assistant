import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-report-preview',
  imports: [CommonModule,],
  templateUrl: './report-preview.component.html',
  styleUrl: './report-preview.component.css',
})
export class ReportPreviewComponent implements OnInit {

  private readonly router = inject(ActivatedRoute)
  reportData = signal<Iform|null>(null);
  reportType = signal<string>('');
  ngOnInit(): void {
    const saveData = localStorage.getItem('currForm');
    if(saveData){
      this.reportData.set(JSON.parse(saveData))
      localStorage.removeItem('currForm');
    }
    this.reportType.set(this.router.snapshot.params['type']);
  }
  today:Date = new Date()

toAr(value: any): string {
  if (value === null || value === undefined) return '';
  
  return new Intl.NumberFormat('ar-EG', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(Number(value));
}

tafkeet(n: any): string {
    if (n === undefined || n === null || n === 0) return "صفر";
    
    const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
    const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
    const hundreds = ["", "مائة", "مائتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
    
    const convertChunk = (num: number): string => {
        let str = "";
        if (num >= 100) {
            str += hundreds[Math.floor(num / 100)] + " ";
            num %= 100;
        }
        if (num >= 11 && num <= 19) {
            const map: any = { 11: "أحد عشر", 12: "اثنا عشر", 13: "ثلاثة عشر", 14: "أربعة عشر", 15: "خمسة عشر", 16: "ستة عشر", 17: "سبعة عشر", 18: "ثمانية عشر", 19: "تسعة عشر" };
            str += map[num];
        } else {
            if (num % 10 > 0) str += ones[num % 10] + (num > 10 ? " و " : "");
            if (Math.floor(num / 10) > 0) str += tens[Math.floor(num / 10)];
        }
        return str.trim();
    };

    let result = "";
    let mainAmount = Math.floor(n);
    let fractions = Math.round((n % 1) * 100);

    if (mainAmount >= 1000) {
        result += convertChunk(Math.floor(mainAmount / 1000)) + " ألفاً و ";
        mainAmount %= 1000;
    }
    result += convertChunk(mainAmount);
    
    let finalStr =result.trim() + " جنيهاً مصرياً";
    if (fractions > 0) {
        finalStr += " و " + convertChunk(fractions) + " قرشاً";
    }
    return finalStr + " لا غير";
}


}
