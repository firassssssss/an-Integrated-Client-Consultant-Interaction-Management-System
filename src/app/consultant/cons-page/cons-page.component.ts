
// import { Component, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { RouterModule, RouterOutlet } from '@angular/router';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';
// @Component({
//   selector: 'app-client-page',
//   standalone: true,
//   imports: [CommonModule, RouterModule, RouterOutlet, HttpClientModule, FormsModule],

//   templateUrl: './cons-page.component.html',
//   styleUrls: ['./cons-page.component.css']
// })
// export class ConsPageComponent implements OnInit {
//   rightSidebarOpen = false;
//   unresolvedCount = 0;

//   // Form input values
//   ticketId = '';
//   answer = '';
//   link = '';

//   // Saved responses
//   responses: { ticketId: string; answer: string; link?: string }[] = [];

//   constructor(private http: HttpClient) {}

//   ngOnInit(): void {
//     this.fetchUnresolvedCount();

//     setInterval(() => {
//       this.fetchUnresolvedCount();
//     }, 10000);
//   }

//   fetchUnresolvedCount(): void {
//     this.http.get<{ unresolved_count: number }>(
//       'http://localhost:8000/tickets/unresolved_count'
//     ).subscribe({
//       next: (res) => {
//         this.unresolvedCount = res.unresolved_count;
//       },
//       error: (err) => {
//         console.error('Failed to fetch unresolved ticket count:', err);
//       }
//     });
//   }

//   toggleRightSidebar(): void {
//     this.rightSidebarOpen = !this.rightSidebarOpen;
//   }

//   submitResponse(): void {
//     if (!this.ticketId || !this.answer) {
//       alert('Ticket ID and Answer are required.');
//       return;
//     }

//     this.responses.push({
//       ticketId: this.ticketId,
//       answer: this.answer,
//       link: this.link
//     });

//     // Clear form
//     this.ticketId = '';
//     this.answer = '';
//     this.link = '';
//   }
// }

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-page',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, HttpClientModule, FormsModule],
  templateUrl: './cons-page.component.html',
  styleUrls: ['./cons-page.component.css']
})
export class ConsPageComponent implements OnInit {
  rightSidebarOpen = false;
  unresolvedCount = 0;

  // Form input values
  ticketId = '';
  answer = '';
  link = '';

  // Responses from backend
  responses: any[] = [];

  constructor(private http: HttpClient) {}

ngOnInit(): void {
  this.fetchUnresolvedCount();
  this.loadResponses(); // 🔥 Load all responses

  setInterval(() => {
    this.fetchUnresolvedCount();
  }, 10000);
}


  fetchUnresolvedCount(): void {
    this.http.get<{ unresolved_count: number }>(
      'http://localhost:8000/tickets/unresolved_count'
    ).subscribe({
      next: (res) => {
        this.unresolvedCount = res.unresolved_count;
      },
      error: (err) => {
        console.error('Failed to fetch unresolved ticket count:', err);
      }
    });
  }

  toggleRightSidebar(): void {
    this.rightSidebarOpen = !this.rightSidebarOpen;
  }

  submitResponse(): void {
    if (!this.ticketId || !this.answer) {
      alert('Ticket ID and Answer are required.');
      return;
    }

    const payload = {
      device_id: this.ticketId.toUpperCase(),
      message: this.answer,
      youtube_link: this.link,
      consultant_email: 'consultant@example.com'
    };

    this.http.post('http://localhost:8000/responses', payload).subscribe({
      next: () => {
        this.loadResponses(this.ticketId);
        this.ticketId = '';
        this.answer = '';
        this.link = '';
      },
      error: (err) => {
        console.error('Error submitting response:', err);
      }
    });
  }

loadResponses(deviceId?: string): void {
  const url = deviceId
    ? `http://localhost:8000/responses/${deviceId.toUpperCase()}`
    : `http://localhost:8000/responses`; // all responses

  this.http.get<any[]>(url).subscribe({
    next: (res) => {
      this.responses = res;
    },
    error: (err) => {
      console.error('Error loading responses:', err);
    }
  });
}

}
