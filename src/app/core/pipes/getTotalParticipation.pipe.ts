import { Pipe, PipeTransform } from '@angular/core';
import { Participation } from 'src/app/core/models/participation.interface';

@Pipe({
  name: 'totalParticipations'
})
export class TotalParticipationsPipe implements PipeTransform {
  transform(participations: Participation[] | undefined): number {
    return participations?.length || 0; // Retourne 0 si undefined
  }
}
