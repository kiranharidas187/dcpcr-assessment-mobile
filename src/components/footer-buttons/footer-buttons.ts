import { Component, Input, Output, EventEmitter, OnInit, OnChanges } from '@angular/core';

@Component({
  selector: 'footer-buttons',
  templateUrl: 'footer-buttons.html'
})
export class FooterButtonsComponent implements OnChanges {

  text: string;
  @Input() data;
  @Input() isFirst: boolean;
  @Input() isLast: boolean;
  @Output() nextAction = new EventEmitter();
  @Output() backAction = new EventEmitter();
  @Input() completedQuestionCount = 0 ;
  @Input() questionCount  = 0 ;
  percentage: number = 0;
  
  constructor() {
  
  }
  ngOnChanges(){
    if(this.completedQuestionCount > 0){
  this.percentage = this.questionCount ? (this.completedQuestionCount/this.questionCount)*100 : 0;
  this.percentage = Math.trunc(this.percentage)
    }
    else{
      this.percentage = 0
    }
}
  next(status?: string): void {
    this.nextAction.emit(status);
  }

  back(): void {
    this.backAction.emit();
  }

}
