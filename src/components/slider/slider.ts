import { Component, Input, EventEmitter, Output } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'slider',
  templateUrl: 'slider.html'
})
export class SliderComponent {

  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() hideButton: boolean;
  @Input() schoolId: string;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;
  @Input() submissionId: any;
  @Input() inputIndex ;
  color: string = 'light';
  isComplete: boolean;

  constructor(private utils: UtilsProvider) {

    console.log('Hello SliderComponent Component');

  }

  ngOnInit() {
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
    this.data.value = this.data.value !== "" ? this.data.value : this.data.validation.min;
    this.checkForValidation();
  }

  checkForValidation(): void {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.data.endTime = this.data.isCompleted ? Date.now() : "";
  }

}
