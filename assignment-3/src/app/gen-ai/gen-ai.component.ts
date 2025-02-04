import { Component, OnInit } from '@angular/core';
import { Package } from '../models/package';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { Driver } from '../models/driver';
import { WeightPipe } from '../weight.pipe';
import io  from 'socket.io-client';

@Component({
  selector: 'app-gen-ai',
  standalone: true,
  imports: [WeightPipe],
  templateUrl: './gen-ai.component.html',
  styleUrl: './gen-ai.component.css',
})
export class GenAiComponent implements OnInit {
  packages: Package[] = [];
  selectedPackage: Package | null = null;
  socket: any;
  geminiResponse: string = 'Click "Calculate Distance" to get a response';

  constructor(private dbService: DatabaseService, private router: Router) {
    // this.socket = io('http://35.189.53.197:8081');
    this.socket = io('http://localhost:8081');
  }

  onGetPackages() {
    return this.dbService.getPackages().subscribe((data: any) => {
      this.packages = data;
      console.log('Packages with Drivers:', this.packages);

      this.packages.forEach((pkg) => {
        console.log(`Package: ${pkg.package_title}, Driver: `, pkg.driver_id);
      });
    });
  }

  ngOnInit() {
    this.onGetPackages();

    this.socket.on('distanceCalculated', (data: any) => {
      this.geminiResponse = data.response;
    });
  }

  calculateDistance(pckg: Package) {
    console.log('Sending destination:', pckg.package_destination);
    this.socket.emit('calculateDistance', {
      destination: pckg.package_destination,
    });
  }
}
