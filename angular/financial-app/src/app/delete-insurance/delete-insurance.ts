import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Insurance } from '../models/insurance.model';
import { InsuranceService } from '../services/insurance.service';

@Component({
  selector: 'app-delete-insurance',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-insurance.html',
  styleUrl: './delete-insurance.css',
})
export class DeleteInsurance implements OnInit {

  id: number = 0;
  insurance: Insurance | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private insuranceService: InsuranceService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.insuranceService.getInsuranceById(this.id).subscribe({
      next: (data) => this.insurance = data,
      error: (err) => console.error('Error fetching data', err)
    });
  }

  confirmDelete() {
    this.insuranceService.deleteInsurance(this.id).subscribe({
      next: () => {
        console.log('Deleted successfully');
        this.router.navigate(['/']);
      },
      error: (err) => console.error('Error deleting', err)
    });
  }

  cancel() {
    this.router.navigate(['/']);
  }
}
