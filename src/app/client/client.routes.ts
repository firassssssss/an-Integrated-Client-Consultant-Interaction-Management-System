import { Routes } from '@angular/router';
import { ClientComponent } from './client.component';
import { ClientLoginComponent } from './client-login/client-login.component';
import { ClientPageComponent } from './client-page/client-page.component';  // import the page component

export const clientRoutes: Routes = [
  {
    path: '',
    component: ClientComponent,
    children: [
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: ClientLoginComponent
      },
      {
        path: 'page',
        component: ClientPageComponent,    children: [
      {
        path: '',
        loadChildren: () =>
          import('./client-page/client-page.routes').then(m => m.clientPageRoutes)
      }
    ]
      }
    ]
  }
];
