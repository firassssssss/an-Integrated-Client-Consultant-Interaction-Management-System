import { Routes } from '@angular/router';
import { ClientComponent } from './client/client.component';
import { ConsultantComponent } from './consultant/consultant.component';
export const routes: Routes = [
  {
    path: 'client',
    component: ClientComponent, 
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./client/client.routes').then(m => m.clientRoutes)
      }
    ]
  },
  {
    path: 'consultant',
    component: ConsultantComponent,  
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./consultant/consultant.routes').then(m => m.consultantRoutes)
      }
    ]

  }
  
];
