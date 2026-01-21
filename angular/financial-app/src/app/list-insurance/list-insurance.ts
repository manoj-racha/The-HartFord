import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Insurance } from '../models/insurance.model';
import { InsuranceService } from '../services/insurance.service';

@Component({
  selector: 'app-list-insurance',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './list-insurance.html',
  styleUrl: './list-insurance.css',
})
export class ListInsurance implements OnInit { // We implement OnInit to run code when component starts

  insurances: Insurance[] = [];

  constructor(private insuranceService: InsuranceService) { }

  // ngOnInit is a lifecycle hook. It runs once when the component is initialized.
  ngOnInit(): void {
    this.getAllInsurances();
  }

  getAllInsurances() {
    // We subscribe to the observable returned by the service
    this.insuranceService.getAllInsurances().subscribe({
      next: (data) => {
        this.insurances = data;
        console.log('Insurances loaded:', data);
      },
      error: (e) => console.error('Error fetching insurances', e)
    });
  }

  // We will need this later for the delete button
  deleteInsurance(id: number) {
    if (confirm('Are you sure you want to delete this policy holder?')) {
      this.insuranceService.deleteInsurance(id).subscribe({
        next: () => {
          console.log('Deleted insurance with id:', id);
          // Refresh the list after deletion
          this.getAllInsurances();
        },
        error: (err) => console.error('Error deleting', err)
      });
    }
  }
}
