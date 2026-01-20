
// import { Component, Input, OnInit } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { HttpClientModule, HttpClient } from '@angular/common/http';

// @Component({
//   selector: 'app-circular-progress',
//   standalone: true,
//   imports: [CommonModule, HttpClientModule],
//   templateUrl: './circular-progress.component.html',
//   styleUrls: ['./circular-progress.component.css']
// })
// export class CircularProgressComponent implements OnInit {
//   // Existing inputs and properties
//   @Input() userEmail?: string;

//   reserved: number = 0;
//   installed: number = 0;
//   connected: number = 0;

//   percentage1: number = 0; // reserved / installed %
//   percentage2: number = 0; // connected / installed %

//   constructor(private http: HttpClient) {}

// ngOnInit(): void {
//   const email = this.userEmail ?? localStorage.getItem('user_email');

//   if (email) {
//     this.http.get<any>(`http://localhost:8000/device_stats?email=${email}`)
//       .subscribe({
//         next: (data) => {
//           this.reserved = data.device_reserved;
//           this.installed = data.device_installed;
//           this.connected = data.device_connected;

//           this.percentage1 = data.percentage_reserved;
//           this.percentage2 = data.percentage_connected;
//         },
//         error: (err) => {
//           console.error('Failed to fetch device stats:', err);
//         }
//       });
//   }
// }


//   get clampPercent1(): number {
//     return Math.min(Math.max(this.percentage1, 0), 100);
//   }

//   get clampPercent2(): number {
//     return Math.min(Math.max(this.percentage2, 0), 100);
//   }
// }
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-circular-progress',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './circular-progress.component.html',
  styleUrls: ['./circular-progress.component.css']
})
export class CircularProgressComponent implements OnInit {
  @Input() userEmail?: string;

  reserved: number = 0;
  installed: number = 0;
  connected: number = 0;

  percentage1: number = 0; // reserved/install
  percentage2: number = 0; // connected/install

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const email = this.userEmail ?? localStorage.getItem('user_email');
    console.log('[CircularProgress] Using email:', email);

    if (email) {
      this.http.get<any>(`http://localhost:8000/device_stats?email=${email}`)
        .subscribe({
          next: (data) => {
            this.reserved = data.device_reserved;
            this.installed = data.device_installed;
            this.connected = data.device_connected;
            this.percentage1 = data.percentage_reserved;
            this.percentage2 = data.percentage_connected;
          },
          error: (err) => {
            console.error('Failed to fetch device stats:', err);
          }
        });
    } else {
      console.warn('No user email found');
    }
  }

  get clampPercent1(): number {
    return Math.min(Math.max(this.percentage1, 0), 100);
  }

  get clampPercent2(): number {
    return Math.min(Math.max(this.percentage2, 0), 100);
  }
}