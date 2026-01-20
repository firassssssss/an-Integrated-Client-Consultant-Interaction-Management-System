


import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface Ticket {
  _id: string;
  id_ticket?: string; // new optional property
  breve_description: string;
  info_complementaires: string;
  device_name: string;
  device_id: string;
  type_probleme: string;
  user_email: string;
  status: string;
  created_at: string | Date | null;
}

@Component({
  selector: 'app-view-t',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './view-t.component.html',
  styleUrls: ['./view-t.component.css']
})
export class ViewTComponent implements OnInit {
  http = inject(HttpClient);
  tickets: Ticket[] = [];
  isConsultant: boolean = false;

  ngOnInit() {
    const user_email = localStorage.getItem('user_email');
    if (!user_email) {
      alert('No user logged in');
      return;
    }

    this.http.get<{ is_consultant: boolean }>(`http://localhost:8000/is_consultant?email=${encodeURIComponent(user_email)}`)
      .subscribe({
        next: (res) => {
          this.isConsultant = res.is_consultant;
          this.loadTickets(user_email);
        },
        error: () => {
          this.isConsultant = false;
          this.loadTickets(user_email);
        }
      });
  }

  loadTickets(user_email: string) {
    this.http.get<Ticket[]>(`http://localhost:8000/tickets?user_email=${encodeURIComponent(user_email)}`)
      .subscribe({
        next: (data) => {
          console.log('Raw tickets from backend:', data);

          // Map all tickets, convert created_at string to Date object if present
          this.tickets = data.map(ticket => ({
            ...ticket,
            created_at: ticket.created_at ? new Date(ticket.created_at) : null
          }));

          // Optional: log tickets with their IDs to confirm
          this.tickets.forEach(t => {
            if (!t._id) {
              console.warn('Ticket missing _id:', t);
            }
          });
        },
        error: (err) => {
          console.error('Failed to fetch tickets', err);
          alert('Error loading tickets');
        }
      });
  }

updateStatus(ticket: Ticket) {
  if (!this.isConsultant) {
    alert('Only consultants can update status');
    return;
  }
  if (!ticket._id && !ticket.id_ticket) {
    alert('Ticket ID missing - cannot update.');
    console.error('Ticket missing _id and id_ticket:', ticket);
    return;
  }

  // Use Mongo _id if available, otherwise id_ticket
  const updateUrl = ticket._id 
    ? `http://localhost:8000/tickets/${ticket._id}` 
    : `http://localhost:8000/tickets/by_id_ticket/${ticket.id_ticket}`;

  this.http.put(updateUrl, { status: ticket.status })
    .subscribe({
      next: () => alert(`Status updated to "${ticket.status}"`),
      error: (err) => {
        console.error('Failed to update ticket status', err);
        alert('Failed to update ticket status');
      }
    });
}

deleteAllTickets() {
  const user_email = localStorage.getItem('user_email');
  if (!user_email) {
    alert('No user email found');
    return;
  }

  if (!confirm('Are you sure you want to delete all your tickets?')) return;

  this.http.delete(`http://localhost:8000/tickets?user_email=${encodeURIComponent(user_email)}`)
    .subscribe({
      next: (res: any) => {
        alert(res.message);
        this.tickets = []; // Clear frontend
      },
      error: (err) => {
        console.error('Error deleting tickets:', err);
        alert('Failed to delete tickets');
      }
    });
}



}
