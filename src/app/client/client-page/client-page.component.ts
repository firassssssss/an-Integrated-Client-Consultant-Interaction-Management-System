
// import { Component } from '@angular/core';
// import { Router, RouterModule, RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule, HttpClient } from '@angular/common/http';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-client-page',
//   standalone: true,
//   imports: [CommonModule, RouterModule, RouterOutlet, HttpClientModule, FormsModule],
//   templateUrl: './client-page.component.html',
//   styleUrls: ['./client-page.component.css']
// })
// export class ClientPageComponent {
//   rightSidebarOpen = false;
//   responses: any[] = [];
//   responseCount = 0; 

//   // ⛳ Replace with the actual logged-in user email
//   // userEmail: string = 'test@example.com';
//   userEmail: string = localStorage.getItem('user_email') || '';

//   constructor(private router: Router, private http: HttpClient) {}

//   isZonesRoute(): boolean {
//     return this.router.url.includes('/zones');
//   }

//   toggleRightSidebar(): void {
//     this.rightSidebarOpen = !this.rightSidebarOpen;

//     if (this.rightSidebarOpen) {
//       this.fetchResponsesForUser();
//     }
//   }

//   openSidebar(): void {
//     this.router.navigate([{ outlets: { sidebar: ['sidebar'] } }], { relativeTo: this.router.routerState.root });
//   }

// fetchResponsesForUser(): void {
//   this.http.get<any[]>(`http://localhost:8000/responses/by_user?email=${this.userEmail}`).subscribe({
//     next: (res) => {
//       console.log("Fetched responses:", res);  // <-- Add this line
//       this.responses = res;
//       this.responseCount = res.length;
//     },
//     error: (err) => {
//       console.error('Failed to fetch responses for user:', err);
//     }
//   });
// }

// }
import { Component, OnInit } from '@angular/core';  // <-- import OnInit
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-client-page',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet, HttpClientModule, FormsModule],
  templateUrl: './client-page.component.html',
  styleUrls: ['./client-page.component.css']
})
export class ClientPageComponent implements OnInit {  // <-- implement OnInit
  rightSidebarOpen = false;
  responses: any[] = [];
  responseCount = 0; 

  userEmail: string = localStorage.getItem('user_email') || '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchResponsesForUser();  // <-- fetch immediately on load
  }

  isZonesRoute(): boolean {
    return this.router.url.includes('/zones');
  }

  toggleRightSidebar(): void {
    this.rightSidebarOpen = !this.rightSidebarOpen;

    if (this.rightSidebarOpen) {
      this.fetchResponsesForUser();  // optional: refresh on toggle open
    }
  }

  openSidebar(): void {
    this.router.navigate([{ outlets: { sidebar: ['sidebar'] } }], { relativeTo: this.router.routerState.root });
  }

  fetchResponsesForUser(): void {
    this.http.get<any[]>(`http://localhost:8000/responses/by_user?email=${this.userEmail}`).subscribe({
      next: (res) => {
        console.log("Fetched responses:", res);
        this.responses = res;
        this.responseCount = res.length;
      },
      error: (err) => {
        console.error('Failed to fetch responses for user:', err);
      }
    });
  }
  deleteAllResponses(): void {
  if (!confirm("Are you sure you want to delete all responses?")) return;

  this.http.delete<{ deleted_count: number }>(
    `http://localhost:8000/responses/by_user?email=${this.userEmail}`
  ).subscribe({
    next: (res) => {
      console.log("Deleted responses:", res);
      this.responses = [];
      this.responseCount = 0;
    },
    error: (err) => {
      console.error('Failed to delete responses:', err);
    }
  });
}

}
