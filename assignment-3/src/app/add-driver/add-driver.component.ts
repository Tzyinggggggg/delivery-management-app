import { Component } from '@angular/core';
import { Driver } from '../models/driver';
import { FormsModule } from '@angular/forms';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-driver.component.html',
  styleUrl: './add-driver.component.css',
})
export class AddDriverComponent {
  driver: Driver = new Driver();

  constructor(private db: DatabaseService, private router: Router) {}
  addDriver() {
    if (this.isFormValid()) {
      this.db.createDriver(this.driver).subscribe({
        next: (data: any) => {
          this.router.navigate(['/list-drivers']);
        },
        error: (err) => {
          console.error('Error Adding Driver:', err);
          this.router.navigate(['/invalid-data']);
        },
      });
    } else {
      console.warn('Form is invalid, redirecting to invalid-data page');
      this.router.navigate(['/invalid-data']);
    }
  }

  isFormValid(): boolean {
    console.log('Driver form data:', this.driver);
    if (
      this.driver.driver_name.length >= 3 &&
      this.driver.driver_name.length <= 20 &&
      ['food', 'furniture', 'electronic'].includes(
        this.driver.driver_department
      ) &&
      this.driver.driver_licence.length === 5
    ) {
      console.log('Form validation passed');
      return true;
    }
    console.warn('Form validation failed');
    return false;
  }
}
