import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicDataService } from 'src/app/core/services/olympic-data.service';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Observable, Subject } from 'rxjs';
import { takeUntil, map } from 'rxjs/operators';
import { Country } from 'src/app/core/models/country.interface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy, AfterViewInit {
  public countryData$: Observable<Country | undefined> = new Observable();
  private chart!: Chart;
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicDataService: OlympicDataService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    Chart.register(
      CategoryScale,
      LinearScale,
      LineController,
      LineElement,
      PointElement,
      Title,
      Tooltip,
      Legend,
      Filler
    );

    const countryName = this.route.snapshot.paramMap.get('country');

    if (!countryName) {
      console.error("Aucun pays trouvé dans l'URL.");
      this.router.navigate(['/not-found']);
      return;
    }

    // Récupérer les données du pays via le service centralisé
    this.countryData$ = this.olympicDataService.getOlympics().pipe(
      map((countries) => countries?.find((c: Country) => c.country === countryName))
    );
  }

  ngAfterViewInit(): void {
    this.countryData$.pipe(takeUntil(this.destroy$)).subscribe((countryData) => {
      if (!countryData) {
        console.error("Aucune donnée trouvée pour le pays.");
        this.router.navigate(['/not-found']);
        return;
      }

      // Préparer les données du graphique
      const chartData = this.olympicDataService.prepareCountryChartData(countryData);

      // Créer le graphique
      const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
      if (canvas) {
        this.chart = this.createChart(canvas, chartData);
      }

      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();

    if (this.chart) {
      this.chart.destroy();
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private createChart(canvas: HTMLCanvasElement, chartData: { labels: string[], datasets: any[], options: any }): Chart {
    return new Chart(canvas, {
      type: 'line',
      data: chartData,
      options: chartData.options,
    });
  }
}
