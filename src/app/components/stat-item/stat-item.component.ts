import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stat-item',
  templateUrl: './stat-item.component.html',
  styleUrls: ['./stat-item.component.scss']
})
export class StatItemComponent {
  @Input() title: string = '';  // Le titre pour le h2
  @Input() value: string = '';  // La valeur pour le p
}
