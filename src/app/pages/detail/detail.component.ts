import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicDetailService } from 'src/app/core/services/olympic-detail.service';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement, Title, Tooltip, Legend, Filler } from 'chart.js'; // Importer les composants nécessaires
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Country } from 'src/app/core/models/country.interface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, OnDestroy, AfterViewInit {
  public countryData$: Observable<Country | undefined> = new Observable();
  private chart!: Chart;

  private destroy$ = new Subject<void>(); // Subject utilisé pour prendre en charge le désabonnement

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicDetailService: OlympicDetailService,
    private cdr: ChangeDetectorRef // Inject ChangeDetectorRef
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
      this.router.navigate(['/not-found']);  // Rediriger vers la page d'erreur
      return;
    }

    // Récupérer les données de pays via le service
    this.countryData$ = this.olympicDetailService.getCountryData(countryName);
  }

  ngAfterViewInit(): void {
    // Gérer proprement l'abonnement
    this.countryData$.pipe(takeUntil(this.destroy$)).subscribe((countryData) => {
      if (!countryData) {
        console.error("Aucune donnée trouvée pour le pays.");
        this.router.navigate(['/not-found']);
        return;
      }

      // Préparer les données du graphique
      const chartData = this.olympicDetailService.prepareChartData(countryData);
      
      // Créer le graphique via le service
      const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
      if (canvas) {
        this.chart = this.olympicDetailService.createChart(canvas, chartData);
      }

      this.cdr.detectChanges();  // Assurer que la vue soit mise à jour avant de créer le graphique
    });
  }

  ngOnDestroy(): void {
    // Désabonnement propre
    this.destroy$.next();
    this.destroy$.complete();

    // Détruire le graphique si nécessaire
    if (this.chart) {
      this.chart.destroy();
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
