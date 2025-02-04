import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatabaseService } from '../database.service';
import { UppercasePipe } from '../driver-name-uppercase.pipe';
import { Driver } from '../models/driver';

@Component({
  selector: 'app-list-drivers',
  standalone: true,
  imports: [CommonModule, UppercasePipe],
  templateUrl: './list-drivers.component.html',
  styleUrl: './list-drivers.component.css',
})
export class ListDriversComponent implements OnInit {
  drivers: Driver[] = [];
  //  storing the driver whose packages are currently displayed
  selectedDriver: Driver | null = null;

  constructor(private dbService: DatabaseService) {}

  onGetDrivers() {
    return this.dbService.getDrivers().subscribe((data: any) => {
      this.drivers = data;
    });
  }

  ngOnInit() {
    this.onGetDrivers();
  }

  onDeleteDriver(driverMongoId: string) {
    this.dbService.deleteDriver(driverMongoId).subscribe((result) => {
      this.onGetDrivers();
      if (this.selectedDriver && this.selectedDriver._id === driverMongoId) {
        this.selectedDriver = null;
      }
    });
  }

  // dynamically set based on whether the driver._id matches the currently selected driver's ID
  toggleShowPackages(driverId: string) {
    // If the selected driver is the same, deselect (hide packages)
    if (this.selectedDriver && this.selectedDriver._id === driverId) {
      this.selectedDriver = null;
    } else {
      // Otherwise, select the driver and show packages
      this.selectedDriver =
        this.drivers.find((d) => d._id === driverId) || null;
    }
  }

  isSelectedDriver(driverId: string): boolean {
    return this.selectedDriver?._id === driverId;
  }

  hasAssignedPackages(driver: Driver): boolean | undefined {
    return driver.assigned_packages && driver.assigned_packages.length > 0;
  }
}
