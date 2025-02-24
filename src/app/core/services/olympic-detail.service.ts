import { Injectable } from '@angular/core';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from 'src/app/core/models/country.interface';
import { Participation } from 'src/app/core/models/participation.interface';
import { Chart } from 'chart.js';  // Importer Chart.js pour pouvoir l'utiliser

@Injectable({
  providedIn: 'root',
})
export class OlympicDetailService {
  constructor(private olympicService: OlympicService) {}

  // Méthode pour obtenir les données du pays en fonction de son nom
  getCountryData(countryName: string): Observable<Country | undefined> {
    return this.olympicService.getOlympics().pipe(
      map(data => data.find((c: Country) => c.country === countryName))
    );
  }

  // Méthode pour préparer les données du graphique
  prepareChartData(countryData: Country): { labels: string[], datasets: any[], options: any } {
    if (!countryData || !countryData.participations) {
      console.error("Données invalides pour générer le graphique.");
      return { labels: [], datasets: [], options: {} };
    }

    const years = countryData.participations.map((p: Participation) => p.year.toString());
    const medals = countryData.participations.map((p: Participation) => p.medalsCount);

    const chartData = {
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
    };

    const chartOptions = {
      responsive: true,
      scales: {
        x: {
          type: 'category',
          title: { display: true, text: 'Dates' },
        },
        y: {
          title: { display: false, text: 'Nombre de médailles' },
          beginAtZero: true,
        },
      },
      plugins: {
        legend: { display: false },
      },
    };

    return { labels: years, datasets: chartData.datasets, options: chartOptions };
  }

  // Méthode pour créer le graphique
  createChart(canvas: HTMLCanvasElement, chartData: { labels: string[], datasets: any[], options: any }): Chart {
    return new Chart(canvas, {
      type: 'line',
      data: chartData,
      options: chartData.options,
    });
  }
}
