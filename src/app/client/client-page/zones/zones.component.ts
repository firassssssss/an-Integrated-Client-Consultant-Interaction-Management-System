// // import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// // import { CommonModule } from '@angular/common';
// // import maplibregl, { Map } from 'maplibre-gl';
// // import { FormsModule } from '@angular/forms';
// // import { RouterModule } from "@angular/router";
// // import { CircularProgressComponent } from '../../../consultant/cons-page/circular-progress/circular-progress.component';
// // interface Dot {
// //   id: number;
// //   color: string;
// //   lng: number;
// //   lat: number;
// //   x: number;
// //   y: number;
// //   dragging: boolean;
// // }

// // interface SearchResult {
// //   name: string;
// //   lat: number;
// //   lon: number;
// // }

// // @Component({
// //   selector: 'app-zones',
// //   standalone: true,
// //   imports: [CommonModule, FormsModule, RouterModule,CircularProgressComponent],
// //   templateUrl: './zones.component.html',
// //   styleUrls: ['./zones.component.css']
// // })
// // export class ZonesComponent implements AfterViewInit {
// //   @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef; 
// //   showProgressPanel = false;

// //   map!: Map;
// //   freeze = false;
// //   placingMode = false;
// //   selectedColor = 'red';

// //   colors = ['red', 'green', 'blue', 'yellow', 'purple'];

// //   dots: Dot[] = [];
// //   private dragDot: Dot | null = null;
// //   private dragOffsetX = 0;
// //   private dragOffsetY = 0;

// //   private nextDotId = 1;

// //   // For search
// //   searchQuery = '';
// //   searchResults: SearchResult[] = [];
// //   searchFocused = false;

// //   ngAfterViewInit(): void {
// //     this.map = new maplibregl.Map({
// //       container: this.mapContainer.nativeElement,
// //       style: 'https://api.maptiler.com/maps/streets/style.json?key=Qs5t9qjnX9pZebuSTMda',
// //       center: [10.13707, 36.80791],
// //       zoom: 12,
// //       attributionControl: false
// //     });

// //     this.map.on('move', () => {
// //       if (this.freeze) this.map.stop();
// //       this.updateDotsPositions();
// //     });

// //     this.map.on('zoom', () => {
// //       this.updateDotsPositions();
// //     });

// //     this.map.on('click', (event) => {
// //       if (!this.placingMode) return;

// //       const lngLat = event.lngLat;

// //       this.dots.push({
// //         id: this.nextDotId++,
// //         color: this.selectedColor,
// //         lng: lngLat.lng,
// //         lat: lngLat.lat,
// //         x: 0,
// //         y: 0,
// //         dragging: false
// //       });

// //       this.updateDotsPositions();
// //     });
// //   }

// //   toggleFreeze() {
// //     this.freeze = !this.freeze;
// //     if (this.freeze) {
// //       this.map.dragPan.disable();
// //       this.map.scrollZoom.disable();
// //       this.map.doubleClickZoom.disable();
// //       this.map.boxZoom.disable();
// //       this.map.keyboard.disable();
// //     } else {
// //       this.map.dragPan.enable();
// //       this.map.scrollZoom.enable();
// //       this.map.doubleClickZoom.enable();
// //       this.map.boxZoom.enable();
// //       this.map.keyboard.enable();
// //     }
// //   }

// //   togglePlacing() {
// //     this.placingMode = !this.placingMode;
// //   }

// //   selectColor(color: string) {
// //     this.selectedColor = color;
// //   }

// //   updateDotsPositions() {
// //     if (!this.map) return;
// //     const rect = this.mapContainer.nativeElement.getBoundingClientRect();

// //     this.dots.forEach(dot => {
// //       const point = this.map.project([dot.lng, dot.lat]);
// //       dot.x = point.x;
// //       dot.y = point.y;
// //     });
// //   }

// //   startDrag(event: MouseEvent | TouchEvent, dot: Dot) {
// //     event.preventDefault();
// //     if (this.freeze) return;

// //     this.dragDot = dot;
// //     dot.dragging = true;

// //     const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
// //     const clientY = 'touches' in event ? event.touches[0].clientY : (event as MouseEvent).clientY;

// //     const rect = this.mapContainer.nativeElement.getBoundingClientRect();
// //     this.dragOffsetX = clientX - rect.left - dot.x;
// //     this.dragOffsetY = clientY - rect.top - dot.y;

// //     window.addEventListener('mousemove', this.onDragMove);
// //     window.addEventListener('touchmove', this.onDragMove, { passive: false });
// //     window.addEventListener('mouseup', this.endDrag);
// //     window.addEventListener('touchend', this.endDrag);
// //   }

// //   onDragMove = (event: MouseEvent | TouchEvent) => {
// //     event.preventDefault();
// //     if (!this.dragDot) return;

// //     const clientX = 'touches' in event ? event.touches[0].clientX : (event as MouseEvent).clientX;
// //     const clientY = 'touches' in event ? event.touches[0].clientY : (event as MouseEvent).clientY;

// //     const rect = this.mapContainer.nativeElement.getBoundingClientRect();
// //     let newX = clientX - rect.left - this.dragOffsetX;
// //     let newY = clientY - rect.top - this.dragOffsetY;

// //     newX = Math.max(0, Math.min(newX, rect.width));
// //     newY = Math.max(0, Math.min(newY, rect.height));

// //     this.dragDot.x = newX;
// //     this.dragDot.y = newY;

// //     const lngLat = this.map.unproject([newX, newY]);
// //     this.dragDot.lng = lngLat.lng;
// //     this.dragDot.lat = lngLat.lat;
// //   };

// //   endDrag = () => {
// //     if (this.dragDot) {
// //       this.dragDot.dragging = false;
// //       this.dragDot = null;

// //       window.removeEventListener('mousemove', this.onDragMove);
// //       window.removeEventListener('touchmove', this.onDragMove);
// //       window.removeEventListener('mouseup', this.endDrag);
// //       window.removeEventListener('touchend', this.endDrag);
// //     }
// //   };

// //   get scale() {
// //     if (!this.map) return 1;
// //     const zoom = this.map.getZoom();
// //     let scale = Math.pow(2, 12 - zoom);
// //     scale = Math.min(Math.max(scale, 0.9), 1.2);
// //     return scale;
// //   }

// //   // --- SEARCH LOGIC ---

// //   async onSearchInput() {
// //     if (this.searchQuery.length < 3) {
// //       this.searchResults = [];
// //       return;
// //     }
// //     const apiKey = 'Qs5t9qjnX9pZebuSTMda'; // MapTiler API key

// //     const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(this.searchQuery)}.json?key=${apiKey}&limit=5&language=en`;

// //     try {
// //       const response = await fetch(url);
// //       if (!response.ok) throw new Error('Search failed');

// //       const data = await response.json();

// //       this.searchResults = data.features.map((f: any) => ({
// //         name: f.place_name,
// //         lat: f.geometry.coordinates[1],
// //         lon: f.geometry.coordinates[0]
// //       }));
// //     } catch (error) {
// //       console.error('Search error:', error);
// //       this.searchResults = [];
// //     }
// //   }

// //   selectSearchResult(result: SearchResult) {
// //     this.map.flyTo({
// //       center: [result.lon, result.lat],
// //       zoom: 14
// //     });
// //     this.searchResults = [];
// //     this.searchQuery = result.name;
// //   }
// //   isChartVisible = false;
// //   percentValue = 66; // default, dynamic if needed

// //   showChart() {
// //     this.isChartVisible = true;
// //   }

// //   hideChart() {
// //     this.isChartVisible = false;
// //   }
// // }
// import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import maplibregl, { Map } from 'maplibre-gl';
// import { FormsModule } from '@angular/forms';
// import { RouterModule } from '@angular/router';
// import { CircularProgressComponent } from '../../../consultant/cons-page/circular-progress/circular-progress.component';

// interface Dot {
//   id: number;
//   color: string;
//   lng: number;
//   lat: number;
//   x: number;
//   y: number;
//   dragging: boolean;
// }

// interface SearchResult {
//   name: string;
//   lat: number;
//   lon: number;
// }

// @Component({
//   selector: 'app-zones',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule, CircularProgressComponent],
//   templateUrl: './zones.component.html',
//   styleUrls: ['./zones.component.css']
// })
// export class ZonesComponent implements AfterViewInit {
  
//   @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

//   map!: Map;
//   freeze = false;
//   placingMode = false;
//   selectedColor = 'red';
//   showProgressPanel = true ;
//   email = localStorage.getItem('user_email') ?? 'test@example.com';

//   colors = ['red', 'green', 'blue', 'yellow', 'purple'];

//   dots: Dot[] = [];
//   private dragDot: Dot | null = null;
//   private dragOffsetX = 0;
//   private dragOffsetY = 0;

//   private nextDotId = 1;

//   searchQuery = '';
//   searchResults: SearchResult[] = [];
//   searchFocused = false;

//   isChartVisible = false;
//   percentValue = 0;
//   reserved = 0;
//   installed = 0;

//   ngAfterViewInit(): void {
//     this.map = new maplibregl.Map({
//       container: this.mapContainer.nativeElement,
//       style: 'https://api.maptiler.com/maps/streets/style.json?key=Qs5t9qjnX9pZebuSTMda',
//       center: [10.13707, 36.80791],
//       zoom: 12,
//       attributionControl: false
//     });

//     this.map.on('move', () => {
//       if (this.freeze) this.map.stop();
//       this.updateDotsPositions();
//     });

//     this.map.on('zoom', () => this.updateDotsPositions());

//     this.map.on('click', (event) => {
//       if (!this.placingMode) return;

//       const lngLat = event.lngLat;

//       this.dots.push({
//         id: this.nextDotId++,
//         color: this.selectedColor,
//         lng: lngLat.lng,
//         lat: lngLat.lat,
//         x: 0,
//         y: 0,
//         dragging: false
//       });

//       this.updateDotsPositions();
//       this.updateStats();
//     });
//   }

//   toggleFreeze() {
//     this.freeze = !this.freeze;
//     const map = this.map;
//     if (this.freeze) {
//       map.dragPan.disable();
//       map.scrollZoom.disable();
//       map.doubleClickZoom.disable();
//       map.boxZoom.disable();
//       map.keyboard.disable();
//     } else {
//       map.dragPan.enable();
//       map.scrollZoom.enable();
//       map.doubleClickZoom.enable();
//       map.boxZoom.enable();
//       map.keyboard.enable();
//     }
//   }

//   togglePlacing() {
//     this.placingMode = !this.placingMode;
//   }

//   selectColor(color: string) {
//     this.selectedColor = color;
//   }

//   updateDotsPositions() {
//     if (!this.map) return;
//     const rect = this.mapContainer.nativeElement.getBoundingClientRect();

//     this.dots.forEach(dot => {
//       const point = this.map.project([dot.lng, dot.lat]);
//       dot.x = point.x;
//       dot.y = point.y;
//     });
//   }

//   startDrag(event: MouseEvent | TouchEvent, dot: Dot) {
//     event.preventDefault();
//     if (this.freeze) return;

//     this.dragDot = dot;
//     dot.dragging = true;

//     const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
//     const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

//     const rect = this.mapContainer.nativeElement.getBoundingClientRect();
//     this.dragOffsetX = clientX - rect.left - dot.x;
//     this.dragOffsetY = clientY - rect.top - dot.y;

//     window.addEventListener('mousemove', this.onDragMove);
//     window.addEventListener('touchmove', this.onDragMove, { passive: false });
//     window.addEventListener('mouseup', this.endDrag);
//     window.addEventListener('touchend', this.endDrag);
//   }

//   onDragMove = (event: MouseEvent | TouchEvent) => {
//     event.preventDefault();
//     if (!this.dragDot) return;

//     const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
//     const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

//     const rect = this.mapContainer.nativeElement.getBoundingClientRect();
//     let newX = clientX - rect.left - this.dragOffsetX;
//     let newY = clientY - rect.top - this.dragOffsetY;

//     newX = Math.max(0, Math.min(newX, rect.width));
//     newY = Math.max(0, Math.min(newY, rect.height));

//     this.dragDot.x = newX;
//     this.dragDot.y = newY;

//     const lngLat = this.map.unproject([newX, newY]);
//     this.dragDot.lng = lngLat.lng;
//     this.dragDot.lat = lngLat.lat;
//   };

//   endDrag = () => {
//     if (this.dragDot) {
//       this.dragDot.dragging = false;
//       this.dragDot = null;
//       window.removeEventListener('mousemove', this.onDragMove);
//       window.removeEventListener('touchmove', this.onDragMove);
//       window.removeEventListener('mouseup', this.endDrag);
//       window.removeEventListener('touchend', this.endDrag);
//       this.updateStats();
//     }
//   };

//   get scale() {
//     if (!this.map) return 1;
//     const zoom = this.map.getZoom();
//     let scale = Math.pow(2, 12 - zoom);
//     return Math.min(Math.max(scale, 0.9), 1.2);
//   }

//   async onSearchInput() {
//     if (this.searchQuery.length < 3) {
//       this.searchResults = [];
//       return;
//     }
//     const apiKey = 'Qs5t9qjnX9pZebuSTMda';
//     const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(this.searchQuery)}.json?key=${apiKey}&limit=5&language=en`;

//     try {
//       const response = await fetch(url);
//       if (!response.ok) throw new Error('Search failed');

//       const data = await response.json();

//       this.searchResults = data.features.map((f: any) => ({
//         name: f.place_name,
//         lat: f.geometry.coordinates[1],
//         lon: f.geometry.coordinates[0]
//       }));
//     } catch (error) {
//       console.error('Search error:', error);
//       this.searchResults = [];
//     }
//   }

//   selectSearchResult(result: SearchResult) {
//     this.map.flyTo({ center: [result.lon, result.lat], zoom: 14 });
//     this.searchResults = [];
//     this.searchQuery = result.name;
//   }

//   showChart() {
//     this.isChartVisible = true;
//     this.updateStats();
//   }

//   hideChart() {
//     this.showProgressPanel = false;
//   }

//   updateStats() {
//     this.reserved = this.dots.filter(dot => dot.color === 'yellow').length;
//     this.installed = this.dots.filter(dot => dot.color === 'green').length;
//     const total = this.dots.length;
//     this.percentValue = total > 0 ? Math.round((this.installed / total) * 100) : 0;
//   }


  
// }


import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import maplibregl, { Map } from 'maplibre-gl';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CircularProgressComponent } from '../../../consultant/cons-page/circular-progress/circular-progress.component';

interface Dot {
  id: number;
  color: string;
  lng: number;
  lat: number;
  x: number;
  y: number;
  dragging: boolean;
}

interface SearchResult {
  name: string;
  lat: number;
  lon: number;
}

@Component({
  selector: 'app-zones',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule, CircularProgressComponent],
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.css']
})
export class ZonesComponent implements AfterViewInit {
  @ViewChild('mapContainer', { static: true }) mapContainer!: ElementRef;

  map!: Map;
  freeze = false;
  placingMode = false;
  selectedColor = 'red';
  showProgressPanel = true;
  email = localStorage.getItem('user_email') ?? 'test@example.com';

  colors = ['red', 'green', 'blue', 'yellow', 'purple'];

  dots: Dot[] = [];
  private dragDot: Dot | null = null;
  private dragOffsetX = 0;
  private dragOffsetY = 0;

  private nextDotId = 1;

  searchQuery = '';
  searchResults: SearchResult[] = [];
  searchFocused = false;

  isChartVisible = false;
  percentValue = 0;
  reserved = 0;
  installed = 0;

  constructor(private http: HttpClient) {}

  ngAfterViewInit(): void {
    this.map = new maplibregl.Map({
      container: this.mapContainer.nativeElement,
      style: 'https://api.maptiler.com/maps/streets/style.json?key=Qs5t9qjnX9pZebuSTMda',
      center: [10.13707, 36.80791],
      zoom: 12,
      attributionControl: false
    });

    this.map.on('move', () => {
      if (this.freeze) this.map.stop();
      this.updateDotsPositions();
    });

    this.map.on('zoom', () => this.updateDotsPositions());

    this.map.on('click', (event) => {
      if (!this.placingMode) return;

      const lngLat = event.lngLat;

      this.dots.push({
        id: this.nextDotId++,
        color: this.selectedColor,
        lng: lngLat.lng,
        lat: lngLat.lat,
        x: 0,
        y: 0,
        dragging: false
      });

      this.updateDotsPositions();
      this.updateStats();
    });

    this.loadDots(); // <--- Load dots from DB on map init
  }

  toggleFreeze() {
    this.freeze = !this.freeze;
    const map = this.map;
    if (this.freeze) {
      map.dragPan.disable();
      map.scrollZoom.disable();
      map.doubleClickZoom.disable();
      map.boxZoom.disable();
      map.keyboard.disable();
    } else {
      map.dragPan.enable();
      map.scrollZoom.enable();
      map.doubleClickZoom.enable();
      map.boxZoom.enable();
      map.keyboard.enable();
    }
  }

  togglePlacing() {
    this.placingMode = !this.placingMode;
  }

  selectColor(color: string) {
    this.selectedColor = color;
  }

  updateDotsPositions() {
    if (!this.map) return;
    const rect = this.mapContainer.nativeElement.getBoundingClientRect();

    this.dots.forEach(dot => {
      const point = this.map.project([dot.lng, dot.lat]);
      dot.x = point.x;
      dot.y = point.y;
    });
  }

  startDrag(event: MouseEvent | TouchEvent, dot: Dot) {
    event.preventDefault();
    if (this.freeze) return;

    this.dragDot = dot;
    dot.dragging = true;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const rect = this.mapContainer.nativeElement.getBoundingClientRect();
    this.dragOffsetX = clientX - rect.left - dot.x;
    this.dragOffsetY = clientY - rect.top - dot.y;

    window.addEventListener('mousemove', this.onDragMove);
    window.addEventListener('touchmove', this.onDragMove, { passive: false });
    window.addEventListener('mouseup', this.endDrag);
    window.addEventListener('touchend', this.endDrag);
  }

  onDragMove = (event: MouseEvent | TouchEvent) => {
    event.preventDefault();
    if (!this.dragDot) return;

    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

    const rect = this.mapContainer.nativeElement.getBoundingClientRect();
    let newX = clientX - rect.left - this.dragOffsetX;
    let newY = clientY - rect.top - this.dragOffsetY;

    newX = Math.max(0, Math.min(newX, rect.width));
    newY = Math.max(0, Math.min(newY, rect.height));

    this.dragDot.x = newX;
    this.dragDot.y = newY;

    const lngLat = this.map.unproject([newX, newY]);
    this.dragDot.lng = lngLat.lng;
    this.dragDot.lat = lngLat.lat;
  };

  endDrag = () => {
    if (this.dragDot) {
      this.dragDot.dragging = false;
      this.dragDot = null;
      window.removeEventListener('mousemove', this.onDragMove);
      window.removeEventListener('touchmove', this.onDragMove);
      window.removeEventListener('mouseup', this.endDrag);
      window.removeEventListener('touchend', this.endDrag);
      this.updateStats();
    }
  };

  get scale() {
    if (!this.map) return 1;
    const zoom = this.map.getZoom();
    let scale = Math.pow(2, 12 - zoom);
    return Math.min(Math.max(scale, 0.9), 1.2);
  }

  async onSearchInput() {
    if (this.searchQuery.length < 3) {
      this.searchResults = [];
      return;
    }
    const apiKey = 'Qs5t9qjnX9pZebuSTMda';
    const url = `https://api.maptiler.com/geocoding/${encodeURIComponent(this.searchQuery)}.json?key=${apiKey}&limit=5&language=en`;

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Search failed');

      const data = await response.json();

      this.searchResults = data.features.map((f: any) => ({
        name: f.place_name,
        lat: f.geometry.coordinates[1],
        lon: f.geometry.coordinates[0]
      }));
    } catch (error) {
      console.error('Search error:', error);
      this.searchResults = [];
    }
  }

  selectSearchResult(result: SearchResult) {
    this.map.flyTo({ center: [result.lon, result.lat], zoom: 14 });
    this.searchResults = [];
    this.searchQuery = result.name;
  }

  showChart() {
    this.isChartVisible = true;
    this.updateStats();
  }

  hideChart() {
    this.showProgressPanel = false;
  }

  updateStats() {
    this.reserved = this.dots.filter(dot => dot.color === 'yellow').length;
    this.installed = this.dots.filter(dot => dot.color === 'green').length;
    const total = this.dots.length;
    this.percentValue = total > 0 ? Math.round((this.installed / total) * 100) : 0;
  }

  saveDots() {
    const simplifiedDots = this.dots.map(dot => ({
      id: dot.id,
      lat: dot.lat,
      lng: dot.lng,
      color: dot.color
    }));

this.http.post('http://localhost:8000/map/save', {
  email: this.email,
  dots: this.dots  // Replace with your actual dot array
}).subscribe({
  next: () => console.log("Saved successfully"),
  error: err => console.error("Error saving markers:", err)
});

  }

  // loadDots() {
  //   this.http.get<{ dots: Dot[] }>('http://localhost:8000/map/load?email=' + this.email)
  //     .subscribe({
  //       next: res => {
  //         this.dots = res.dots.map(dot => ({
  //           ...dot,
  //           x: 0,
  //           y: 0,
  //           dragging: false
  //         }));
  //         this.updateDotsPositions();
  //       },
  //       error: err => console.error('Error loading markers:', err)
  //     });
  // }
  loadDots() {
  this.http.get<{ dots: Dot[] }>(`http://localhost:8000/map/load?email=${this.email}`)
    .subscribe(res => {
      this.dots = res.dots;
      // Update the map markers based on dots here
    });
}

}
