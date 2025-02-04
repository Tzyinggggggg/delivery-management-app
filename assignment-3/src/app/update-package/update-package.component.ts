import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DatabaseService } from '../database.service';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-update-package',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-package.component.html',
  styleUrls: ['./update-package.component.css'],
})
export class UpdatePackageComponent implements OnInit {
  packageId!: string;
  packageDestination: string = '';

  constructor(
    private route: ActivatedRoute,
    private db: DatabaseService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.packageId = this.route.snapshot.paramMap.get('id') || '';
  }

  updatePackage(): void {
    this.db.updatePackage(this.packageId, this.packageDestination).subscribe({
      next: (response: string) => {
        console.log(response);
        this.router.navigate(['/list-packages']);
      },
      error: (err) => {
        console.error('Error updating package:', err);
        this.router.navigate(['/invalid-data']);
      },
    });
  }
}
