import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicService } from './core/services/olympic.service';
import { ChartOptions, ChartData } from 'chart.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  chartData: ChartData<'bar'> = { // initialisation avec une structure vide
    labels: [],
    datasets: [],
  };
  
  chartOptions: ChartOptions = {
    responsive: true,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
  };
  chartType: 'bar' = 'bar'; // Type de graphique à barres

  constructor(private olympicService: OlympicService) {}

  ngOnInit(): void {
    // Chargement des données depuis le service et abonnement à l'observable
    this.olympicService.loadInitialData().pipe(take(1)).subscribe(() => {
      this.olympicService.getOlympics().pipe(take(1)).subscribe((data) => {
        if (data) {
          this.prepareChartData(data);
        }
      });
    });
  }

  // Transformation des données pour le graphique
  prepareChartData(data: any): void {
    const countries = data.map((entry: any) => entry.country);
    const medalsCounts = data.map((entry: any) => {
      return entry.participations.reduce(
        (total: number, participation: any) => total + participation.medalsCount,
        0
      );
    });

    // Assignation des données au graphique
    this.chartData = {
      labels: countries,
      datasets: [
        {
          data: medalsCounts,
          label: 'Total des médailles',
          backgroundColor: 'rgba(75, 192, 192, 0.2)', // Couleur de fond des barres
          borderColor: 'rgba(75, 192, 192, 1)',     // Couleur du bord des barres
          borderWidth: 1,
        },
      ],
    };
  }
}
