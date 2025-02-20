import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, Filler, ChartOptions } from 'chart.js';
import { Subscription } from 'rxjs';
import { OlympicData, Country, Participation } from 'src/app/core/models/olympics.interface';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, AfterViewInit, OnDestroy {
  public countryData!: Country;
  public chartData: { labels: string[]; datasets: { label: string; data: number[]; borderColor: string; backgroundColor: string; fill: boolean }[] } = { labels: [], datasets: [] };
  public chartOptions: ChartOptions = {};  // Initialisation avec un objet vide
  public totalParticipations = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  private chart!: Chart;
  private olympicsSubscription: Subscription = new Subscription(); 

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale, Filler);

    const countryName = this.route.snapshot.paramMap.get('country');
    
    if (!countryName) {
      console.error("Aucun pays trouvé dans l'URL.");
      this.router.navigate(['/not-found']);  // Rediriger vers la page d'erreur
      return;
    }

    console.log('Nom du pays récupéré :', countryName);

    this.olympicsSubscription = this.olympicService.getOlympics().subscribe((data) => {
      if (!data || !Array.isArray(data) || data.length === 0) {
        return;
      }

      this.countryData = data.find((c: Country) => c.country === countryName);

      if (!this.countryData) {
        console.error("Aucune donnée trouvée pour le pays :", countryName);
        this.router.navigate(['/not-found']);
        return;
      }

      console.log('Pays trouvé :', this.countryData);
      
      // Calcul des statistiques
      this.totalParticipations = this.countryData.participations.length;
      this.totalMedals = this.countryData.participations.reduce(
        (sum: number, p: Participation) => sum + p.medalsCount, 0
      );
      this.totalAthletes = this.countryData.participations.reduce(
        (sum: number, p: Participation) => sum + p.athleteCount, 0
      );

      this.prepareChartData();

      setTimeout(() => {
        this.createChart();
      }, 100);
    });
  }

  ngAfterViewInit(): void {
    if (this.chartData) {
      this.createChart();
    }
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  private prepareChartData(): void {
    if (!this.countryData || !this.countryData.participations) {
      console.error("Données invalides pour générer le graphique.");
      return;
    }

    const years = this.countryData.participations.map((p: Participation) => p.year.toString());  // On convertit le number en string
  const medals = this.countryData.participations.map((p: Participation) => p.medalsCount);

  this.chartData = {
    labels: years, 
    datasets: [
      {
        label: `Medals of ${this.countryData.country}`,
        data: medals,
        borderColor: '#42A5F5',
        backgroundColor: 'rgba(66, 165, 245, 0.2)',
        fill: true,
      },
    ],
  };

    this.chartOptions = {
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
  }

  private createChart(): void {
    const canvas = document.getElementById('lineChart') as HTMLCanvasElement;
    if (!canvas) {
      console.error("Le canvas 'lineChart' n'a pas été trouvé.");
      return;
    }

    // Si un graphique existe déjà, le détruire
    if (this.chart) {
      this.chart.destroy();
    }

    // Créer un nouveau graphique
    this.chart = new Chart(canvas, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions,
    });
  }

  ngOnDestroy(): void {
    if (this.chart) {
      this.chart.destroy();
    }
    // Se désabonner de la souscription pour éviter les fuites de mémoire
    if (this.olympicsSubscription) {
      this.olympicsSubscription.unsubscribe();
    }
  }
}
