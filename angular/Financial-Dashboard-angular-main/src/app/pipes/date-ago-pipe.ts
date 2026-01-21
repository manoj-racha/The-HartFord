import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dateAgo',
  standalone: true,
  pure: false
})
export class DateAgoPipe implements PipeTransform {
  transform(value: Date | string): string {
    if (!value) return '';
    const date = new Date(value);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) return 'Just now';

    const intervals: Record<string, number> = {
      year: 31536000, month: 2592000, week: 604800,
      day: 86400, hour: 3600, minute: 60
    };

    for (const [key, value] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / value);
      if (interval >= 1) {
        return `${interval} ${key}${interval > 1 ? 's' : ''} ago`;
      }
    }
    return 'Just now';
  }
}
