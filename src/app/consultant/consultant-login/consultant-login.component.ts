
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { Cons_AuthService } from '../cons_services/cons_auth.service';

@Component({
  selector: 'app-consultant-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './consultant-login.component.html',
  styleUrls: ['./consultant-login.component.css']
})
export class ConsultantLoginComponent implements OnInit {
  email = '';
  password = '';
  activeRoute = false;

  constructor(
    private cons_auth: Cons_AuthService,
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
    const res = await this.cons_auth.cons_login(this.email, this.password);
    console.log('Login success', res);

    // ✅ Save email in localStorage
    localStorage.setItem('user_email', this.email);

    this.router.navigate(['/consultant/page']);
  } catch (err) {
    alert('Invalid email or password');
  }
}


}
