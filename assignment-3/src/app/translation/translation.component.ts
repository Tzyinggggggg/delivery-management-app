import { Component, OnInit } from '@angular/core';
import { WeightPipe } from '../weight.pipe';
import { Package } from '../models/package';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';
import io from 'socket.io-client';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-translation',
  standalone: true,
  imports: [CommonModule, FormsModule, WeightPipe],
  templateUrl: './translation.component.html',
  styleUrl: './translation.component.css',
})
export class TranslationComponent implements OnInit {
  packages: Package[] = [];
  translatedMessage: { [key: string]: string } = {};
  selectedLanguage: { [key: string]: string } = {}; // Store selected language for each package
  translatedPackageId: string | null = null; // Store the package ID of the translated package
  socket: any;

  constructor(private dbService: DatabaseService, private router: Router) {
    // this.socket = io('http://35.189.53.197:8081');
    this.socket = io('http://localhost:8081');
  }

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

    // Listen for translated description from the backend
    this.socket.on(
      'translatedDescription',
      (data: { packageId: string; translatedText: string }) => {
        console.log('Translated Text:', data.translatedText);
        // Store the translated text using the package ID
        this.translatedMessage[data.packageId] = data.translatedText;
        // Store the translated package ID to display the translated message under the table
        this.translatedPackageId = data.packageId;
      }
    );

    // Handle any translation errors
    this.socket.on('errorTranslation', (errorMessage: string) => {
      console.error('Translation Error:', errorMessage);
      alert('Translation failed. Please try again.');
    });
  }

  translate(pkg: Package) {
    const language = this.selectedLanguage[pkg._id] || 'es'; // Use the selected language for the specific package
    console.log('Emitting translation request for package:', pkg);
    // Send the description and selected language to the server via Socket.io
    this.socket.emit('translatePackage', {
      packageId: pkg._id,
      description: pkg.description,
      language: language,
    });
  }
}
