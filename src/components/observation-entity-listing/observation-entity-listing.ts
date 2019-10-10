import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NavController, NavParams, ModalController, AlertController, Events } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';
import { EntityListPage } from '../../pages/observations/add-observation-form/entity-list/entity-list';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { TranslateService } from '@ngx-translate/core';
import { AssessmentAboutPage } from '../../pages/assessment-about/assessment-about';
import { SubmissionListPage } from '../../pages/submission-list/submission-list';
import { ObservationServiceProvider } from '../../providers/observation-service/observation-service';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';
// import { AssessmentAboutPage } from '../../pages/assessment-about/assessment-about';
/**
 * Generated class for the EntityListingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'observation-entity-listing',
  templateUrl: 'observation-entity-listing.html'
})
export class ObservationEntityListingComponent implements OnDestroy {

  @Input() entityList;
  @Input() entityType;
  @Input() showMenu = true;
  @Output() getAssessmentDetailsEvent = new EventEmitter();
  @Output() openMenuEvent = new EventEmitter();
  @Input() selectedObservationIndex;
  @Input() observationList;


  text: string;
  // @Input() selectedindex ;
  @Output() updatedLocalStorage = new EventEmitter();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public observationProvider: ObservationServiceProvider,
    private localStorage: LocalStorageProvider,
    public alertCntrl: AlertController,
    private evdnsServ: EvidenceProvider,
    private assessmentService : AssessmentServiceProvider,
    private translate: TranslateService,
    private apiProviders: ApiProvider,
    private events: Events,
    private observationService : ObservationServiceProvider,
    private modalCtrl: ModalController,
    private utils: UtilsProvider) {
    // console.log(JSON.stringify(this.entityList))

    //console.log('Hello EntityListingComponent Component');
  }

  ngOnDestroy(): void {
    this.events.unsubscribe('refreshObservationListOnAddEntity');
  }
  // goToEcm(id, name) {
  //   //console.log(JSON.stringify(id))
  //   this.goToEcmEvent.emit({
  //     submissionId: id,
  //     name: name
  //   })
  // }
  checkSubmission(entity, observationIndex, entityIndex) {
    const recentlyUpdatedEntity = {
       programName :this.observationList[this.selectedObservationIndex]._id,
      ProgramId :this.observationList[this.selectedObservationIndex]._id,
      EntityName : this.observationList[this.selectedObservationIndex].entities[entityIndex].name,
      EntityId : this.observationList[this.selectedObservationIndex].entities[entityIndex]._id,
      isObservation : true
    }
    // console.log(JSON.stringify(this.entityList))
    console.log("checking submission");
    console.log(this.selectedObservationIndex)
    if (this.entityList[observationIndex]['entities'][entityIndex].submissions && this.entityList[observationIndex]['entities'][entityIndex].submissions.length > 0) {
      console.log("submission there")
      this.navCtrl.push(SubmissionListPage, { observationIndex: observationIndex, entityIndex: entityIndex, selectedObservationIndex: this.selectedObservationIndex , recentlyUpdatedEntity:recentlyUpdatedEntity })
    } else {
      console.log("no submission")
    
      let event = {
        entityIndex: entityIndex,
        observationIndex: this.selectedObservationIndex,
        submissionNumber: 1
      }
      // this.utils.startLoader();
      this.assessmentService.getAssessmentDetailsOfCreatedObservation(event, this.observationList, 'createdObservationList').then(result => {
        this.observationService.refreshObservationList(this.observationList).then(success => {
          this.observationList = success;
          this.entityList[0] = success[this.selectedObservationIndex];
         
          this.navCtrl.push(SubmissionListPage, { observationIndex: observationIndex, entityIndex: entityIndex, selectedObservationIndex: this.selectedObservationIndex ,recentlyUpdatedEntity:recentlyUpdatedEntity  })

          // this.submissionList = this.programs[this.selectedObservationIndex].entities[this.entityIndex].submissions;
          // this.goToEcm(0 , entityIndex)
        }).catch(error => {
  
        })
      }).catch(error => {
  
      })


      // this.observationProvider.getSubmission(this.selectedObservationIndex ,entityindex, 1 , this.observationList,'createdObservationList').then(submissionId => {
      //   this.goToEcm( entity.name, entityindex, observationIndex , submissionId) 
      // }).catch(error => {

      // });
    }
  }
  goToEcm(index , entityIndex) {
    console.log("go to ecm called");
    let recentlyUpdatedEntity = {
      programName :this.observationList[this.selectedObservationIndex].name,
      ProgramId :this.observationList[this.selectedObservationIndex]._id,
      EntityName : this.observationList[this.selectedObservationIndex].entities[entityIndex].name,
      EntityId : this.observationList[this.selectedObservationIndex].entities[entityIndex]._id,
      isObservation : true  
    }
    // console.log(JSON.stringify(this.programs))
    let submissionId = this.observationList[this.selectedObservationIndex]['entities'][entityIndex].submissions[index]._id
    let heading = this.observationList[this.selectedObservationIndex]['entities'][entityIndex].name;

    // console.log(this.programs[this.selectedObservationIndex]['entities'][this.entityIndex].submissions[index])
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {
      // console.log(JSON.stringify(successData))
      if (successData.assessment.evidences.length > 1) {
        // console.log("more then one evedince method")
        this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading ,recentlyUpdatedEntity :recentlyUpdatedEntity })
      } else {
        console.log("  one evedince method")

        // console.log(successData.assessment.evidences[0].startTime + "start time")
        if (successData.assessment.evidences[0].startTime) {
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0 , recentlyUpdatedEntity : recentlyUpdatedEntity})
        } else {
          const assessment = { _id: submissionId, name: heading }
          this.openAction(assessment, successData, 0);
        }
      }
    }).catch(error => {
    });
  }
  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name, selectedEvidence: evidenceIndex, entityDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options, 'Observation');
  }



  getAssessmentDetailsOfCreatedObservation(programIndex, entityIndex, solutionId) {
    // console.log("go to details called");

    this.getAssessmentDetailsEvent.emit({
      programIndex: programIndex,
      entityIndex: entityIndex,
      solutionId: solutionId
    });
  }

  openMenu(...params) {

    const solutionId = this.entityList[params[1]].solutions[params[2]]._id;
    const parentEntityId = this.entityList[params[1]].solutions[params[2]].entities[params[3]]._id;
    const createdByProgramId = this.entityList[params[1]]._id;
    this.openMenuEvent.emit({
      event: params[0],
      programIndex: params[1],
      assessmentIndex: params[2],
      entityIndex: params[3],
      submissionId: params[4],
      solutionId: solutionId,
      parentEntityId: parentEntityId,
      createdByProgramId: createdByProgramId
    });

  }

  addEntity(...params) {
    // console.log(JSON.stringify(params))

    let entityListModal = this.modalCtrl.create(EntityListPage, { data: this.entityList[params[0]]._id,solutionId : this.observationList[this.selectedObservationIndex].solutionId}
    );
    entityListModal.onDidDismiss(entityList => {
      if (entityList) {
        // console.log(JSON.stringify(entityList));
        let payload = {
          data: []
        }
        entityList.forEach(element => {
          payload.data.push(element._id);
        });
        // this.utils.startLoader();
        this.apiProviders.httpPost(AppConfigs.cro.mapEntityToObservation + this.entityList[params[0]]._id, payload, success => {
          // this.utils.stopLoader();

          // entityList.forEach(entity => {
          //   entity.submissionStatus = "started";
          //   entity.downloaded = false;
          // })
          // this.entityList[0].entities = [...entityList, ...this.entityList[0].entities];
          // this.updatedLocalStorage.emit();
          console.log("refreshObservationListOnAddEntity getting called")
          this.events.publish('refreshObservationListOnAddEntity');


        }, error => {
          // this.utils.stopLoader();
        })
      }
    })
    entityListModal.present();
  }

  removeEntity(...params) {
    console.log("remove entity called")
    let translateObject;
    this.translate.get(['actionSheet.confirm', 'actionSheet.deleteEntity', 'actionSheet.no', 'actionSheet.yes']).subscribe(translations => {
      translateObject = translations;
      console.log(JSON.stringify(translations))
    })
    let alert = this.alertCntrl.create({
      title: translateObject['actionSheet.confirm'],
      message: translateObject['actionSheet.deleteEntity'],
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
            let obj = {
              data: [
                this.entityList[params[0]].entities[params[1]]._id
              ]
            }
            this.utils.startLoader();
            this.apiProviders.httpPost(AppConfigs.cro.unMapEntityToObservation + this.entityList[params[0]]._id, obj, success => {
              let okMessage;
              this.translate.get('toastMessage.ok').subscribe(translations => {
                //  console.log(JSON.stringify(translations))

                okMessage = translations
              })
              this.utils.openToast(success.message);

              this.utils.stopLoader();
              console.log(JSON.stringify(success));

              this.entityList[params[0]].entities.splice(params[1], 1);
              this.updatedLocalStorage.emit(params[1]);
            }, error => {
              this.utils.stopLoader();

              console.log(JSON.stringify(error));
              console.log("error")

            });
            console.log(JSON.stringify(this.entityList))
          }
        }
      ]
    });
    alert.present();
  }



}
