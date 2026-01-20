import { Routes } from '@angular/router';
import { TicketsComponent } from './tickets.component';
import { AddTComponent } from './add-t/add-t.component';
import { ViewTComponent } from './view-t/view-t.component';

export const ticketsRoutes: Routes = [
  {
    path: '',
    component: TicketsComponent,
    children: [
      { path: 'add-t', component: AddTComponent },
      { path: 'view-t', component: ViewTComponent },
      { path: '', redirectTo: 'add-t', pathMatch: 'full' }  // default child route
    ]
  }
];
