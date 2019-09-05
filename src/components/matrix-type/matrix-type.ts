import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { ModalController, AlertController } from 'ionic-angular';
import { MatrixActionModalPage } from '../../pages/matrix-action-modal/matrix-action-modal';
import { UtilsProvider } from '../../providers/utils/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'matrix-type',
  templateUrl: 'matrix-type.html'
})
export class MatrixTypeComponent implements OnInit {

  @Input() data: any;
  @Input() isLast: boolean;
  @Input() isFirst: boolean;
  @Output() nextCallBack = new EventEmitter();
  @Output() previousCallBack = new EventEmitter();
  @Output() updateLocalData = new EventEmitter();
  @Input() evidenceId: string;
  @Input() schoolId: string;
  @Input() imageLocalCopyId: string;
  @Input() generalQuestion: boolean;
  @Input() submissionId: string;
  @Input() inputIndex;
  mainInstance: any;

  constructor(private modalCntrl: ModalController,
    private translate: TranslateService,
    private utils: UtilsProvider, private alertCtrl: AlertController) {
    console.log('Hello MatrixTypeComponent Component');

  }

  ngOnInit() {
    this.data.startTime = this.data.startTime ? this.data.startTime : Date.now();
  }

  next(status?: any) {
    this.data.isCompleted = this.utils.isMatrixQuestionComplete(this.data);
    this.nextCallBack.emit(status);
  }

  back() {
    this.data.isCompleted = this.utils.isMatrixQuestionComplete(this.data);
    this.previousCallBack.emit('previous');
  }

  addInstances(): void {
    this.data.value = this.data.value ? this.data.value : [];
    this.data.value.push(JSON.parse(JSON.stringify(this.data.instanceQuestions)));
    this.checkForValidation();
  }

  viewInstance(i): void {
    console.log("open modal");
    const obj = {
      selectedIndex: i,
      data: JSON.parse(JSON.stringify(this.data)),
      evidenceId: this.evidenceId,
      schoolId: this.schoolId,
      generalQuestion: this.generalQuestion,
      submissionId: this.submissionId,
      questionIndex: this.inputIndex
    }
    let matrixModal = this.modalCntrl.create(MatrixActionModalPage, obj);
    matrixModal.onDidDismiss(instanceValue => {
      if (instanceValue) {
        this.data.completedInstance = this.data.completedInstance ? this.data.completedInstance : [];
        this.data.value[i] = instanceValue;
        console.log("saved isntance" + JSON.stringify(instanceValue));
        let instanceCompletion = this.checkCompletionOfInstance(this.data.value[i]);
        if (instanceCompletion) {
          if (this.data.completedInstance.indexOf(i) < 0) {
            this.data.completedInstance.push(i);
          }
        } else {
          const index = this.data.completedInstance.indexOf(i);
          if (index >= 0) {
            this.data.completedInstance.splice(index, 1);
          }
        }
        this.checkForValidation();
      }
    })
    matrixModal.present();
  }

  checkCompletionOfInstance(data): boolean {
    let isCompleted = true;
    for (const question of data) {
      // question.isCompleted = this.utils.isQuestionComplete(question);
      if (!question.isCompleted) {
        isCompleted = false;
        return false
      }
    }
    return isCompleted

  }

  deleteInstance(instanceIndex): void {
    this.data.value.splice(instanceIndex, 1);
    // let instanceCompletion = this.checkCompletionOfInstance(this.data.value[instanceIndex]);
    // if(instanceCompletion) {
    if (this.data.completedInstance && this.data.completedInstance.length && this.data.completedInstance.indexOf(instanceIndex) >= 0) {
      this.data.completedInstance.splice(instanceIndex, 1);
    }
    this.checkForValidation();

    // }
  }

  checkForValidation(): void {
    console.log("innn");
    this.data.isCompleted = this.utils.isMatrixQuestionComplete(this.data);
    this.data.endTime = this.data.isCompleted ? Date.now() : "";

    this.updateLocalData.emit();
    console.log(this.data.isCompleted)
  }


  deleteInstanceAlert(index) {
    let translateObject;
    this.translate.get(['actionSheet.confirmDelete', 'actionSheet.confirmDeleteInstance', 'actionSheet.no', 'actionSheet.yes']).subscribe(translations => {
      translateObject = translations;
      console.log(JSON.stringify(translations))
    })
    let alert = this.alertCtrl.create({
      title: translateObject['actionSheet.confirmDelete'],
      message: translateObject['actionSheet.confirmDeleteInstance'],
      buttons: [
        {
          text: translateObject['actionSheet.no'],
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: translateObject['actionSheet.yes'],
          handler: () => {
            this.deleteInstance(index);
          }
        }
      ]
    });
    alert.present();
  }

  getLastModified(instance) {
    let lastModifiedAt = 0;
    for (const question of instance) {
      if (question.startTime > lastModifiedAt) {
        lastModifiedAt = question.startTime;
      }
    }
    return lastModifiedAt
  }
}