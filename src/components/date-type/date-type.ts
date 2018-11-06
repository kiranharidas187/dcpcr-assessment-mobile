import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'date-type',
  templateUrl: 'date-type.html'
})
export class DateTypeComponent implements OnInit{
  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() schoolId: string;

  @Input() hideButton: boolean;
  questionValid: boolean;

  constructor(private utils: UtilsProvider) {
    console.log('Hello DateTypeComponent Component');
  }

  next(status?: string) {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.previousCallBack.emit('previous');
  }

  canceled() {
    console.log('cancelled')
  }

  ngOnInit() {
    this.checkForValidation();
  }

  checkForValidation(): void {
    console.log(JSON.stringify(this.data))
    this.questionValid = this.utils.isQuestionComplete(this.data);
  }
}
