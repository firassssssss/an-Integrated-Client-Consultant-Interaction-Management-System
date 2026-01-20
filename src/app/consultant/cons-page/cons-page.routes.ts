// import { Routes } from '@angular/router';
// import { AddClientsComponent } from './add-clients/add-clients.component';
// import { ConsPageComponent } from './cons-page.component';
// import { ZonesComponent } from '../../client/client-page/zones/zones.component';
// export const ConsPageRoutes: Routes = [
//   {
//     path: '',
//     component: ConsPageComponent,
//     children: [
//       { path: '', redirectTo: 'tickets-hand', pathMatch: 'full' },  // default redirect
//       { path: 'add-clients', component: AddClientsComponent },
//       {
//         path: 'tickets-hand',
//         loadChildren: () =>
//           import('./tickets-hand/tickets-hand.routes').then(m => m.ticketsHandRoutes)
//       },
//       { path: 'zones', component: ZonesComponent },
//       // optionally add tickets here if needed
//     ]
//   }
// ];
import { Routes } from '@angular/router';
import { AddClientsComponent } from './add-clients/add-clients.component';
import { ConsPageComponent } from './cons-page.component';
import { ZonesComponent } from '../../client/client-page/zones/zones.component';

export const ConsPageRoutes: Routes = [
  {
    path: '',
    component: ConsPageComponent,
    children: [
      { path: '', redirectTo: 'tickets-hand', pathMatch: 'full' },
      { path: 'add-clients', component: AddClientsComponent },
      {
        path: 'tickets-hand',
        loadChildren: () =>
          import('./tickets-hand/tickets-hand.routes').then(m => m.ticketsHandRoutes)
      },
      { path: 'zones', component: ZonesComponent },

      // ✅ Right sidebar as named outlet

    ]
  }
];
