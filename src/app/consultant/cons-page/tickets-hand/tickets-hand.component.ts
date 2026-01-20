import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tickets-hand',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './tickets-hand.component.html',
  styleUrls: ['./tickets-hand.component.css']
})
export class TicketsHandComponent implements OnInit {
  tickets: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTickets();
  }

  loadTickets() {
    // You may want to fetch consultant's tickets here (or all tickets consultant can see)
    this.http.get<any[]>('http://localhost:8000/tickets')
      .subscribe(data => {
        this.tickets = data;
      });
  }
}
