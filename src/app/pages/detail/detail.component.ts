import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OlympicService } from 'src/app/core/services/olympic.service';
import { Chart, LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale } from 'chart.js';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit, AfterViewInit {
  public countryData: any;
  public chartData: any;
  public chartOptions: any;
  public totalParticipations = 0;
  public totalMedals = 0;
  public totalAthletes = 0;
  private chart!: Chart;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private olympicService: OlympicService
  ) {}

  ngOnInit(): void {
    Chart.register(LineController, LineElement, PointElement, LinearScale, Title, Tooltip, Legend, CategoryScale);

    const countryName = this.route.snapshot.paramMap.get('country');
    
    if (!countryName) {
      console.error("Aucun pays trouvé dans l'URL.");
      return;
    }

    console.log('Nom du pays récupéré :', countryName);

    this.olympicService.getOlympics().subscribe((data) => {
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error('Données invalides ou non disponibles.');
        return;
      }

      this.countryData = data.find((c: any) => c.country === countryName);

      if (!this.countryData) {
        console.error("Aucune donnée trouvée pour le pays :", countryName);
        return;
      }

      console.log('Pays trouvé :', this.countryData);
      
      // Calcul des statistiques
      this.totalParticipations = this.countryData.participations.length;
      this.totalMedals = this.countryData.participations.reduce(
        (sum: number, p: any) => sum + p.medalsCount, 0
      );
      this.totalAthletes = this.countryData.participations.reduce(
        (sum: number, p: any) => sum + p.athleteCount, 0
      ); // Correction ici

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

    const years = this.countryData.participations.map((p: any) => p.year);
    const medals = this.countryData.participations.map((p: any) => p.medalsCount);

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

    this.chart = new Chart(canvas, {
      type: 'line',
      data: this.chartData,
      options: this.chartOptions,
    });
  }
}
