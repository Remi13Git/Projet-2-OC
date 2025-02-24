import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { CommonModule } from '@angular/common';
import { AppComponent } from './app.component';
import { HomeComponent } from './pages/home/home.component';
import { DetailComponent } from './pages/detail/detail.component';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { BaseChartDirective } from 'ng2-charts';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { TotalMedalsPipe } from './core/pipes/getTotalMedals.pipe';
import { TotalAthletesPipe } from './core/pipes/getTotalAthletes.pipe';
import { TotalParticipationsPipe } from './core/pipes/getTotalParticipation.pipe';
import { StatTitleComponent } from './components/stat-title/stat-title.component';
import { StatItemComponent } from './components/stat-item/stat-item.component';

@NgModule({
  declarations: [AppComponent, HomeComponent, DetailComponent, NotFoundComponent, TotalMedalsPipe, TotalAthletesPipe, TotalParticipationsPipe, StatTitleComponent, StatItemComponent],
  imports: [BrowserModule, CommonModule, AppRoutingModule, HttpClientModule, BaseChartDirective, NgxChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
