import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const guestGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userToken = sessionStorage.getItem('userToken');

  if(!userToken){
    return true
  }else{
    router.navigate(['home'])
    return false;
  }
  
};
