import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { OlympicDataService } from 'src/app/core/services/olympic-data.service';
import { Country } from 'src/app/core/models/country.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  public chartData: { name: string; value: number; tooltip: string }[] = [];
  public totalMedals: number = 0;
  public totalCountries: number = 0;
  public totalJOs: number = 0;
  public chartWidth: number = 500;
  public chartHeight: number = 400;

  constructor(
    private olympicDataService: OlympicDataService, 
    private router: Router
  ) {}

  ngOnInit(): void {
    this.updateChartSize();
    window.addEventListener('resize', () => this.updateChartSize());

    // Charger les données uniquement si elles ne sont pas déjà disponibles
    this.olympicDataService.getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (!data) {
          this.olympicDataService.loadInitialData().subscribe();
        } else {
          this.processData(data);
        }
      });

    // Écouter les mises à jour des données
    this.olympicDataService.getOlympics()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        if (data) {
          this.processData(data);
        }
      });
  }

  private processData(data: Country[]): void {
    this.chartData = this.olympicDataService.prepareChartData(data);
    const stats = this.olympicDataService.calculateStatistics(data);
    this.totalMedals = stats.totalMedals;
    this.totalCountries = stats.totalCountries;
    this.totalJOs = stats.totalJOs;
  }

  private updateChartSize(): void {
    if (window.innerWidth < 700) {
      this.chartWidth = 375;
      this.chartHeight = 300;
    } else {
      this.chartWidth = 500;
      this.chartHeight = 400;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(); 
    this.destroy$.complete();
  }

  goToDetail(country: string): void {
    this.router.navigate(['/country', country]);
  }

  onChartClick(event: { name: string }): void {
    this.goToDetail(event.name);
  }
}
