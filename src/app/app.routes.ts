import { Routes } from '@angular/router';
import { SigninComponent } from './features/signin/signin.component';
import { MainComponent } from './layouts/main/main.component';
import { AuthComponent } from './layouts/auth/auth.component';
import { SignupComponent } from './features/signup/signup.component';
import { NotfoundComponent } from './features/notfound/notfound.component';
import { authGuard } from './core/auth/guard/auth-guard';
import { guestGuard } from './core/auth/guard/guest-guard';
import { HomeComponent } from './features/home/home.component';
import { BonusComponent } from './features/bonus/bonus.component';
import { PrintPreviewComponent } from './features/bonus-pre-preview/bonus-pre-preview';
import { ReportsComponent } from './features/reports/reports.component';
import { ReportPreviewComponent } from './features/report-preview/report-preview.component';

export const routes: Routes = [

    {path:'',component:MainComponent,title:"MYSN | Home" ,  canActivate:[authGuard],children:[
            {path:'home', component:HomeComponent, title:'MYSN | Home'},
            {path:'bonus',component:BonusComponent, title: 'MYSN | bonus'},
            {path:'reports',component:ReportsComponent, title: 'MYSN |Reports'},
            
        ]
    },
    {path:'reports-viewer/:type',component:ReportPreviewComponent , title :'MYSN |preview' ,canActivate:[authGuard]},
    {path:'printPreview',component:PrintPreviewComponent ,title: 'MYSN | Print & preview',canActivate:[authGuard] },
    {path:'',component:AuthComponent,title: 'MYSN | Authontication', children:[
        {path:'login', component:SigninComponent, title:'MYSN | Sign in' , canActivate:[guestGuard]},
    ]},
    {path:'**' ,component:NotfoundComponent , title:'MYSN | Page not found'}
];
