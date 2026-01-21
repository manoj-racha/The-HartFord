import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'transactionStatus',
  standalone: true
})
export class TransactionStatusPipe implements PipeTransform {
  transform(status: string): { label: string; class: string } {
    const statusMap: Record<string, { label: string; class: string }> = {
      'pending': { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      'completed': { label: 'Completed', class: 'bg-green-100 text-green-800' },
      'cancelled': { label: 'Cancelled', class: 'bg-red-100 text-red-800' }
    };
    return statusMap[status] || { label: status, class: 'bg-gray-100 text-gray-800' };
  }
}
