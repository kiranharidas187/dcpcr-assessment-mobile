import { Component, Input } from '@angular/core';

/**
 * Generated class for the QuestionHeadingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'question-heading',
  templateUrl: 'question-heading.html'
})
export class QuestionHeadingComponent {

  text: string;
  @Input()data ;
  @Input()inputIndex;
  constructor() {
    console.log('Hello QuestionHeadingComponent Component');
    this.text = 'Hello World';
  }

}
