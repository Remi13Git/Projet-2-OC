import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Country } from 'src/app/core/models/country.interface';

@Injectable({
  providedIn: 'root',
})
export class OlympicStatisticsService {
  constructor(private olympicService: OlympicService) {}

  // Méthode pour récupérer les données olympiques
  getOlympicsData(): Observable<Country[]> {
    return this.olympicService.getOlympics();
  }

  // Préparer les données du graphique
  prepareChartData(countries: Country[]): { name: string; value: number; tooltip: string }[] {
    return countries.map((country: Country) => {
      const totalMedals = country.participations.reduce(
        (total: number, participation) => total + participation.medalsCount,
        0
      );
      return {
        name: country.country,
        value: totalMedals,
        tooltip: `${country.country}: 🏅 ${totalMedals} médailles`,
      };
    });
  }

  // Calculer les statistiques globales
  calculateStatistics(countries: Country[]): { totalMedals: number; totalCountries: number; totalJOs: number } {
    const totalMedals = countries.reduce((sum: number, country: Country) => {
      return (
        sum +
        country.participations.reduce((countrySum: number, participation) => {
          return countrySum + participation.medalsCount;
        }, 0)
      );
    }, 0);

    const totalCountries = countries.length;

    const uniqueYears = new Set();
    countries.forEach((country: Country) => {
      country.participations.forEach((participation) => {
        uniqueYears.add(participation.year);
      });
    });
    const totalJOs = uniqueYears.size;

    return { totalMedals, totalCountries, totalJOs };
  }
}
