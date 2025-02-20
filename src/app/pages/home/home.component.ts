import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { OlympicData, Country, Participation } from 'src/app/core/models/olympics.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public olympics$: Observable<OlympicData> = of({ countries: [] });
  public chartData: { name: string; value: number; tooltip: string }[] = [];
  public totalMedals: number = 0;
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public chartWidth: number = 500;
  public chartHeight: number = 400;


  private updateChartSize(): void {
    if (window.innerWidth < 700) {
      this.chartWidth = 375;  // Plus petit pour mobile
      this.chartHeight = 300;
    } else {
      this.chartWidth = 500;  // Taille normale
      this.chartHeight = 400;
    }
  }
  

  constructor(private olympicService: OlympicService, private router: Router) {}

  ngOnInit(): void {
    this.updateChartSize();
    window.addEventListener('resize', () => this.updateChartSize());
    this.olympics$ = this.olympicService.getOlympics();
    this.olympics$.subscribe((data) => {
      if (data) {
        this.prepareChartData(data);
        this.calculateStatistics(data);
      }
    });
  }

  private prepareChartData(data: any): void {
    this.chartData = data.map((country: Country) => {
      const totalMedals = country.participations.reduce(
        (total: number, participation: Participation) => total + participation.medalsCount,
        0
      );
      return {
        name: country.country, 
        value: totalMedals,
      };
    });
  }


  private calculateStatistics(data: any): void {
    this.totalMedals = data.reduce((sum: number, country: Country) => {
      return (
        sum +
        country.participations.reduce((countrySum: number, participation: Participation) => {
          return countrySum + participation.medalsCount;
        }, 0)
      );
    }, 0);

    this.totalCountries = data.length;

    const uniqueYears = new Set();
    data.forEach((country: Country) => {
      country.participations.forEach((participation: Participation) => {
        uniqueYears.add(participation.year);
      });
    });
    this.totalJOs = uniqueYears.size;
  }

  // Méthode pour rediriger l'utilisateur vers la page de détails du pays
  goToDetail(country: string): void {
    this.router.navigate(['/country', country]);
  }

  // Gérer l'événement de clic sur une portion du graphique
  onChartClick(event: { name: string }): void {
    const countryName = event.name; 
    this.goToDetail(countryName);   
  }
}
