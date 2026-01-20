// src/app/client/client-page/tickets/tickets.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddTComponent } from './add-t/add-t.component';
import { ViewTComponent } from './view-t/view-t.component';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CommonModule, AddTComponent, ViewTComponent ,RouterModule],
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent {
  showAdd = true;
  showView = true;
}
