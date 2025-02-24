import { Pipe, PipeTransform } from '@angular/core';
import { Participation } from 'src/app/core/models/participation.interface';

@Pipe({
  name: 'totalAthletes'
})
export class TotalAthletesPipe implements PipeTransform {
  transform(participations: Participation[] | undefined): number {
    return participations?.reduce((sum, p) => sum + p.athleteCount, 0) || 0; // Retourne 0 si undefined
  }
}
