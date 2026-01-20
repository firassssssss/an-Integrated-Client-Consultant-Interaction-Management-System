import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-devices',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './devices.component.html',
  styleUrls: ['./devices.component.css']
})
export class DevicesComponent implements OnInit {
  devices: any[] = [];
  filteredDevices: any[] = [];
  searchName: string = '';

  newDevice = {
    device_name: '',
    type: '',
    index: '',
    construction: '',
    model: '',
    latitude: null as number | null,
    longitude: null as number | null,
    ip: '',
    station: '',
    usine: '',
    user_email: localStorage.getItem('user_email') || ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices() {
    if (!this.newDevice.user_email) {
      alert('No logged-in email found');
      return;
    }

    this.http.get<any[]>('http://localhost:8000/devices', {
      params: { user_email: this.newDevice.user_email }
    }).subscribe({
      next: (data) => {
        this.devices = data;
        this.filteredDevices = data;
        console.log('Loaded devices for:', this.newDevice.user_email);
      },
      error: (err) => {
        console.error('Error loading devices:', err);
        alert('Failed to load devices');
      }
    });
  }

  onSearchChange() {
    const searchLower = this.searchName.toLowerCase();
    this.filteredDevices = this.devices.filter(device =>
      device.device_name.toLowerCase().includes(searchLower)
    );
  }

  addDevice() {
    const requiredFields: (keyof typeof this.newDevice)[] = [
      'device_name', 'type', 'index', 'construction', 'model'
       , 'ip', 'station', 'usine', 'user_email'
    ];

    for (const field of requiredFields) {
      const value = this.newDevice[field];
      if (value === '' || value === null || value === undefined) {
        alert(`Field "${field}" is required`);
        return;
      }
    }

    this.http.post('http://localhost:8000/devices', this.newDevice).subscribe({
      next: () => {
        alert('✅ Device added successfully!');
        this.loadDevices();
        this.resetForm();
      },
      error: (err) => {
        console.error('POST error:', err);
        alert('❌ Failed to add device: ' + JSON.stringify(err.error?.detail || err.message));
      }
    });
  }

  resetForm() {
    const email = this.newDevice.user_email;
    this.newDevice = {
      device_name: '',
      type: '',
      index: '',
      construction: '',
      model: '',
      latitude: null,
      longitude: null,
      ip: '',
      station: '',
      usine: '',
      user_email: email
    };
    this.searchName = '';
  }
}
