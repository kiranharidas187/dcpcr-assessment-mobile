import { Component, Input } from '@angular/core';

@Component({
  selector: 'progress-bar',
  templateUrl: 'progress-bar.html'
})
export class ProgressBarComponent {

  @Input('progress') progress = 0;
  @Input('total')total = 0;
  @Input('completed')completed = 0;
  @Input() showTracker ;
  constructor() {
    // this.progress = 10
    console.log('Hello ProgressBarComponent Component');
  }

}
