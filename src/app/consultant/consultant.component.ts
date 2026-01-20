import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-consultant',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterOutlet],
  templateUrl: './consultant.component.html',
  styleUrl: './consultant.component.css'
})
export class ConsultantComponent {
  
}
