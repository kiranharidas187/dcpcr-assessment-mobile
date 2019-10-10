import { Component } from '@angular/core';
import { NavController, NavParams, App, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { AppConfigs } from '../../providers/appConfig';
import { Storage } from '@ionic/storage';
import { SlackProvider } from '../../providers/slack/slack';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { TranslateService } from '@ngx-translate/core';

declare var cordova: any;

@Component({
  selector: 'page-general-question-submit',
  templateUrl: 'general-question-submit.html',
})
export class GeneralQuestionSubmitPage {
  tempPayload = [];
  tempIndex: number = 0;
  uploadImages: any;
  imageList = [];
  appFolderPath: string = this.platform.is('ios') ? cordova.file.documentsDirectory + 'images' : cordova.file.externalDataDirectory + 'images';
  // schoolId: any;
  schoolName: string
  selectedEvidenceIndex: any;
  uploadIndex: number = 0;
  schoolData: any;
  evidenceSections: any;
  selectedEvidenceName: any;
  imageLocalCopyId: any;
  submissionId: any;
  generalQuestions: any;
  allGeneralQuestions: any;
  copyOfOriginalGeneralQuestions: any;
  retryCount: number = 0;
  page = "General questions submission page"
  errorObj = {
    "fallback": "User Details",
    "title": `Error Details`,
    "text": ``
  }
  failedUploadImageNames = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private file: File,
    private translate:TranslateService,
    private fileTransfer: FileTransfer,
    private apiService: ApiProvider,
    private utils: UtilsProvider,
    private localStorage: LocalStorageProvider,
    private platform: Platform,
    private slack: SlackProvider) {
    this.submissionId = this.navParams.get('_id');

  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.submissionId)).then(success => {
      // this.submissionId = success['assessment']['submissionId'];
      this.localStorage.getLocalStorage('generalQuestions_' + this.submissionId).then(data => {
        this.allGeneralQuestions = data;
        this.generalQuestions = this.allGeneralQuestions;
        this.localStorage.getLocalStorage("genericQuestionsImages").then(data => {
          if (data && data[this.submissionId]) {
            this.uploadImages = data[this.submissionId] ? data[this.submissionId] : [];
          } else {
            this.uploadImages = [];
          }
          if (this.uploadImages.length) {
            this.createImageFromName(this.uploadImages);
          } else {
            this.tempSubmit();
          }
        }).catch(error => {

          this.tempSubmit();
        })
      }).catch(error => {
      })
    }).catch(error => {
    })
    this.localStorage.getLocalStorage('generalQuestionsCopy_' + this.submissionId).then(data => {
      this.copyOfOriginalGeneralQuestions = data;
    }).catch(error => {
    })
  }

  createImageFromName(imageList) {
    this.utils.startLoader();
    for (const image of imageList) {
      this.imageList.push({ uploaded: false, file: image.name, url: "" });
    }
    this.getImageUploadUrls();
  }

  getImageUploadUrls() {
    const files = {
      "files": [],
      submissionId: this.submissionId
    }
    for (const image of this.uploadImages) {
      files.files.push(image.name)
    }
    this.apiService.httpPost(AppConfigs.survey.getImageUploadUr, files, success => {
      this.utils.stopLoader();
      for (let i = 0; i < success.result.length; i++) {
        this.imageList[i]['url'] = success.result[i].url;
        this.imageList[i]['sourcePath'] = success.result[i].payload.sourcePath;
      }
      this.checkForLocalFolder();

    }, error => {
      this.utils.stopLoader();
      this.translate.get('toastMessage.enableToGetGoogleUrls').subscribe(translations =>{
        this.utils.openToast(translations);
      })
     
    })
  }

  checkForLocalFolder() {
    if (this.platform.is('ios')) {
      this.file.checkDir(this.file.documentsDirectory, 'images').then(success => {
        this.fileTransfer.create()
        this.cloudImageUpload();
      }).catch(err => {

      });
    } else {
      this.file.checkDir(this.file.externalDataDirectory, 'images').then(success => {
        this.cloudImageUpload();
        this.fileTransfer.create()
      }).catch(err => {

      });
    }
  }

  cloudImageUpload() {
    var options: FileUploadOptions = {
      fileKey: this.imageList[this.uploadIndex].file,
      fileName: this.imageList[this.uploadIndex].file,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {
        "Content-Type": 'multipart/form-data'
      },
      httpMethod: 'PUT',
    };
    let targetPath = this.pathForImage(this.imageList[this.uploadIndex].file);
    let fileTrns: FileTransferObject = this.fileTransfer.create();
    this.file.checkFile((this.platform.is('ios') ? this.file.documentsDirectory : this.file.externalDataDirectory) + 'images/', this.imageList[this.uploadIndex].file).then(success => {
      fileTrns.upload(targetPath, this.imageList[this.uploadIndex].url, options).then(result => {
        this.retryCount = 0;
        this.imageList[this.uploadIndex].uploaded = true;
        if (this.uploadIndex < (this.imageList.length - 1)) {
          this.uploadIndex++;
          this.cloudImageUpload();
        } else {
          this.tempSubmit()
        }
      }).catch(err => {
        const errorObject = { ... this.errorObj };
        this.retryCount++;
        if (this.retryCount > 3) {
          this.translate.get('toastMessage.someThingWentWrongTryLater').subscribe(translations =>{
            this.utils.openToast(translations);
          })
          errorObject.text = `${this.page}: Cloud image upload failed.URL:  ${this.imageList[this.uploadIndex].url}.
          Details: ${JSON.stringify(err)}`;
          this.slack.pushException(errorObject);
          this.navCtrl.pop();
        } else {
          this.cloudImageUpload();
        }
      })
    }).catch(error => {
      this.failedUploadImageNames.push(this.imageList[this.uploadIndex].file)
      if (this.uploadIndex < (this.imageList.length - 1)) {
        this.uploadIndex++;
        this.cloudImageUpload();

      } else {
        this.tempSubmit();
      }
    });

  }

  pathForImage(img) {
    if (img === null) {
      return '';
    } else {
      const path = this.platform.is('ios') ? cordova.file.documentsDirectory : cordova.file.externalDataDirectory
      return path + 'images/' + img;
    }
  }

  submitEvidence() {
    this.utils.startLoader('Please wait while submitting')
    const payload = this.constructPayload();
    const url = AppConfigs.survey.submitGeneralQuestions + this.submissionId;
    this.apiService.httpPost(url, payload, response => {
      this.utils.openToast(response.message);
      this.allGeneralQuestions = JSON.parse(JSON.stringify(this.copyOfOriginalGeneralQuestions))
      this.localStorage.setLocalStorage('generalQuestions_' + this.submissionId, this.allGeneralQuestions)
      this.storage.remove('genericQuestionsImages');
      this.utils.stopLoader();
      this.navCtrl.pop();
    }, error => {
      this.utils.stopLoader();
      this.navCtrl.pop();

    })

  }

  makeApiCall(payload) {
    const url = AppConfigs.survey.submitGeneralQuestions + this.submissionId;
    this.apiService.httpPost(url, payload, response => {
      this.allGeneralQuestions = JSON.parse(JSON.stringify(this.copyOfOriginalGeneralQuestions))
      if (this.tempIndex < (this.tempPayload.length - 1)) {
        this.tempIndex = this.tempIndex + 1;
        this.makeApiCall(this.tempPayload[this.tempIndex])
      } else {
        this.localStorage.setLocalStorage('generalQuestions_' + this.submissionId, this.allGeneralQuestions);
        this.storage.remove('genericQuestionsImages');
        this.utils.stopLoader();
        this.utils.openToast(response.message);

        this.navCtrl.pop();
      }

    }, error => {
      this.utils.stopLoader();
      this.navCtrl.pop();

    })
  }

  tempSubmit() {
    this.utils.startLoader('Please wait while submitting')

    for (const question of this.generalQuestions) {
      if (question.isCompleted) {
        this.tempPayload.push(this.constructTempPayload(question))
      }
    }
    this.makeApiCall(this.tempPayload[this.tempIndex])

  }

  constructTempPayload(question) {
    const payload = {
      'answers': {}
    }
    payload.answers[question._id] = {
      "qid": question._id,
      "value": question.responseType === 'matrix' ? this.constructMatrixObject(question) : question.value,
      "remarks": question.remarks,
      "fileName": [
      ],
      "payload": {
        question: question.question,
        labels: [],
        responseType: question.responseType
      },
      "startTime": question.startTime,
      "endTime": question.endTime,
      "countOfInstances": question.responseType === 'matrix' ? question.value.length : 1,
    };
    for (const key of Object.keys(question.payload)) {
      payload.answers[question._id][key] = question.payload[key];
    }

    if (question.fileName && question.fileName.length) {
      const filePaylaod = []
      for (const fileName of question.fileName) {
        for (const updatedFileDetails of this.imageList) {
          if (fileName === updatedFileDetails.file) {
            const obj = {
              name: fileName,
              sourcePath: updatedFileDetails.sourcePath
            }
            filePaylaod.push(obj);
          }
        }
      }
      payload.answers[question._id].fileName = filePaylaod;
    }

    if (question.responseType === 'multiselect') {
      for (const val of question.value) {
        for (const option of question.options) {
          if (val === option.value && payload.answers[question._id].payload.labels.indexOf(option.label) <= 0) {
            payload.answers[question._id].payload.labels.push(option.label);
          }
        }
      }

    } else if (question.responseType === 'radio') {

      for (const option of question.options) {
        if (payload.answers[question._id].value === option.value && payload.answers[question._id].payload.labels.indexOf(option.label) <= 0) {
          payload.answers[question._id].payload.labels.push(option.label);
        }
      }

    } else {
      payload.answers[question._id].payload.labels.push(question.value);
    }

    return payload
  }

  constructPayload(): any {
    const payload = {
      'answers': {}
    }
    for (const question of this.generalQuestions) {
      if (question.isCompleted) {
        payload.answers[question._id] = {
          "qid": question._id,
          "value": question.responseType === 'matrix' ? this.constructMatrixObject(question) : question.value,
          "remarks": question.remarks,
          "fileName": [
          ],
          "payload": {
            question: question.question,
            labels: [],
            responseType: question.responseType
          },
          "startTime": question.startTime,
          "endTime": question.endTime,
          "countOfInstances": question.responseType === 'matrix' ? question.value.length : 1,
        };
        for (const key of Object.keys(question.payload)) {
          payload.answers[question._id][key] = question.payload[key];
        }

        if (question.fileName && question.fileName.length) {
          const filePaylaod = []
          for (const fileName of question.fileName) {
            for (const updatedFileDetails of this.imageList) {
              if (fileName === updatedFileDetails.file) {
                const obj = {
                  name: fileName,
                  sourcePath: updatedFileDetails.sourcePath
                }
                filePaylaod.push(obj);
              }
            }
          }
          payload.answers[question._id].fileName = filePaylaod;
        }

        if (question.responseType === 'multiselect') {
          for (const val of question.value) {
            for (const option of question.options) {
              if (val === option.value && payload.answers[question._id].payload.labels.indexOf(option.label) <= 0) {
                payload.answers[question._id].payload.labels.push(option.label);
              }
            }
          }

        } else if (question.responseType === 'radio') {

          for (const option of question.options) {
            if (payload.answers[question._id].value === option.value && payload.answers[question._id].payload.labels.indexOf(option.label) <= 0) {
              payload.answers[question._id].payload.labels.push(option.label);
            }
          }

        } else {
          payload.answers[question._id].payload.labels.push(question.value);
        }
      }

    }
    return payload
  }

  constructMatrixObject(question) {
    const value = [];
    for (const instance of question.value) {
      let eachInstance = {};
      for (let qst of instance) {

        const obj1 = {
          qid: qst._id,
          value: qst.value,
          remarks: qst.remarks,
          fileName: [],
          payload: {
            question: qst.question,
            labels: [],
            responseType: qst.responseType
          },
          startTime: qst.startTime,
          endTime: qst.endTime
        }
        if (qst.fileName && qst.fileName.length) {
          const filePaylaod = []
          for (const fileName of qst.fileName) {
            for (const updatedFileDetails of this.imageList) {
              if (fileName === updatedFileDetails.file) {
                const fileobj = {
                  name: fileName,
                  sourcePath: updatedFileDetails.sourcePath
                }
                filePaylaod.push(fileobj);
              }
            }
          }
          obj1.fileName = filePaylaod;
        }
        if (qst.responseType === 'multiselect') {
          for (const val of qst.value) {
            for (const option of qst.options) {
              if (val === option.value && obj1.payload.labels.indexOf(option.label) <= 0) {
                obj1.payload.labels.push(option.label);
              }
            }
          }

        } else if (qst.responseType === 'radio') {
          for (const option of qst.options) {
            if (obj1.value === option.value && obj1.payload.labels.indexOf(option.label) <= 0) {
              obj1.payload.labels.push(option.label);
            }
          }
        } else {
          obj1.payload.labels.push(qst.value);
        }

        for (const key of Object.keys(qst.payload)) {
          obj1[key] = qst.payload[key];
        }
        eachInstance[obj1.qid] = obj1;
      }
      value.push(eachInstance)
    }
    return value
  }

}
