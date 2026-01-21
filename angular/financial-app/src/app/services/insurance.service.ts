import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Insurance } from '../models/insurance.model';

/**
 * Service: InsuranceService
 * -------------------------
 * This file is the "Manager" for our data.
 * 
 * WHY WE NEED IT:
 * 1. Separation of Concerns: Components should only care about showing data, not fetching it.
 * 2. Reusability: We can use 'getAllInsurances()' in multiple places without rewriting the API call code.
 * 3. Maintenance: If the API URL changes, we only update it here, not in every component.
 */

@Injectable({
    providedIn: 'root' // This makes the service available everywhere in the app automatically.
})
export class InsuranceService {

    // The URL where our JSON Server is listening for requests.
    private apiUrl = 'http://localhost:3000/insuranceHolders';

    // We inject HttpClient here. This is the tool Angular gives us to make web requests.
    constructor(private http: HttpClient) { }

    /**
     * READ (All): Gets the list of all insurance holders.
     * Returns: An Observable (a stream of data) containing an array of Insurance objects.
     */
    getAllInsurances(): Observable<Insurance[]> {
        return this.http.get<Insurance[]>(this.apiUrl);
    }

    /**
     * READ (One): Gets a single insurance holder by their unique ID.
     * Useful for the 'Update' page where we need to show existing details.
     */
    getInsuranceById(id: number): Observable<Insurance> {
        return this.http.get<Insurance>(`${this.apiUrl}/${id}`);
    }

    /**
     * CREATE: Sends a new insurance holder's data to the server to be saved.
     * We send the 'insurance' object as the "body" of the POST request.
     */
    addInsurance(insurance: Insurance): Observable<Insurance> {
        return this.http.post<Insurance>(this.apiUrl, insurance);
    }

    /**
     * UPDATE: Updates an existing insurance holder.
     * We need the ID to know WHO to update, and the DATA to know WHAT to change.
     */
    updateInsurance(id: number, insurance: Insurance): Observable<Insurance> {
        return this.http.put<Insurance>(`${this.apiUrl}/${id}`, insurance);
    }

    /**
     * DELETE: Removes an insurance holder from the server permanently.
     */
    deleteInsurance(id: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${id}`);
    }
}
