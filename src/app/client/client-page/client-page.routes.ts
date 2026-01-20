// import { Routes } from '@angular/router';
// import { ZonesComponent } from './zones/zones.component';
// import { DevicesComponent } from '../devices/devices.component';
// import { TicketsComponent } from './tickets/tickets.component';
// import { ClientPageComponent } from './client-page.component';

// export const clientPageRoutes: Routes = [
//   {
//     path: '',
//     component: ClientPageComponent,
//     children: [
//       { path: '', redirectTo: 'tickets', pathMatch: 'full' },  // redirect empty path to tickets
//       { path: 'zones', component: ZonesComponent },
//       { path: 'devices', component: DevicesComponent },
//       {
//         path: 'tickets',
//         loadChildren: () =>
//           import('./tickets/tickets.routes').then((m) => m.ticketsRoutes),
//       },
//     ]
//   }
// ];
import { Routes } from '@angular/router';
import { ZonesComponent } from './zones/zones.component';
import { DevicesComponent } from '../devices/devices.component';
import { TicketsComponent } from './tickets/tickets.component';
import { ClientPageComponent } from './client-page.component';


export const clientPageRoutes: Routes = [
  {
    path: '',
    component: ClientPageComponent,
    children: [
      { path: '', redirectTo: 'tickets', pathMatch: 'full' },
      { path: 'zones', component: ZonesComponent },
      { path: 'devices', component: DevicesComponent },
      {
        path: 'tickets',
        loadChildren: () =>
          import('./tickets/tickets.routes').then((m) => m.ticketsRoutes),
      },

    ]
  }
];
