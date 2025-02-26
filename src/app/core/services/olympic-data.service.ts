import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Country } from 'src/app/core/models/country.interface';
import { Chart } from 'chart.js';

@Injectable({
  providedIn: 'root',
})
export class OlympicDataService {
  private olympicUrl = './assets/mock/olympic.json';
  private olympics$ = new BehaviorSubject<Country[] | null>(null);

  constructor(private http: HttpClient) {}

  /**
   * Charge les données initiales des Jeux Olympiques.
   * Met à jour le BehaviorSubject `olympics$` avec les données chargées.
   * 
   * @returns Un `Observable` contenant la liste des pays participants.
   */
  loadInitialData(): Observable<Country[]> {
    return this.http.get<Country[]>(this.olympicUrl).pipe(
      tap((data) => this.olympics$.next(data)),
      catchError((error) => {
        console.error('Erreur de chargement des données', error);
        this.olympics$.next(null);
        throw error;
      })
    );
  }

  /**
   * Obtient les données olympiques sous forme d'Observable.
   * 
   * @returns Un `Observable` contenant un tableau de `Country` ou `null` si non chargé.
   */
  getOlympics(): Observable<Country[] | null> {
    return this.olympics$.asObservable();
  }

  /**
   * Obtient les données d'un pays spécifique.
   * 
   * @param countryName - Nom du pays recherché.
   * @returns Un `Observable` contenant l'objet `Country` ou `undefined` si non trouvé.
   */
  getCountryData(countryName: string): Observable<Country | undefined> {
    return this.getOlympics().pipe(
      map((data) => data?.find((country) => country.country === countryName))
    );
  }

  /**
   * Prépare les données pour l'affichage d'un graphique global des médailles.
   * 
   * @param countries - Liste des pays avec leurs participations.
   * @returns Un tableau d'objets contenant `name`, `value` (médailles) et `tooltip`.
   */
  prepareChartData(countries: Country[]): { name: string; value: number; tooltip: string }[] {
    return countries.map((country: Country) => {
      const totalMedals = country.participations.reduce((total, participation) => total + participation.medalsCount, 0);
      return {
        name: country.country,
        value: totalMedals,
        tooltip: `${country.country}: 🏅 ${totalMedals} médailles`,
      };
    });
  }

  /**
   * Calcule les statistiques générales des Jeux Olympiques.
   * 
   * @param countries - Liste des pays participants.
   * @returns Un objet contenant `totalMedals`, `totalCountries` et `totalJOs` (nombre de JO).
   */
  calculateStatistics(countries: Country[]): { totalMedals: number; totalCountries: number; totalJOs: number } {
    const totalMedals = countries.reduce((sum, country) => 
      sum + country.participations.reduce((countrySum, participation) => countrySum + participation.medalsCount, 0), 0
    );

    const totalCountries = countries.length;

    const uniqueYears = new Set<number>();
    countries.forEach((country) => 
      country.participations.forEach((participation) => uniqueYears.add(participation.year))
    );

    return { totalMedals, totalCountries, totalJOs: uniqueYears.size };
  }

  /**
   * Prépare les données pour afficher un graphique des médailles d'un pays donné.
   * 
   * @param countryData - Données du pays.
   * @returns Un objet contenant `labels` (années), `datasets` (médailles) et `options` (config graphique).
   */
  prepareCountryChartData(countryData: Country): { labels: string[], datasets: any[], options: any } {
    if (!countryData || !countryData.participations) {
      console.error("Données invalides pour générer le graphique.");
      return { labels: [], datasets: [], options: {} };
    }

    const years = countryData.participations.map((p) => p.year.toString());
    const medals = countryData.participations.map((p) => p.medalsCount);

    return {
      labels: years,
      datasets: [
        {
          label: `Medals of ${countryData.country}`,
          data: medals,
          borderColor: '#42A5F5',
          backgroundColor: 'rgba(66, 165, 245, 0.2)',
          fill: true,
        },
      ],
      options: {
        responsive: true,
        scales: {
          x: { type: 'category', title: { display: true, text: 'Dates' } },
          y: { beginAtZero: true, title: { display: false, text: 'Medals' } },
        },
        plugins: { legend: { display: false } },
      },
    };
  }

  /**
   * Crée un graphique à partir des données fournies.
   * 
   * @param canvas - Élément HTML `<canvas>` pour dessiner le graphique.
   * @param chartData - Données formatées pour le graphique.
   * @returns Une instance de `Chart.js` pour l'affichage des données.
   */
  createChart(canvas: HTMLCanvasElement, chartData: { labels: string[], datasets: any[], options: any }): Chart {
    return new Chart(canvas, {
      type: 'line',
      data: chartData,
      options: chartData.options,
    });
  }
}
