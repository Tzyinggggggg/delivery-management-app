// add-package.component.ts

import { Component, OnInit } from '@angular/core';
import { Package } from '../models/package';
import { Driver } from '../models/driver';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-package',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './add-package.component.html',
  styleUrls: ['./add-package.component.css'],
})
export class AddPackageComponent implements OnInit {
  selectedDriverId: string = '';
  package: Package = new Package();
  drivers: Driver[] = [];

  constructor(private db: DatabaseService, private router: Router) {}

  ngOnInit() {
    this.loadDrivers();
  }

  loadDrivers() {
    this.db.getDrivers().subscribe({
      next: (data: any) => {
        this.drivers = data;
      },
      error: (err) => {
        console.error('Error loading drivers:', err);
      },
    });
  }

  addPackage() {
    if (this.isFormValid()) {
      // Temporarily store the Driver object
      const selectedDriver = this.drivers.find(
        (driver) => driver._id === this.selectedDriverId
      );

      if (selectedDriver) {
        // Assign the selected driver object to package's driver_id field
        this.package.driver_id = selectedDriver;

        this.db
          .createPackage({
            ...this.package,
            // Only send driver_id as a string to the backend
            driver_id: this.selectedDriverId,
          })
          .subscribe({
            next: (data: any) => {
              this.router.navigate(['/list-packages']);
            },
            error: (err) => {
              console.error('Error Adding Package:', err);
              this.router.navigate(['/invalid-data']);
            },
          });
      } else {
        console.warn('No driver selected, redirecting to invalid-data page');
        this.router.navigate(['/invalid-data']);
      }
    } else {
      console.warn('Form is invalid, redirecting to invalid-data page');
      this.router.navigate(['/invalid-data']);
    }
  }

  isFormValid(): boolean {
    console.log('Package form data:', this.package);
    if (
      this.package.package_title.length >= 3 &&
      this.package.package_title.length <= 15 &&
      this.package.package_weight > 0 &&
      this.package.package_destination.length >= 5 &&
      this.package.package_destination.length <= 15 &&
      (!this.package.description || this.package.description.length <= 30) &&
      this.selectedDriverId
    ) {
      console.log('Form validation passed');
      return true;
    }
    console.warn('Form validation failed');
    return false;
  }
}
