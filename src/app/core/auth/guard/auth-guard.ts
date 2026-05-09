import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
const router = inject(Router);
const userToken = sessionStorage.getItem('userToken');
if(userToken){
  return true
}else{
  router.navigate(['login'])
  return false;
}
};
