// import { Component } from '@angular/core';
// import { RouterModule, RouterOutlet, Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// @Component({
//   selector: 'app-client-login',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule, RouterOutlet],
//   templateUrl: './client-login.component.html',
//   styleUrls: ['./client-login.component.css']
// })
// export class ClientLoginComponent {
//   email = '';
//   password = '';
//   activeRoute: boolean = false;

//   constructor(private router: Router) {}

//   onSubmit() {
//   // Dummy check: replace with real backend call later
//     if (this.email === 'test@example.com' && this.password === 'password123') {
//       this.router.navigate(['/client/page']);  
//     } else {
//       alert('Invalid login credentials');
//     }
//   }

// }
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-client-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './client-login.component.html',
  styleUrls: ['./client-login.component.css']
})
export class ClientLoginComponent implements OnInit {
  email = '';
  password = '';
  activeRoute = false;

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.url.subscribe(url => {
      this.activeRoute = url.length > 0;
    });
  }

async onSubmit() {
  try {
    const res = await this.auth.login(this.email, this.password);
    console.log('Login success', res);

    // ✅ Save email in localStorage
    localStorage.setItem('user_email', this.email);

    this.router.navigate(['/client/page']);
  } catch (err) {
    alert('Invalid email or password');
  }
}


}
