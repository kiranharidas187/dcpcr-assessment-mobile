import { HttpClient } from '@angular/common/http';
import { Injectable, ɵConsole } from '@angular/core';
import { AppConfigs } from '../appConfig';
import { ApiProvider } from '../api/api';
import { UtilsProvider } from '../utils/utils';
import { LocalStorageProvider } from '../local-storage/local-storage';
import { UpdateLocalSchoolDataProvider } from '../update-local-school-data/update-local-school-data';
import { PopoverController, Events } from 'ionic-angular';
import { resolve } from 'url';

/*
  Generated class for the ObservationServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ObservationServiceProvider {

  constructor(
    public http: HttpClient,
    public apiProvider:ApiProvider,
    public utils : UtilsProvider,
    public events : Events,
    private localStorage: LocalStorageProvider,
    private ulsdp: UpdateLocalSchoolDataProvider,
    ) {
    console.log('Hello ObservationServiceProvider Provider');
  }
  getSubmission(observationIndex,entityIndex,submissionNumber, programs, assessmentType) {
    return new Promise((resolve, reject) =>{

    this.utils.startLoader()
    // this.localStorage.getLocalStorage('createdObservationList').then(success =>{
    //   programs = success

    // console.log(JSON.stringify(programs[observationIndex]['entities'][entityIndex]))
    // const url = AppConfigs.assessmentsList.detailsOfAssessment + programs[event.observationIndex]._id + "?solutionId=" + programs[event.observationIndex].solutionId + "&entityId=" +programs[event.observationIndex].entities[schoolIndex]._id;
    const url = AppConfigs.cro.observationDetails+ programs[observationIndex]._id+"?entityId="+programs[observationIndex].entities[entityIndex]._id+"&submissionNumber="+submissionNumber;
  
    this.apiProvider.httpGet(url, success => {
      this.ulsdp.mapSubmissionDataToQuestion(success.result, true);
      const generalQuestions = success.result['assessment']['generalQuestions'] ? success.result['assessment']['generalQuestions'] : null;
      this.localStorage.setLocalStorage("generalQuestions_" + success.result['assessment']["submissionId"], generalQuestions);
      this.localStorage.setLocalStorage("generalQuestionsCopy_" + success.result['assessment']["submissionId"], generalQuestions);
      // programs[observationIndex]['entities'][entityIndex].downloaded = true;
      programs[observationIndex]['entities'][entityIndex].submissionId = success.result.assessment.submissionId;
      this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(success.result.assessment.submissionId), success.result);
      this.localStorage.setLocalStorage(assessmentType, programs);
      // this.localStorage.getLocalStorage(assessmentType).then(success =>{
        // console.log(JSON.stringify(programs[observationIndex]['entities'][entityIndex]))
      // }).catch();
      
      this.utils.stopLoader();
      // console.log("resolving program")
      this.events.publish('refreshObservationList');

      resolve(success.result.assessment.submissionId);

    }, error => {
      //console.log("error details api")
      this.utils.stopLoader();
      reject();
    });
  // }).catch(error=>{
  //   reject();
  // })
  
  });
  }



  refreshObservationList(observationList , event? :any){
    return new Promise((resolve, reject) =>{
      // event ? "" : this.utils.startLoader();
      
      let createdObservation ;
      let downloadSubmission =[];
      observationList.forEach(entity => {
        if(entity.entities){
        entity.entities.forEach(element => {
        if( element.submissions){
        element.submissions.forEach( submission =>{
          if(submission.downloaded){
            downloadSubmission.push(submission._id);
            console.log(submission._id);
          }
        });
      }
      });
      }

      });
      console.log(JSON.stringify(downloadSubmission))
      this.apiProvider.httpGet(AppConfigs.cro.observationList, success => {
        createdObservation = success.result;

      if(!(downloadSubmission.length > 0)){
        createdObservation.forEach(observation => {
          observation.entities.forEach( entity =>{
            entity.submissions.forEach( submission =>{
                submission['downloaded'] = false;
          });
          });
        });
        event ? event.complete() : "";
        console.log(JSON.stringify(createdObservation))
        console.log("if no previous thing found");

        this.localStorage.setLocalStorage('createdObservationList', createdObservation);
        resolve(createdObservation);
      }else{
      // this.apiProvider.httpGet(AppConfigs.cro.observationList, success => {
      //   console.log(JSON.stringify(success))
      downloadSubmission.forEach(submissionId=>{

        createdObservation.forEach(observation => {
          observation.entities.forEach( entity =>{
            entity.submissions.forEach( submission =>{
              if(submissionId == submission._id){
                submission.downloaded = true ;
                // console.log(submission._id)
                console.log(JSON.stringify(submission._id ))
              }
              else{
                if(! submission.downloaded )
                    submission.downloaded = false;
              }
            });
          });
          });
        });
        console.log(JSON.stringify(createdObservation))
        // console.log(JSON.stringify(success))
        console.log("else - previous thing found");
        this.localStorage.setLocalStorage('createdObservationList', createdObservation);
        event ? event.complete() : "";
        // this.
        resolve(createdObservation);
     
    }
  },error=>{
    event ? event.complete() : "";
    reject();
  });
    });
    
  }


  // getObservationList(){
  //   return new Promise((resolve,reject) =>{
  //     this.utils.startLoader();
  //     this.apiProvider.httpGet(AppConfigs.cro.observationList, success => {
  //       let createdObservation = success.result;
  //       createdObservation.forEach(element => {
  //         if (element.entities.length >= 0) {
  //           element.entities.forEach(entity => {
  //             // entity.downloaded = false;
  //             if(entity.submissions && entity.submissions.length > 0){
  //               entity.submissions.forEach( submission =>{
  //                 submission['downloaded'] = false;
  //               })
  //             }
  //           });
  //         }
  //       });
  //       console.log(JSON.stringify(createdObservation));
  //       this.utils.stopLoader();
  //       this.localStorage.setLocalStorage('createdObservationList', createdObservation)
  //   },error=>{
      
  //    })
  //  })
  // }
}
