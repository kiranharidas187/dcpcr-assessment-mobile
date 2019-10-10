import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the PageQuestionComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'page-question',
  templateUrl: 'page-question.html'
})
// export class PageQuestionComponent {
  export class PageQuestionComponent implements OnInit  {
  @Input() inputIndex ;
  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() updateLocalData = new EventEmitter();
  @Output() previousCallBack = new EventEmitter()
  @Input() evidenceId: string;
  @Input() hideButton: boolean;
  @Input() submissionId: any;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;
  @Input() schoolId;
  notNumber: boolean;
  questionValid: boolean;
  text: string;

  constructor(private utils : UtilsProvider) {
    console.log('Hello PageQuestionComponent Component');
    this.text = 'Hello World';
  }
  ngOnInit() {
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
  }

  // ngOnDestroy(){}
  // ngOnChanges(changes: SimpleChanges) {
  //   for (let propName in changes) {
  //     let chng = changes[propName];
  //     let cur  = JSON.stringify(chng.currentValue);
  //     let prev = JSON.stringify(chng.previousValue);
  //      console.log("NG ON DESTORY")
  //         this.data.isCompleted = this.utils.isPageQuestionComplete(this.data);
  //         // this.data.isCompleted = true;
  //         // this.data.pageQuestions.array.forEach(element => {
  //         //   if(!element.isCompleted){
  //         //     this.data.isCompleted = false;
  //         //   }
  //         // }); this.utils.isQuestionComplete(this.data.pageQuestions)
  //   }
  // }
  // ngOnInit() {
  //   console.log("hello");
  //   // this.isaNumber();
  //   this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
  //   // this.getErrorMsg();
  //   // this.checkForValidation();
  //   console.log(JSON.stringify(this.data))
  // }
  updateLocalDataInPageQuestion(): void {
    this.updateLocalData.emit();
  }

}
