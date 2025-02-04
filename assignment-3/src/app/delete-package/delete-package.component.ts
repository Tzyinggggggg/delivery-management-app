import { Component, OnInit } from '@angular/core';
import { Package } from '../models/package';
import { WeightPipe } from '../weight.pipe';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-delete-package',
  standalone: true,
  imports: [WeightPipe],
  templateUrl: './delete-package.component.html',
  styleUrl: './delete-package.component.css',
})
export class DeletePackageComponent implements OnInit {
  packages: Package[] = [];

  constructor(private dbService: DatabaseService, private router: Router) {}

  onGetPackages() {
    return this.dbService.getPackages().subscribe((data: any) => {
      this.packages = data;
    });
  }

  onDeletePackage(packageMongoId: string) {
    console;
    this.dbService.deletePackage(packageMongoId).subscribe((result) => {
      this.onGetPackages();
      this.router.navigate(['/list-packages']);
    });
  }

  ngOnInit() {
    this.onGetPackages();
  }

  getDriverId(driverId: any): string {
    if (!driverId) {
      return 'No driver';
    }
    if (typeof driverId === 'string') {
      return driverId;
    }
    if (typeof driverId === 'object' && driverId !== null) {
      return driverId._id || 'Invalid driver ID';
    }
    return 'Invalid driver ID';
  }
}
