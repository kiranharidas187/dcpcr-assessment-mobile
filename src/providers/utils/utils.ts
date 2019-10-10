import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoadingController } from 'ionic-angular';
import { ToastController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { AlertController } from 'ionic-angular';
// import { ApiProvider } from '../api/api';
// import { AppConfigs } from '../appConfig';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser';
 
@Injectable()
export class UtilsProvider {

  constructor(public http: HttpClient,
    private locationAccuracy: LocationAccuracy,
    public loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private localStorage: LocalStorageProvider,
    private iab: InAppBrowser) {
    console.log('Hello UtilsProvider Provider');
  }
  loading: any;
  imagePath: string;
  currentAssessmentType: string = "";

  startLoader(msg: string = 'Please wait..') {
    this.loading = this.loadingCtrl.create({
      content: msg
    });
    this.loading.present();
  }

  stopLoader() {
    this.loading.dismiss();
  }

  openToast(msg, closeBtn?: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: closeBtn ? 0 : 3000,
      position: 'bottom',
      closeButtonText: closeBtn,
      showCloseButton: closeBtn ? true : false
    });

    toast.onDidDismiss(() => {
      // console.log('Dismissed toast');
    });

    toast.present();
  }

  setLocalSchoolData(data) {
    this.storage.set('schoolsDetails', JSON.stringify(data));
  }

  setCurrentimageFolderName(evidenceId, schoolId) {
    this.imagePath = 'images_' + evidenceId + '_' + schoolId;
    console.log("Image path: " + this.imagePath)
  }

  setLocalImages(images, isGeneralQuestion) {
    this.storage.set(isGeneralQuestion ? 'genericQuestionsImages' : 'allImageList', JSON.stringify(images));
  }

  setLocalVariable(key, value) {
    this.storage.set(key, value);
  }

  testRegex(rege, value): boolean {
    const regex = new RegExp(rege);
    return regex.test(value)
  }

  isQuestionComplete(question): boolean {
    // console.log(JSON.stringify(question))
    if (question.validation.required && question.value === "" && question.responseType !== 'multiselect') {
      return false
    }
    if (question.validation.required && question.value && !question.value.length && question.responseType === 'multiselect') {
      return false
    }
    // if (question.file.required && (question.fileName.length < question.file.minCount)) {
    //   return false
    // }
    if (question.validation.regex && (question.responseType === 'number' || question.responseType === 'text') && !this.testRegex(question.validation.regex, question.value)) {
      return false
    }

    return true
  }

  isMatrixQuestionComplete(question): boolean {
    if (!question.value.length) {
      return false
    }
    // const noOfInstanceRequired = question.noOfInstances ? question.noOfInstances : 0;
    // if(question.ins)
    // if(noOfInstanceRequired && (question.value.length < noOfInstanceRequired)){
    //   return false
    // }
    for (const instance of question.value) {
      for (const question of instance) {
        if (!question.isCompleted) {
          return false
        }
      }
    }
    return true
  }
  isPageQuestionComplete(question){
    for (const element of question.pageQuestions) {

      console.log(element.responseType)
      if(element.responseType.toLowerCase() === 'matrix'){
        if(!this.isMatrixQuestionComplete(element)){
          return  false;
         }
      }else if(!element.isCompleted){
       return  false;
      }
    }
    return true;
  }
  enableGPSRequest() {
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
          () => {
            return true;
          },
          error => {
            console.log('Error requesting location permissions', error);
            this.enableGPSRequest()
          }
        );
      }

    });
  }

  createFormGroup(formFields): any {
    console.log(JSON.stringify(formFields));
    let formGrp = {};
    formFields.forEach(formfield => {
      formGrp[formfield.field] = formfield.validation.required ? new FormControl(formfield.value || "", Validators.required) : new FormControl(formfield.value || "");
    });
    return new FormGroup(formGrp)
  }

  checkForDependentVisibility(qst, allQuestion): boolean {
    let display = true;
    for (const question of allQuestion) {
      for (const condition of qst.visibleIf) {
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
            return false
          }
        }
      }
    }
    return display
  }

  ActionEnableSubmit(actionDetails) {
    let currentEcm;
    this.localStorage.getLocalStorage(this.getAssessmentLocalStorageKey(actionDetails.schoolId)).then(data => {
      const currentSchoolData = data;
      for (const evidenc of currentSchoolData.assessments[0].evidences) {
        if (evidenc.externalId === actionDetails.evidenceCollectionMethod) {
          currentEcm = evidenc;
          break;
        }
      }
      if (actionDetails.action[0] === 'enableSubmission') {
        currentEcm['enableSubmit'] = true;
      }
      this.localStorage.setLocalStorage(this.getAssessmentLocalStorageKey(actionDetails.schoolId), currentSchoolData);
      this.openToast(actionDetails.successMessage);
    }).catch(error => {
    })
  }

  setAssessmentLocalStorageKey(baseKey) {
    // this.currentAssessmentType = baseKey;
  }

  getAssessmentLocalStorageKey(entityId) {
    // return this.currentAssessmentType ? this.currentAssessmentType + schoolId : "schoolDetails_" + schoolId
    return 'assessmentDetails_' + entityId
  }

  getCompletedQuestionsCount(questions) {
    let count = 0;
    for (const question of questions) {
      if (question.isCompleted) {
        count++;
      }
    }
    return count
  }

  openExternalLinkOnBrowser(link) {
    const options: InAppBrowserOptions = {
      hidenavigationbuttons: 'yes',
      // hideurlbar: 'yes',
      closebuttoncolor: '#ffffff',
      toolbarcolor: "#a63936"
    };
    this.iab.create(link, "_system", options)
  }

  getFileExtensions(url) {
    let splittedString = url.split('.');
    let splittedStringForName = url.split('/')
    const obj = {
      type: splittedString[splittedString.length - 1],
      name: splittedStringForName[splittedStringForName.length - 1]
    }
    return obj
  }

  getImageNamesForQuestion(question) {
    let imageArray = [];
    if (question.responseType === 'matrix') {
      for (const instance of question.value) {
        for (const qst of instance) {
          const newArray = qst.fileName.length ? imageArray.concat(qst.fileName) : imageArray
          imageArray = newArray
        }
      }
    } else {
      // imageArray = [...imageArray, question.fileName]
      const newArray = question.fileName.length ? imageArray.concat(question.fileName) : imageArray;
      imageArray = newArray

    }
    return imageArray
  }

  


}

