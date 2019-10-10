import { Component } from '@angular/core';
import { NavController, NavParams, Events, Config, AlertController } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
import { ObservationServiceProvider } from '../../providers/observation-service/observation-service';
import { DownloadAndPreviewProvider } from '../../providers/download-and-preview/download-and-preview';
import { TranslateService } from '@ngx-translate/core';
import { ObservationReportsPage } from '../observation-reports/observation-reports';

/**
 * Generated class for the SubmissionListPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-submission-list',
  templateUrl: 'submission-list.html',
})
export class SubmissionListPage {
  observationDetails: any[];
  programs: any;
  enableCompleteBtn: any;
  selectedObservationIndex: any;
  entityIndex: any;
  observationIndex: any;
  submissionList: any;
  recentlyUpdatedEntity :any;
  assessmentDetails: any;
  // firstLoad = true;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private apiProvider: ApiProvider,
    private localStorage: LocalStorageProvider,
    private evdnsServ: EvidenceProvider,
    private utils: UtilsProvider,
    private events: Events,
    private alertCntrl: AlertController,
    private dap: DownloadAndPreviewProvider,
    private translate: TranslateService,
    private observationService: ObservationServiceProvider,
    private assessmentService: AssessmentServiceProvider
  ) {
    this.events.subscribe('updateSubmissionStatus', refresh => {
      // this.utils.startLoader();
      this.observationService.refreshObservationList(this.programs).then(success => {
        this.programs = success;
        this.observationDetails[0] = success[this.selectedObservationIndex];
        this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
        this.goToEcm(this.submissionList.length)
        // this.utils.stopLoader();

      }).catch(error => {
        // this.utils.stopLoader();
      })
    })
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SubmissionListPage');
    // this.selectedObservationIndex = this.navParams.get('selectedObservationIndex');
    // this.entityIndex = this.navParams.get('entityIndex');
    // this.observationIndex = this.navParams.get('observationIndex');
    // this.getLocalStorageData();
    // this.firstLoad = false;
  }

  ionViewDidEnter() {
    // if(this.firstLoad === false)
    // this.observationService.refreshObservationList(this.programs).then(success=>{
    //   tionViewDidEnterhis.programs = success ;
    //   this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
    // }).catch();
    this.selectedObservationIndex = this.navParams.get('selectedObservationIndex');
    this.recentlyUpdatedEntity =  this.navParams.get('recentlyUpdatedEntity');
    this.entityIndex = this.navParams.get('entityIndex');
    this.observationIndex = this.navParams.get('observationIndex');
    this.getLocalStorageData();
    // this.firstLoad = false;
  }
  getLocalStorageData() {
    this.observationDetails = [];
    console.log("Getting data from local storage ")
    this.utils.startLoader();
    this.localStorage.getLocalStorage('createdObservationList').then(data => {
      this.programs = data;
      console.log(this.selectedObservationIndex + "" + this.entityIndex + "" + this.observationIndex)
      this.observationDetails.push(data[this.selectedObservationIndex]);
      // console.log(JSON.stringify(this.observationDetails[0]))

      this.submissionList = this.observationDetails[0].entities[this.entityIndex].submissions;
      console.log(JSON.stringify(this.submissionList))

      this.utils.stopLoader();

    }).catch(error => {
    this.utils.stopLoader();

    })
  }
  getAssessmentDetails(index, submissionNum = null) {
    let submissionNumber = submissionNum ? submissionNum : this.submissionList[index].submissionNumber
    console.log("get assessment function called");
    // this.apiProvider.httpGet(AppConfigs.cro.observationDetails + this.programs[this.selectedObservationIndex]._id + "?entityId=" + this.programs[this.selectedObservationIndex].entities[this.entityIndex]._id + "&submissionNumber=" + submissionNumber, success => {
    //   this.assessmentDetails = success;
    //  if( submissionNum ){ 
    //    this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions.push({"submissionId" : success.result.assessment.submissionId}) 
    //  }else {
    //       this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index].submissionId = success.result.assessment.submissionId;
    //  }
    //   console.log(this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index].submissionId)
    //   this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index].submissionId), success.result)
    //   submissionNum ? null : this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index].downloaded = true;
    //   this.localStorage.setLocalStorage('createdObservationList', this.programs);
    //   submissionNum ? null : this.submissionList[index].downloaded = true;
    //   // this.events.publish('refreshObservationList');
    //   this.goToEcm(index);
    // }, error => {

    // });
    let event = {
      entityIndex: this.navParams.get('entityIndex'),
      observationIndex: this.navParams.get('selectedObservationIndex'),
      submissionIndex: index
    }

    this.assessmentService.getAssessmentDetailsOfCreatedObservation(event, this.programs, 'createdObservationList').then(success => {
      this.programs = success;
      this.observationDetails[0] = success[this.selectedObservationIndex]
      this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
      this.goToEcm(index)
    }).catch(error => {

    })

  }
  goToEcm(index) {
    console.log("go to ecm called");

    // console.log(JSON.stringify(this.programs))
    let submissionId = this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index]._id
    let heading = this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].name;
//  let recentlyUpdatedEntity = {
//       EntityName :this.programs[this.selectedObservationIndex].name,
//       EntityId :this.programs[this.selectedObservationIndex]._id,
//       programName  : this.programs[this.selectedObservationIndex].entities[this.entityIndex].name,
//       ProgramId  : this.programs[this.selectedObservationIndex].entities[this.entityIndex]._id,
//       submissionId :submissionId
//     }
    this.recentlyUpdatedEntity['submissionId'] = submissionId;
    // console.log(this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index])
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
      // console.log(JSON.stringify(successData))
      if (successData.assessment.evidences.length > 1) {
        // console.log("more then one evedince method")
        this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading ,recentlyUpdatedEntity:this.recentlyUpdatedEntity})
      } else {
        console.log("  one evedince method")

        // console.log(successData.assessment.evidences[0].startTime + "start time")
        if (successData.assessment.evidences[0].startTime) {
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 , recentlyUpdatedEntity : this.recentlyUpdatedEntity })
        } else {
          const assessment = { _id: submissionId, name: heading }
          this.openAction(assessment, successData, 0);
        }
      }
    }).catch(error => {
    });
    // let submissionId = this.programs['result']['assessment'].submissionId
    // let heading = this.programs['result']['assessment'].name;

    // // console.log(this.observationDetails[this.selectedObservationIndex].entities[this.entityIndex].submissions.length)
    // this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
    //     if (successData.assessment.evidences[0].startTime) {
    //       this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
    //       this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 })
    //     } else {
    //       const assessment = { _id: submissionId, name: heading }
    //       this.openAction(assessment, successData, 0);
    //     }
    // }).catch(error => {
    // });
  }

  openAction(assessment, aseessmemtData, evidenceIndex) {
    // console.log(JSON.stringify(assessment))

    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, entityDetails: aseessmemtData , recentlyUpdatedEntity :this.recentlyUpdatedEntity };
    this.evdnsServ.openActionSheet(options, "Observation");

  }
  observeAgain() {
    // this.getAssessmentDetails(this.submissionList.length , this.submissionList.length + 1)
    let submissionNumber = this.submissionList[this.submissionList.length-1].submissionNumber + 1;

    //  console.log(submissionNumber)
    //  this.apiProvider.httpGet(AppConfigs.cro.observationDetails + this.programs[this.selectedObservationIndex]._id + "?entityId=" + this.programs[this.selectedObservationIndex].entities[this.entityIndex]._id + "&submissionNumber=" + submissionNumber, success => {
    //     this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(success.result.assessment.submissionId), success.result)
    //     console.log("successful called with new submission number")
    //       this.observationService.refreshObservationList(this.programs).then(success=>{
    //         this.programs = success ;
    //         console.log("successful called refresh api")
    //         console.log( success[this.selectedObservationIndex].entities[this.entityIndex].submissions.length)
    //         this.submissionList =[... this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions];
    //         let x =[1,2,3]
    //         console.log(this.submissionList.length)
    //         console.log(x.length)

    //        }).catch( error =>{

    //       })
    //   },error =>{

    //   })
    let event = {
      entityIndex: this.navParams.get('entityIndex'),
      observationIndex: this.navParams.get('selectedObservationIndex'),
      submissionNumber: submissionNumber
    }
    // this.utils.startLoader();
    this.assessmentService.getAssessmentDetailsOfCreatedObservation(event, this.programs, 'createdObservationList').then(result => {
      this.observationService.refreshObservationList(this.programs).then(success => {
        this.programs = success;
        this.observationDetails[0] = success[this.selectedObservationIndex];
        this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
        // this.utils.stopLoader();
        
        this.goToEcm(this.submissionList.length)
      }).catch(error => {
        // this.utils.stopLoader();
      })
    }).catch(error => {
      // this.utils.stopLoader();
    })
  }

  viewEntityReports() {
    const payload = {
      entityId: this.submissionList[0].entityId,
      observationId: this.submissionList[0].observationId
    }
    this.navCtrl.push(ObservationReportsPage, payload);
  }


  actions(submissionId, action) {
    // this.dap.checkForSubmissionDoc(submissionId, action);
    this.navCtrl.push(ObservationReportsPage, { submissionId: submissionId })
  }
  deleteSubmission(submissionId) {

    let translateObject;
    this.translate.get(['actionSheet.confirm', 'actionSheet.deleteSubmission', 'actionSheet.no', 'actionSheet.yes']).subscribe(translations => {
      translateObject = translations;
      console.log(JSON.stringify(translations))
    })
    let alert = this.alertCntrl.create({
      title: translateObject['actionSheet.confirm'],
      message: translateObject['actionSheet.deleteSubmission'],
      buttons: [
        {
          text: translateObject['actionSheet.no'],
          role: 'cancel',
          handler: () => {
          }
        },
        {
          text: translateObject['actionSheet.yes'],
          handler: () => {
            this.utils.startLoader();
            this.apiProvider.httpGet(AppConfigs.cro.obsrvationSubmissionDelete + submissionId, success => {
              this.observationService.refreshObservationList(this.programs).then(success => {
                this.programs = success;
                this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;

                this.utils.stopLoader();

                this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions.length > 0 ? null : this.navCtrl.pop(); 
                
                // this.goToEcm(this.submissionList.length)
              }).catch(error => {
                this.utils.stopLoader();
               });
            }, error => {
              this.utils.stopLoader();
             })
          }
        }
      ]
    });
    alert.present();
  }


}
