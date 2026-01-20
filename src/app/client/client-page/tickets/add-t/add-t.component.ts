import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-add-ticket',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-t.component.html',
  styleUrls: ['./add-t.component.css']
})
export class AddTComponent implements OnInit {
  http = inject(HttpClient);

  ticket = {
    breve_description: '',
    info_complementaires: '',
    device_name: '',
    device_id: '',
    type_probleme: 'hardware',
    user_email: ''
  };

  ngOnInit() {
    const email = localStorage.getItem('user_email');
    if (email) {
      this.ticket.user_email = email;
    } else {
      alert('User not logged in. Please log in to submit a ticket.');
    }
  }
submitForm() {
  if (!this.ticket.user_email) {
    alert('Cannot submit ticket: No user email found.');
    return;
  }

  // Ensure device_id uppercase to match backend expectations
  if (this.ticket.device_id) {
    this.ticket.device_id = this.ticket.device_id.toUpperCase();
  }

  console.log("Sending ticket data:", this.ticket);

  this.http.post('http://localhost:8000/tickets', this.ticket, { observe: 'response' }).subscribe({
    next: (response) => {
      console.log('Full HTTP response:', response);
      alert('Ticket submitted successfully!');
      // Optionally reset form here
      this.ticket = {
        breve_description: '',
        info_complementaires: '',
        device_name: '',
        device_id: '',
        type_probleme: 'hardware',
        user_email: this.ticket.user_email // preserve logged-in user email
      };
    },
    error: (err) => {
      console.error('Submission error:', err);
      alert('Failed to submit ticket.');
    }
  });
}


}
