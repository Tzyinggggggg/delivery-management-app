import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-statistic',
  standalone: true,
  templateUrl: './statistic.component.html',
  styleUrls: ['./statistic.component.css'],
})
export class StatisticComponent implements OnInit {
  insertCount: number = 0;
  retrieveCount: number = 0;
  updateCount: number = 0;
  deleteCount: number = 0;

  constructor(private dbService: DatabaseService) {}

  ngOnInit(): void {
    this.getStatistics();
  }

  getStatistics(): void {
    this.dbService.getStats().subscribe({
      next: (data) => {
        this.insertCount = data.insertCount;
        this.retrieveCount = data.retrieveCount;
        this.updateCount = data.updateCount;
        this.deleteCount = data.deleteCount;
      },
      error: (err) => {
        console.error('Error fetching statistics:', err);
      },
    });
  }
}
