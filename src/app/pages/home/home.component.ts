import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart, PieController, ArcElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import 'chartjs-plugin-annotation';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<any> = of(null);
  public chartData: any = {
    labels: [],
    datasets: [],
  };

  public totalMedals: number = 0;
  public totalCountries: number = 0;
  public totalJOs: number = 0;

  public chartOptions: any = {
    responsive: true,
    plugins: {
      tooltip: {
        backgroundColor: '#00838f', // Fond du tooltip
        titleColor: '#ffffff', // Couleur du titre
        bodyColor: '#ffffff', // Couleur du texte
        padding: 10,
        displayColors: false, // Désactive la couleur du carré à gauche
        callbacks: {
          label: function (tooltipItem: any) {
            return `🏅 ${tooltipItem.raw}`;
          },
        },
      },
      legend: {
        display: false,
      },
    },
    onClick: (event: any, elements: any[]) => {
      if (elements.length > 0) {
        const index = elements[0].index;
        const country = this.chartData.labels[index];
        this.goToDetail(country);
      }
    },
  };
  

  // Mapping des couleurs fixes pour les pays
  private countryColors: { [key: string]: string } = {
    Germany: '#793c52',
    'United States': '#89a1db',
    France: '#9680a2',
    Spain: '#b8cbe7',
    Italy: '#946065',
  };

  constructor(private olympicService: OlympicService, private router: Router) {} 

  ngOnInit(): void {
    Chart.register(PieController, ArcElement, Title, Tooltip, Legend, Filler);
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((data) => {
      if (data) {
        this.prepareChartData(data);
        this.calculateStatistics(data);
      }
    });
  }

  private prepareChartData(data: any): void {
    const labels = data.map((country: any) => country.country);
    const datasets = [
      {
        label: 'Medals Count',
        data: data.map((country: any) => {
          return country.participations.reduce(
            (total: number, participation: any) => total + participation.medalsCount,
            0
          );
        }),
        backgroundColor: data.map((country: any) => this.getCountryColor(country.country)),
        borderWidth: 1,
      },
    ];

    this.chartData = {
      labels: labels,
      datasets: datasets,
    };
  }

  private calculateStatistics(data: any): void {
    this.totalMedals = data.reduce((sum: number, country: any) => {
      return sum + country.participations.reduce((countrySum: number, participation: any) => {
        return countrySum + participation.medalsCount;
      }, 0);
    }, 0);

    this.totalCountries = data.length;

    const uniqueYears = new Set();
    data.forEach((country: any) => {
      country.participations.forEach((participation: any) => {
        uniqueYears.add(participation.year);
      });
    });
    this.totalJOs = uniqueYears.size;
  }

  // Récupérer la couleur en fonction du pays
  private getCountryColor(country: string): string {
    return this.countryColors[country] ;
  }



  goToDetail(country: string): void {
    this.router.navigate(['/country', country]); 
  }
}
