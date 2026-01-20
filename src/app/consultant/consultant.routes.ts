import { Routes } from '@angular/router';
import { ConsultantComponent } from './consultant.component';
import { ConsultantLoginComponent } from './consultant-login/consultant-login.component';
import { ConsPageComponent } from './cons-page/cons-page.component';  // import the page component

export const consultantRoutes: Routes = [
  {
    path: '',
    component: ConsultantComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: ConsultantLoginComponent
      },
        {
          path: 'page',
          component: ConsPageComponent,    children: [
        {    
          path: '',
          loadChildren: () =>
            import('./cons-page/cons-page.routes').then(m => m.ConsPageRoutes)
        }
    ]
        }
      ]
    }
];
