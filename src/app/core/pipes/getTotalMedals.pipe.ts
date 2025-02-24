import { Pipe, PipeTransform } from '@angular/core';
import { Participation } from 'src/app/core/models/participation.interface';

@Pipe({
  name: 'totalMedals'
})
export class TotalMedalsPipe implements PipeTransform {
  transform(participations: Participation[] | undefined): number {
    return participations?.reduce((sum, p) => sum + p.medalsCount, 0) || 0; // Retourne 0 si undefined
  }
}
