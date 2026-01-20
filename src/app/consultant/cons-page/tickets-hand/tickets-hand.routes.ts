import { Routes } from '@angular/router';
import { TicketsHandComponent } from './tickets-hand.component';
import { ViewTComponent } from '../../../client/client-page/tickets/view-t/view-t.component';

export const ticketsHandRoutes: Routes = [
  {
    path: '',
    component: TicketsHandComponent,
    children: [
      { path: 'view-t', component: ViewTComponent },
      { path: '', redirectTo: 'view-t', pathMatch: 'full' } // Optional default
    ]
  }
];
