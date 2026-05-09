import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CalcBonusFormService {

  private readonly comUpagePerc = {"oldAge_12":0 , "workInjury_1.25": 0.0125 , "health_3": 0.03 , "unemployment_1": 0 , "bonus_1": 0}
  private readonly empUpagePerc = {"oldAge_9": 0 ,"unemployment_1": 0.01 , "bonus_1": 0}
  private readonly comUnderagePerc ={"oldAge_12":0.12 , "workInjury_1.25": 0.0125 , "health_3": 0.03 , "unemployment_1": 0.01 , "bonus_1": 0.01  }
  private readonly empUnderagePerc = { "oldAge_9": 0.09 ,"unemployment_1": 0.01 , "bonus_1": 0.01 };
  private readonly inshMax:number = 16700
  private readonly taxLevMax:number[] = [(60000/12),(15000/12),(15000/12),(130000/12),(200000/12),(800000/12),9999999 ] 
  private readonly taxLevPerc:number[]= [ 0 , 0.1 , 0.15 , 0.2 , 0.225 , 0.25 , 0.275 ]
  clac(emps:Emp[]):any[]{
  return emps.map((emp)=>{
    const val = Number(emp.value);
    const inshBox = Number(emp.inshBox);
    const taxBox = Number(emp.taxBox);
    const taxPerc = Number(emp.taxPerc);

    let currInshBox = Math.max(0 , Math.min(val , this.inshMax - inshBox));
    //  company Inshurance
    let comInsh = {"oldAge_12":0 , "workInjury_1.25": 0 , "health_3": 0 , "unemployment_1": 0 , "bonus_1": 0 , "total": 0 };
    //  employee Inshurance
    let empInsh = {"oldAge_9": 0 ,"unemployment_1": 0 , "bonus_1": 0 , "total": 0 };
      //  calc inshurance
    if(emp.inshType !== "without"){
      if(emp.inshType === "upAge"){
        comInsh =  this.calcInsh(currInshBox , this.comUpagePerc);
        empInsh = this.calcInsh(currInshBox , this.empUpagePerc);
        // comInsh.oldAge_12 = currInshBox * this.comUpagePerc.oldAge_12
        // comInsh.health_3 = currInshBox * this.comUpagePerc.health_3
        // comInsh.bonus_1 = currInshBox * this.comUpagePerc.bonus_1
        // comInsh.unemployment_1 = currInshBox * this.comUpagePerc.unemployment_1
        // comInsh['workInjury_1.25'] = currInshBox * this.comUpagePerc['workInjury_1.25']
        // comInsh.total = comInsh.bonus_1 + comInsh.health_3 + comInsh.oldAge_12 + comInsh.unemployment_1 + comInsh['workInjury_1.25'] 
      }else if(emp.inshType === "underAge"){
        comInsh = this.calcInsh(currInshBox , this.comUnderagePerc);
        empInsh = this.calcInsh(currInshBox , this.empUnderagePerc);
      }
    }else{ currInshBox = 0 }


    let currTaxBase =val - empInsh.total
    // taxes
    let taxes = 0;
    // calc taxes 
    if(emp.taxType === "manual"){
      taxes = Number((currTaxBase * Number(taxPerc)).toFixed(2));
    }else if(emp.taxType === "auto"){
      taxes = Number((this.getTax(taxBox + currTaxBase)-this.getTax(taxBox)).toFixed(2));
    }

    // shuhadaa + calculation
    let warMartyrs:number = Number((currTaxBase*0.0005).toFixed(2))

    // dues 
    let dues = Number(val + comInsh.total);
    // cutters 
    let deducted:number = Number((empInsh.total + comInsh.total + taxes + warMartyrs).toFixed(2))
    // net value
    let netValue:number = Number(dues-deducted);

    return {
      ...emp,
      comInsurance:comInsh,
      empInsurance:empInsh,
      dues:dues,
      taxes:taxes,
      warMartyrs:warMartyrs,
      deducted:deducted,
      net:netValue,
      inshBox:Number(inshBox+currInshBox),
      taxBox:Number(taxBox+currTaxBase)

    }
  })
}


private calcInsh(currInshBox:number , inshPerc:any){
  return Object.entries(inshPerc).reduce((acc:any , [key ,perc]:[string , any])=>{
    const  calcValue = Number((currInshBox * perc).toFixed(2));
    acc[key] = calcValue ;
    acc.total =Number((acc.total + calcValue).toFixed(2))
    return acc
  }, {total: 0})

}

private getTax(taxBase:number):number{
  let tax = 0;
  let currBase = taxBase;
  for(let i:number =0 ; i < this.taxLevMax.length ; i++){
    if(currBase > this.taxLevMax[i]){
      tax += Number((this.taxLevMax[i]* this.taxLevPerc[i]).toFixed(2));
      currBase -= Number(this.taxLevMax[i]);
    }else{
      tax += Number((currBase * this.taxLevPerc[i]).toFixed(2));
      break ; 
    }
  }

  return Number((tax).toFixed(2))
}

}
