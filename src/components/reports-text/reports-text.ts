import { Component, Input } from '@angular/core';

/**
 * Generated class for the ReportsTextComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'reports-text',
  templateUrl: 'reports-text.html'
})
export class ReportsTextComponent {

  @Input() data;
  @Input() questionNumber;

  constructor() {
    console.log('Hello ReportsTextComponent Component');

  }

}
