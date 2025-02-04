/** @format */

import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

const API_URL = "/32758324/tzeying/api/v1";

const httpOptions = {
	headers: new HttpHeaders({ "Content-Type": "application/json" }),
};

@Injectable({
	providedIn: "root",
})
export class DatabaseService {
	constructor(private http: HttpClient) {}

	createDriver(driver: any) {
		return this.http.post(API_URL + "/drivers/add", driver, httpOptions);
	}

	getDrivers() {
		return this.http.get(API_URL + "/drivers");
	}

	deleteDriver(driverId: string) {
		return this.http.delete(
			`${API_URL}/drivers/delete_driver?id=${driverId}`,
			httpOptions
		);
	}

	updateDriver(
		driverId: string,
		driverLicence: string,
		driverDepartment: string
	): Observable<string> {
		const body = {
			driverId,
			driver_licence: driverLicence,
			driver_department: driverDepartment,
		};
		return this.http.put<string>(`${API_URL}/drivers/update_driver`, body);
	}

	createPackage(aPackage: any) {
		return this.http.post(API_URL + "/packages/add", aPackage, httpOptions);
	}

	getPackages() {
		return this.http.get(API_URL + "/packages");
	}

	deletePackage(packageId: string) {
		return this.http.delete(
			`${API_URL}/packages/delete_packages?package_id=${packageId}`,
			httpOptions
		);
	}

	updatePackage(
		packageId: string,
		packageDestination: string
	): Observable<string> {
		const body = {
			package_id: packageId,
			package_destination: packageDestination,
		};
		return this.http.put<string>(`${API_URL}/packages/update_packages`, body);
	}

	getStats(): Observable<any> {
		return this.http.get<any>(API_URL + "/statistics");
	}
}
