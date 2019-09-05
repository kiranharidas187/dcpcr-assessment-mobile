import { Component, Input, Output , EventEmitter, OnInit} from '@angular/core';
import { UtilsProvider } from '../../providers/utils/utils';
import { HintProvider } from '../../providers/hint/hint';

/**
 * Generated class for the RadioTypeComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'radio-type',
  templateUrl: 'radio-type.html'
})
export class RadioTypeComponent implements OnInit{
  @Input() inputIndex ;
  @Input() data:any;
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

  color: string = 'light';
  isComplete: boolean;

  constructor(private utils: UtilsProvider, private hintService: HintProvider) {

    console.log('Hello RadioTypeComponent Component');

  }

  ngOnInit() {
    // console.log(JSON.stringify(this.data))
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
    console.log("Evidence id"+ this.evidenceId)
    

  }

  updateData(event){
    console.log(JSON.stringify(this.data));
    // this.data ={}
    // this.data = Object.assign({}, this.data)
    this.data.fileName = [...this.data.fileName]
  }
  next(status?:any) {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.previousCallBack.emit();
  }

  checkForValidation(): void {
    this.data.isCompleted = this.utils.isQuestionComplete(this.data);
    this.data.endTime = this.data.isCompleted ? Date.now() : "";
  }

  openHint(hint){
    this.hintService.presentHintModal({hint: hint});
  }
}
