import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-title',
  templateUrl: './stat-title.component.html',
  styleUrls: ['./stat-title.component.scss']
})
export class StatTitleComponent {
  @Input() title: string = '';  // Titre à afficher
}
