import { Driver } from './driver';

export class Package {
  _id!: string;
  package_id!: string;
  package_title: string;
  package_weight: number;
  package_destination: string;
  description?: string;
  isAllocated: boolean;
  driver_id?: Driver;
  createdAt?: Date;

  constructor() {
    this.package_title = '';
    this.package_weight = 0;
    this.package_destination = '';
    this.isAllocated = false;
  }
}
