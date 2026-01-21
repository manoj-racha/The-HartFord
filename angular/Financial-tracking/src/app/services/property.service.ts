import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Property } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class PropertyService {
    private apiUrl = 'http://localhost:3000/properties';

    constructor(private http: HttpClient) { }

    getProperties(): Observable<Property[]> {
        return this.http.get<Property[]>(this.apiUrl);
    }
}
