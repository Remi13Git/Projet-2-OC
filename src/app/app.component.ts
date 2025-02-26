import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs';
import { OlympicDataService } from './core/services/olympic-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private olympicDataService: OlympicDataService) {}

  ngOnInit(): void {
    this.olympicDataService.loadInitialData().pipe(take(1)).subscribe();
  }
}