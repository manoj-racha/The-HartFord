import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Insurance } from '../models/insurance.model';
import { InsuranceService } from '../services/insurance.service';

@Component({
  selector: 'app-update-insurance',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './update-insurance.html',
  styleUrl: './update-insurance.css',
})
export class UpdateInsurance implements OnInit {

  id: number = 0;
  insurance: Insurance = {
    id: 0,
    name: '',
    policyNumber: '',
    policyType: '',
    premium: 0,
    phone: '',
    email: '',
    dateOfBirth: '',
    nominee: '',
    address: {
      street: '',
      city: '',
      state: '',
      pincode: ''
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private insuranceService: InsuranceService
  ) { }

  ngOnInit(): void {
    // 1. Get the ID from the URL (e.g., /update/1 -> id = 1)
    this.id = this.route.snapshot.params['id'];

    // 2. Fetch the existing data for this ID
    this.insuranceService.getInsuranceById(this.id).subscribe({
      next: (data) => {
        this.insurance = data;
        console.log('Data fetched for update:', data);
      },
      error: (err) => console.error('Error fetching insurance details', err)
    });
  }

  updateInsurance() {
    // 3. Send the updated data back to the server
    this.insuranceService.updateInsurance(this.id, this.insurance).subscribe({
      next: (data) => {
        console.log('Update successful', data);
        this.router.navigate(['/']); // Go back to list
      },
      error: (err) => console.error('Error updating insurance', err)
    });
  }
}
