import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-driver',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-driver.component.html',
  styleUrls: ['./update-driver.component.css'],
})
export class UpdateDriverComponent implements OnInit {
  driverId!: string;
  driverLicence: string = '';
  driverDepartment: string = '';

  constructor(
    private route: ActivatedRoute,
    private db: DatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.driverId = this.route.snapshot.paramMap.get('id') || '';
  }

  updateDriver(): void {
    this.db
      .updateDriver(this.driverId, this.driverLicence, this.driverDepartment)
      .subscribe({
        next: (response: string) => {
          console.log(response);
          this.router.navigate(['/list-drivers']);
        },
        error: (err) => {
          console.error('Error updating driver:', err);
          this.router.navigate(['/invalid-data']);
        },
      });
  }
}
