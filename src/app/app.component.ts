// import { Component } from '@angular/core';
// import { RouterModule, RouterOutlet } from '@angular/router';
// import { CommonModule } from '@angular/common';

// @Component({
//   selector: 'app-root',
//   standalone: true,
//   imports: [CommonModule, RouterModule, RouterOutlet],
//   templateUrl: './app.component.html',
//   styleUrls: ['./app.component.css']
// })
// export class AppComponent {
//   title = 'company2';
  
//   // This is used to show/hide the welcome screen
//   activeRoute: boolean = false;
  
// }



import { Component, inject } from '@angular/core';
import { Router, NavigationEnd, RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'company2';
  showVideo = false;
  currentRoute = '';
  router = inject(Router);

  constructor() {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.currentRoute = event.urlAfterRedirects;
          // Show video if URL contains /client/login anywhere
          
          this.showVideo =
            this.currentRoute.startsWith('/') ||
            this.currentRoute.startsWith('/client/login') ||
            this.currentRoute.startsWith('/consultant/cons-login');
            
        }
      });
  }
}
