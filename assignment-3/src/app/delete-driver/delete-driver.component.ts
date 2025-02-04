import { Component, OnInit } from '@angular/core';
import { Driver } from '../models/driver';
import { UppercasePipe } from '../driver-name-uppercase.pipe';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-driver',
  standalone: true,
  imports: [UppercasePipe],
  templateUrl: './delete-driver.component.html',
  styleUrl: './delete-driver.component.css',
})
export class DeleteDriverComponent implements OnInit {
  drivers: Driver[] = [];

  constructor(private dbService: DatabaseService, private router: Router) {}

  onGetDrivers() {
    return this.dbService.getDrivers().subscribe((data: any) => {
      this.drivers = data;
    });
  }

  ngOnInit() {
    this.onGetDrivers();
  }

  onDeleteDriver(driverMongoId: string) {
    console;
    this.dbService.deleteDriver(driverMongoId).subscribe((result) => {
      this.onGetDrivers();
      this.router.navigate(['/list-drivers']);
    });
  }

  getDriverId(driverId: any): string {
    if (!driverId) {
      return 'No driver';
    }
    if (typeof driverId === 'object' && driverId !== null) {
      return driverId._id || 'Invalid driver ID';
    }
    return 'Invalid driver ID';
  }
}
