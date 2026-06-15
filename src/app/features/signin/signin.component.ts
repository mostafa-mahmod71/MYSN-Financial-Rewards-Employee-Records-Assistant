import { Component, computed, inject, signal, Signal } from '@angular/core';
import { AuthService } from '../../core/auth/service/auth.service';
import{ReactiveFormsModule  ,Validators, FormBuilder} from'@angular/forms'
import { Iuser } from '../../core/models/iuser';
import { Router } from '@angular/router';
import { SIGN_IN } from '../../../dictionary'
import { LanguageService } from '../../core/services/language.service';
@Component({
  selector: 'app-signin',
  imports: [ReactiveFormsModule],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css',
})
export class SigninComponent {
  private readonly authService = inject(AuthService);
  private readonly fb = inject(FormBuilder)
  private readonly router =inject(Router);
  private language = inject(LanguageService);

  dict = computed(()=>SIGN_IN[this.language.currLang()])

  logError = signal<string|null>(null);
  user = signal<Iuser|null>(null);


  loginForm =this.fb.group({
    name:['',[ Validators.required] ],
    pass:['',[Validators.required,Validators.minLength(4)]]
  })

login(guest?:string){
  this.logError.set(null);
if(guest){
  let log:any = {name:guest, role:guest}
    sessionStorage.setItem('userToken' ,JSON.stringify(log))
    this.user.set(log)
    this.router.navigate(['/home'])

}else{
  if(this.loginForm.valid){
    this.authService.signin(this.loginForm.value).subscribe({
      next:(res)=>{
        if(res && res.length>0){
          this.user.set(res[0])
          sessionStorage.setItem('userToken' ,JSON.stringify(res[0]))
          this.router.navigate(['/home'])
          
        }else{
          this.logError.set("wrong name or password");
        }
      },
      error:(err)=>{
        this.logError.set("server error : " + err)
      }
    })
  }else{
    this.loginForm.markAllAsTouched()
  }
}

}
}
