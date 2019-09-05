import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';


@Component({
  selector: 'page-matrix-action-modal',
  templateUrl: 'matrix-action-modal.html',
})
export class MatrixActionModalPage {
  inputIndex : any;
  instanceDetails: any;
  selectedIndex: any;
  data: any;
  schoolId: string;
  evidenceId: string;
  generalQuestion: boolean;
  submissionId: string;

  constructor(public navCtrl: NavController, private utils: UtilsProvider,
    public navParams: NavParams, private viewCntrl: ViewController) {
    this.selectedIndex = navParams.data.selectedIndex;
    this.data = navParams.data.data;
    this.schoolId = navParams.data.schoolId;
    this.evidenceId = navParams.data.evidenceId;
    this.generalQuestion = navParams.data.generalQuestion;
    this.submissionId = navParams.data.submissionId;
    this.inputIndex = navParams.data.questionIndex;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MatrixActionModalPage');
  }

  update(): void {
    for (const question of this.data.value[this.selectedIndex]) {
      // Do check only for questions without visibleif. For visibleIf questions isCompleted property is set in  checkForVisibility()
      if (!question.visibleIf) {
        question.isCompleted = this.utils.isQuestionComplete(question);
      }
    }
    const instanceValue = JSON.parse(JSON.stringify(this.data.value[this.selectedIndex]))
    this.viewCntrl.dismiss(instanceValue)
  }

  cancel(): void {
    this.viewCntrl.dismiss();
  }

  checkForVisibility(currentQuestionIndex) {
    let visibility = false;
    const currentQuestion = this.data.value[this.selectedIndex][currentQuestionIndex];
    // if (currentQuestion.visibleIf && currentQuestion.visibleIf.length) {
    //   this.data.value[this.selectedIndex].forEach((question) => {
    //     const evaluatedCondition = eval('"' + question.value + '"' + currentQuestion.visibleIf[0].operator + '"' + currentQuestion.visibleIf[0].value + '"');
    //     console.log(evaluatedCondition + " questin id " + question._id + " currentQuetion id " +  currentQuestion.visibleIf[0]._id )
    //     if (question._id === currentQuestion.visibleIf[0]._id && evaluatedCondition) {
    //       console.log(currentQuestion.question[0])
    //       visibility = true;
    //       this.data.value[this.selectedIndex][currentQuestionIndex].isCompleted = this.utils.isQuestionComplete(currentQuestion);
    //     } 
    //     else  if(question._id === currentQuestion.visibleIf[0]._id && !evaluatedCondition){
    //       console.log("newwww " + question._id )
    //       this.data.value[this.selectedIndex][currentQuestionIndex].isCompleted = true;
    //     }
    //   });
    //   return visibility
    // } else {
    //   return true
    // }


    let display = true;
    for (const question of this.data.value[this.selectedIndex]) {
      for (const condition of currentQuestion.visibleIf) {
        if (condition._id === question._id) {
          let expression = [];
          if (condition.operator != "===") {
            if (question.responseType === 'multiselect') {
              for (const parentValue of question.value) {
                for (const value of condition.value) {
                  expression.push("(", "'" + parentValue + "'", "===", "'" + value + "'", ")", condition.operator);
                }
              }
            } else {
              for (const value of condition.value) {
                expression.push("(", "'" + question.value + "'", "===", "'" + value + "'", ")", condition.operator)
              }
            }
            expression.pop();
          } else {
            if (question.responseType === 'multiselect') {
              for (const value of question.value) {
                expression.push("(", "'" + condition.value + "'", "===", "'" + value + "'", ")", "||");
              }
              expression.pop();
            } else {
              expression.push("(", "'" + question.value + "'", condition.operator, "'" + condition.value + "'", ")")
            }
          }
          if (!eval(expression.join(''))) {
            this.data.value[this.selectedIndex][currentQuestionIndex].isCompleted = true;
            return false
          } else {
            this.data.value[this.selectedIndex][currentQuestionIndex].isCompleted = this.utils.isQuestionComplete(currentQuestion);
          }
        }
      }
    }
    return display
  }

  checkForDependentVisibility(qst, allQuestion): boolean {
    let display = true;
    for (const question of allQuestion) {
      for (const condition of qst.visibleIf) {
        if (condition._id === question._id) {
          let expression = [];
          if (condition.operator != "===") {
            // for (const value of condition.value) {
            //   expression.push("(","'"+question.value+"'", "===", "'"+value+"'" ,")", condition.operator)
            // }
            if (question.responseType === 'multiselect') {
              for (const parentValue of question.value) {
                for (const value of condition.value) {
                  expression.push("(", "'" + parentValue + "'", "===", "'" + value + "'", ")", condition.operator);
                }
              }
            } else {
              for (const value of condition.value) {
                expression.push("(", "'" + question.value + "'", "===", "'" + value + "'", ")", condition.operator)
              }
            }
            expression.pop();
          } else {
            if (question.responseType === 'multiselect') {
              for (const value of question.value) {
                expression.push("(", "'" + condition.value + "'", "===", "'" + value + "'", ")", "||");
              }
              expression.pop();
            } else {
              expression.push("(", "'" + question.value + "'", condition.operator, "'" + condition.value + "'", ")")
            }
          }
          if (!eval(expression.join(''))) {
            return false
          }
        }
      }
    }
    return display
  }

  // checkForDependentVisibility(qst): boolean {
  //   let display = true;
  //   for (const question of this.questions) {
  //     for (const condition of qst.visibleIf) {
  //       if (condition._id === question._id) {
  //         let expression = "";
  //         if(condition.operator != "==="){
  //           for (const value of condition.value) {
  //             expression = expression + condition.operator + value
  //           }
  //           expression = expression.substring(1, expression.length-1)
  //         }
  //         if(!eval(expression)){
  //           return false
  //         }
  //         // if (condition.operator === "||") {
  //         //   for (const value of condition.value) {
  //         //     if(question.value.includes(value)) {
  //         //       return true
  //         //     } else {
  //         //       display = false;
  //         //     }
  //         //   }
  //         //   return display
  //         // } else {
  //         //   for (const value of question.value) {
  //         //     if ((eval('"' + value + '"' + condition.operator + '"' + condition.value + '"'))) {
  //         //       return true
  //         //     } else {
  //         //       display = false;
  //         //     }
  //         //   }
  //         //   return display
  //         // }
  //       }
  //     }
  //   }
  //   return display
  // }

}
