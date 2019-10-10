import { HttpClient } from '@angular/common/http';
import { App } from 'ionic-angular';
import { Injectable } from '@angular/core';
import { ApiProvider } from '../api/api';
import { UtilsProvider } from '../utils/utils';
import { AppConfigs } from '../appConfig';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the RatingProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class RatingProvider {

  constructor(public http: HttpClient,
    private apiService: ApiProvider,
    private utils: UtilsProvider,
    private storage: Storage,
    private translate : TranslateService,
    private appCtrl: App) {
    console.log('Hello RatingProvider Provider');
  }

  checkForRatingDetails(submissionId, schoolData) {
    this.storage.get('rating_' + submissionId).then(data => {
      if (data) {
        this.appCtrl.getRootNav().push('RatingCriteriaListingPage', { 'submissionId': submissionId, 'schoolData': schoolData });
      } else {
        this.fetchRatingQuestions(submissionId, schoolData)
      }
    }).catch(error => {

    })

  }

  fetchRatingQuestions(submissionId, schoolData) {
    this.utils.startLoader();
    this.apiService.httpGet(AppConfigs.rating.fetchRatingQuestions + submissionId,
      success => {
        this.utils.stopLoader();
        // console.log(JSON.stringify(success))
        if (Object.keys(success.result).length) {
          this.storage.set('rating_' + submissionId, success.result);
          this.appCtrl.getRootNav().push('RatingCriteriaListingPage', { 'submissionId': submissionId, 'schoolData': schoolData });
        } else {
          this.translate.get( 'toastMessage.ok').subscribe(translations =>{
            this.utils.openToast(success.message,translations);
          })
        }
      }, error => {
        this.translate.get('toastMessage.somThingWentWrong').subscribe(translations =>{
          this.utils.openToast(translations);
        })
        this.utils.stopLoader();
      })
  }

  fetchRatedQuestions(submissionId, schoolData): void {
    this.utils.startLoader();
    this.apiService.httpGet(AppConfigs.flagging.fetchRatedQuestions + submissionId,
      success => {
        // console.log(JSON.stringify(success));
        // console.log(Object.keys(success.result).length)
        if (Object.keys(success.result).length && success.isEditable) {
          this.appCtrl.getRootNav().push('RatedCriteriaListPage', { "submissionId": submissionId, 'schoolData': schoolData, 'data':success.result })
        } else if(!success.isEditable) {
          this.translate.get(['toastMessage.noPermissionToPage', 'toastMessage.ok']).subscribe(translations =>{
            this.utils.openToast(translations.noPermissionToPage,translations.ok);
          })
        } else {
          this.translate.get( 'toastMessage.ok').subscribe(translations =>{
            this.utils.openToast(success.message,translations);
          })
        }
        this.utils.stopLoader();
      }, error => {
        this.utils.stopLoader();
        this.translate.get('toastMessage.somThingWentWrong').subscribe(translations =>{
          this.utils.openToast(translations);
        })
      })
  }

}
