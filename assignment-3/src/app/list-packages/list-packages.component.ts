import { Component, OnInit } from '@angular/core';
import { WeightPipe } from '../weight.pipe';
import { Package } from '../models/package';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import { Driver } from '../models/driver';

@Component({
  selector: 'app-list-packages',
  standalone: true,
  imports: [WeightPipe],
  templateUrl: './list-packages.component.html',
  styleUrls: ['./list-packages.component.css'],
})
export class ListPackagesComponent implements OnInit {
  packages: Package[] = [];

  selectedPackage: Package | null = null;

  constructor(private dbService: DatabaseService, private router: Router) {}

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
  }

  onDeletePackage(packageMongoId: string) {
    console;
    this.dbService.deletePackage(packageMongoId).subscribe((result) => {
      this.onGetPackages();
      this.router.navigate(['/list-packages']);
    });
  }

  getDriverId(driver: Driver | undefined): string {
    return driver?._id || 'No driver';
  }

  toggleShowDrivers(packageId: string) {
    if (this.selectedPackage && this.selectedPackage._id === packageId) {
      this.selectedPackage = null;
    } else {
      this.selectedPackage =
        this.packages.find((p) => p._id === packageId) || null;
    }
  }

  isSelectedPackage(packageId: string): boolean {
    return this.selectedPackage?._id === packageId;
  }

  hasAssignedDriver(packages: Package): any {
    return packages.driver_id?._id;
  }
}
