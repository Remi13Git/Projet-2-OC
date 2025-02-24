import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, Subject } from 'rxjs';
import { OlympicStatisticsService } from 'src/app/core/services/olympic-statistics.service';
import { Country } from 'src/app/core/models/country.interface';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public olympics$: Observable<Country[]>;  
  public chartData: { name: string; value: number; tooltip: string }[] = [];
  public totalMedals: number = 0;
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public chartWidth: number = 500;
  public chartHeight: number = 400;

  private updateChartSize(): void {
    if (window.innerWidth < 700) {
      this.chartWidth = 375;
      this.chartHeight = 300;
    } else {
      this.chartWidth = 500;
      this.chartHeight = 400;
    }
  }

  constructor(
    private olympicStatisticsService: OlympicStatisticsService, 
    private router: Router
  ) {
    this.olympics$ = of([]); // Initialisation d'Observable vide
  }

  ngOnInit(): void {
    this.updateChartSize();
    window.addEventListener('resize', () => this.updateChartSize());

    this.olympicStatisticsService.getOlympicsData()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data) => {
          if (data && Array.isArray(data)) {
            this.chartData = this.olympicStatisticsService.prepareChartData(data);
            const stats = this.olympicStatisticsService.calculateStatistics(data);
            this.totalMedals = stats.totalMedals;
            this.totalCountries = stats.totalCountries;
            this.totalJOs = stats.totalJOs;
          }
        },
        error: (err) => {
          console.error("Erreur lors de la récupération des données :", err);
        }
      });
  }
  
  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete(); 
  }

  goToDetail(country: string): void {
    this.router.navigate(['/country', country]);
  }

  onChartClick(event: { name: string }): void {
    const countryName = event.name;
    this.goToDetail(countryName);
  }
}