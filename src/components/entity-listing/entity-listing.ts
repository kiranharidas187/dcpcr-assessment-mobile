import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { UtilsProvider } from '../../providers/utils/utils';
import { UpdateTrackerProvider } from '../../providers/update-tracker/update-tracker';

/**
 * Generated class for the EntityListingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'entity-listing',
  templateUrl: 'entity-listing.html'
})
export class EntityListingComponent  implements OnInit{

  @Input() entityList;
  @Input() entityType;
  @Input() showMenu = true;
  // @Output() goToEcmEvent = new EventEmitter();
  @Output() getAssessmentDetailsEvent = new EventEmitter();
  @Output() openMenuEvent = new EventEmitter();
  @Input() enableAddRemoveEntityButton = false;
  @Input() programIndex ;
  text: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private evdnsServ: EvidenceProvider,
    private utils: UtilsProvider,
    private updateTracker : UpdateTrackerProvider

    ) {
  }
  ngOnInit() {
    // console.log(JSON.stringify(this.entityList));
    console.log('Hello EntityListingComponent Component');
    this.localStorage.getLocalStorage('recentlyModifiedAssessment').then(success=>{
      console.log(JSON.stringify(success))
    }).catch( error =>{
      console.log("no recentlyModifiedAssessment array")
    })
  }
  // goToEcm(id, name) {
  //   //console.log(JSON.stringify(id))
  //   this.goToEcmEvent.emit({
  //     submissionId: id,
  //     name: name
  //   })
  // }


  goToEcm(id, programName , ProgramId,EntityName ,EntityId) {
    let submissionId = id
    let heading = EntityName;
    let recentlyUpdatedEntity = {
      programName :programName,
      ProgramId :ProgramId,
      EntityName : EntityName,
      EntityId :EntityId,
      submissionId:id
    }
    console.log("go to ecm called" + submissionId );

    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(submissionId)).then(successData => {

      console.log(JSON.stringify(successData));
      //console.log("go to ecm called");

      // successData = this.updateTracker.getLastModified(successData , submissionId)
      console.log("after modification")
      if (successData.assessment.evidences.length > 1) {

        this.navCtrl.push('EvidenceListPage', { _id: submissionId, name: heading ,recentlyUpdatedEntity : recentlyUpdatedEntity})

      } else {
        if (successData.assessment.evidences[0].startTime) {
          //console.log("if loop " + successData.assessment.evidences[0].externalId)
          this.utils.setCurrentimageFolderName(successData.assessment.evidences[0].externalId, submissionId)
          this.navCtrl.push('SectionListPage', { _id: submissionId, name: heading, selectedEvidence: 0  ,recentlyUpdatedEntity : recentlyUpdatedEntity})
        } else {

          const assessment = { _id: submissionId, name: heading ,recentlyUpdatedEntity : recentlyUpdatedEntity}
          this.openAction(assessment, successData, 0);
          //console.log("else loop");

        }
      }
    }).catch(error => {
    });

  }
  openAction(assessment, aseessmemtData, evidenceIndex) {
    this.utils.setCurrentimageFolderName(aseessmemtData.assessment.evidences[evidenceIndex].externalId, assessment._id)
    const options = { _id: assessment._id, name: assessment.name,recentlyUpdatedEntity : assessment.recentlyUpdatedEntity ,selectedEvidence: evidenceIndex, entityDetails: aseessmemtData };
    this.evdnsServ.openActionSheet(options);
  }


  getAssessmentDetails(programIndex, assessmentIndex, entityIndex) {
    this.getAssessmentDetailsEvent.emit({
      programIndex: programIndex,
      assessmentIndex: assessmentIndex,
      entityIndex: entityIndex
    })
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
}
