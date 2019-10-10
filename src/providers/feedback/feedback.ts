import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { ApiProvider } from '../api/api';
import { UtilsProvider } from '../utils/utils';
import { AppConfigs } from '../appConfig';
import { TranslateService } from '@ngx-translate/core';

/*
  Generated class for the FeedbackProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FeedbackProvider {

  constructor(public http: HttpClient, private alertCtrl : AlertController,
    private translate : TranslateService,
    private apiService: ApiProvider, private utils: UtilsProvider) {
    console.log('Hello FeedbackProvider Provider');
  }

  sendFeedback() {
    let translateObject ;
    this.translate.get(['actionSheet.feedBack','actionSheet.name','actionSheet.cancel','actionSheet.send']).subscribe(translations =>{
      translateObject = translations;
      console.log(JSON.stringify(translations))
    })
    let alert = this.alertCtrl.create({
      title: translateObject['actionSheet.feedback'],
      inputs: [
        {
          name:  translateObject['actionSheet.name'],
          placeholder:  translateObject['actionSheet.name'],
        },
        {
          name: translateObject['actionSheet.feedback'],
          placeholder:  translateObject['actionSheet.feedback'],
        }
      ],
      buttons: [
        {
          text:  translateObject['actionSheet.cancel'],
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text:  translateObject['actionSheet.send'],
          role: 'role',
          handler: data => {
            if (data.name && data.feedback) {
              data.type = 'Suggestion';
              this.apiService.httpPost(AppConfigs.survey.feedback, data, success => {
                this.utils.openToast(success.message);
              }, error => {
              })
            } else {
              this.translate.get('toastMessage.fillAllFields').subscribe(translations =>{
                this.utils.openToast(translations);
              })
            }
          }
        }
      ]
    });
    alert.present();
  }

}
