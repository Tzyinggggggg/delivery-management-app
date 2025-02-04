import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'weight',
  standalone: true,
})
export class WeightPipe implements PipeTransform {
  transform(value: number): string {
    const grams = value * 1000;
    return `${grams}g`;
  }
}
