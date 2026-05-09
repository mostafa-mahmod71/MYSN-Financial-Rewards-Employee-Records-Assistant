
interface Iform {
  id: number;
  formDescription: string;
  formType: string;
  formMonth: number;
  formYear: number;
  createdAt: string;
  userCreator:string;
  emps: Emp[];
  formTotal: FormTotal;
}

interface FormTotal {
  totalValue: number;
  totalComInsurance: ComInsurance[];
  totalDues: number;
  totalEmpInsurance: EmpInsurance[];
  totalTaxes: number;
  totalWarMartyrs: number;
  totalDeducated: number;
  totalNet: number;
}

interface Emp {
  code: string;
  name: string;
  value: string;
  inshType: string;
  inshBox: string;
  taxType: string;
  taxBox:string ;
  taxPerc: string;
  comInsurance: ComInsurance[];
  empInsurance: EmpInsurance[];
  dues: number;
  taxes: number;
  warMartyrs: number;
  deducted: number;
  net: number;
}

// interface Emp {
//   code: string;
  // name: string;
  // value: number;
  // complement: number;
  // comInsurance: ComInsurance[];
  // dues: number;
  // empInsurance: EmpInsurance[];
  // taxBase: number;
  // taxperc: number;
  // taxes: number;
  // warMartyrs: number;
  // deducted: number;
  // net: number;
// }

interface EmpInsurance {
  oldAge_9?: number;
  unemployment_1?: number;
  bonus_1?: number;
  total?: number;
}

interface ComInsurance {
  oldAge_12?: number;
  'workInjury_1.25'?: number;
  health_3?: number;
  unemployment_1?: number;
  bonus_1?: number;
  total?: number;
}



// form print && preview 
interface formPreview{
  formName: string;
  createdAt: string;
  emps: Emp[];
  total: number;
}
