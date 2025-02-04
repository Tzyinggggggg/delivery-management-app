import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { UppercasePipe } from '../driver-name-uppercase.pipe';
import { Driver } from '../models/driver';
import { DatabaseService } from '../database.service';
import io from 'socket.io-client';

@Component({
  selector: 'app-text2speech',
  standalone: true,
  imports: [CommonModule, UppercasePipe],
  templateUrl: './text2speech.component.html',
  styleUrls: ['./text2speech.component.css'],
})
export class Text2speechComponent implements OnInit, OnDestroy {
  drivers: Driver[] = [];
  socket: any;
  audioUrls: { [key: string]: string } = {};

  constructor(private dbService: DatabaseService) {
    // this.socket = io('http://35.189.53.197:8081');
    this.socket = io('http://localhost:8081');
  }

  onGetDrivers() {
    return this.dbService.getDrivers().subscribe((data: any) => {
      this.drivers = data;
    });
  }

  trackByDriverId(index: number, driver: Driver): string {
    return driver.driver_id;
  }

  onConvertToSpeech(driver: Driver) {
    console.log('Requesting text-to-speech conversion for driver:', driver);

    this.socket.emit('convertToSpeech', {
      driverLicence: driver.driver_licence,
      language: 'en-US',
      driverId: driver.driver_id,
    });
  }

  ngOnInit() {
    this.onGetDrivers();

    this.socket.on('audioReady', (data: { url: string; driverId: string }) => {
      console.log(
        'Received audio file URL:',
        data.url,
        'for driver:',
        data.driverId
      );
      // this.audioUrls[data.driverId] = `http://35.189.53.197:8081${data.url}`;
      this.audioUrls[data.driverId] = `http://localhost:8081${data.url}`;
    });

    this.socket.on('error', (errorMessage: string) => {
      console.error('Text-to-speech error:', errorMessage);
      alert('Text-to-speech conversion failed. Please try again.');
    });
  }

  getAudioUrl(driverId: string): string | null {
    return this.audioUrls[driverId] || null;
  }

  ngOnDestroy() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}
