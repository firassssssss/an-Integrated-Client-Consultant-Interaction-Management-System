import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'add-client-page',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './add-clients.component.html',
  styleUrls: ['./add-clients.component.css']
})
export class AddClientsComponent implements OnInit {
  clients: any[] = [];
  filteredClients: any[] = [];
  searchTerm: string = '';

  newClient = {
    email: '',
    super_user_id: '',
    status: true,
    job: '',
    firstname: '',
    lastname: '',
    username: '',
    password: '',
    phone: '',
    device_reserved: 0,
    device_installed: 0,
    device_connected: 0,
    created_at: '',
    updated_at: ''
  };

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.http.get<any[]>('http://localhost:8000/users').subscribe({
      next: (data) => {
        this.clients = data;
        this.filteredClients = [...data];
      },
      error: (err) => console.error('Erreur chargement clients:', err)
    });
  }

prepareClientPayload(client: any) {
  return {
    email: client.email?.trim() || '',
    super_user_id: client.super_user_id || '',
    status: !!client.status,
    job: client.job?.trim() || '',
    firstname: client.firstname?.trim() || '',
    lastname: client.lastname?.trim() || '',
    username: client.username?.trim() || '',
    password: client.password?.trim() || '',
    phone: client.phone?.toString().trim() || '',  // phone as string
    device_reserved: Number(client.device_reserved) || 0,
    device_installed: Number(client.device_installed) || 0,
    device_connected: Number(client.device_connected) || 0,
    created_at: '',  // backend sets
    updated_at: '',  // backend sets
  };
}


  addClient(): void {
    const payload = this.prepareClientPayload(this.newClient);

    this.http.post('http://localhost:8000/users', payload).subscribe({
      next: () => {
        alert('Client added successfully');
        this.newClient = {
          email: '',
          super_user_id: '',
          status: true,
          job: '',
          firstname: '',
          lastname: '',
          username: '',
          password: '',
          phone: '',
          device_reserved: 0,
          device_installed: 0,
          device_connected: 0,
          created_at: '',
          updated_at: ''
        };
        this.loadClients();
      },
      error: (err) => {
        console.error('Erreur ajout client:', err);
        alert('Error adding client. See console for details.');
      }
    });
  }

  filterClients(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredClients = [...this.clients];
      return;
    }
    this.filteredClients = this.clients.filter(c =>
      (c.firstname?.toLowerCase().includes(term) || c.lastname?.toLowerCase().includes(term))
    );
  }
  selectedClient: any = null;

selectClient(client: any): void {
  this.selectedClient = client;
}

removeClient(): void {
  if (!this.selectedClient) return;

  const clientId = this.selectedClient._id; // backend sends string _id
  this.http.delete(`http://localhost:8000/users/${clientId}`).subscribe({
    next: () => {
      alert('Client removed successfully');
      this.selectedClient = null;
      this.loadClients();
    },
    error: (err) => {
      console.error('Erreur suppression client:', err);
      alert('Error removing client. See console for details.');
    }
  });
}
editingClient: any = null;  // track which client is being edited

enableEdit(client: any): void {
  this.editingClient = { ...client }; // make a copy so changes don’t auto-apply
}

cancelEdit(): void {
  this.editingClient = null;
}

saveEdit(): void {
  if (!this.editingClient) return;

  const clientId = this.editingClient._id;

  // prepare payload like in addClient
  const payload = this.prepareClientPayload(this.editingClient);

  this.http.put(`http://localhost:8000/users/${clientId}`, payload).subscribe({
    next: () => {
      alert('Client updated successfully');
      this.editingClient = null;
      this.loadClients();
    },
    error: (err) => {
      console.error('Erreur mise à jour client:', err);
      alert('Error updating client. See console for details.');
    }
  });
}

}
