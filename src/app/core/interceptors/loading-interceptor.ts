  import { HttpInterceptorFn } from '@angular/common/http';
  import { inject } from '@angular/core';
  import { LoadingService } from '../services/loading.service';
  import { delay, finalize } from 'rxjs';

  export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
    const loadings =inject(LoadingService);
    loadings.show();
    return next(req).pipe(
      
      finalize(()=>{
        loadings.hide()
      } 
    )
        
    )
  };
