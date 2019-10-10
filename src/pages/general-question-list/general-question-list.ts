import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Events, AlertController } from 'ionic-angular';
import { GeneralQuestionPage } from '../general-question/general-question';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { GeneralQuestionSubmitPage } from '../general-question-submit/general-question-submit';
import { UtilsProvider } from '../../providers/utils/utils';
import { Network } from '@ionic-native/network';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { TranslateService } from '@ngx-translate/core';

@IonicPage()
@Component({
  selector: 'page-general-question-list',
  templateUrl: 'general-question-list.html',
})
export class GeneralQuestionListPage {

  generalQuestions: any;
  submissionId: any;
  allGeneralQuestions: any;
  enableSubmitBtn: boolean = false;
  networkAvailable: boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, private utils: UtilsProvider,
    private modal: ModalController, private events: Events, private ngps: NetworkGpsProvider,
    private alertCntrl: AlertController, 
    private translate : TranslateService,
    private network: Network, private localStorage: LocalStorageProvider) {
    this.events.subscribe('network:offline', () => {
    });

    // Online event
    this.events.subscribe('network:online', () => {
    });
    this.networkAvailable = this.ngps.getNetworkStatus()
  }

  ionViewWillEnter() {
    this.submissionId = this.navParams.get('_id');
    this.localStorage.getLocalStorage('generalQuestions_' + this.submissionId).then(data => {
      if (data) {
        this.allGeneralQuestions = data;
        this.generalQuestions = this.allGeneralQuestions;
        this.enableSubmitBtn = this.enableGeneralaSubmission();
      }
    }).catch(error => {
    })
  }

  OpenQuestionModal(index) {
    const modal = this.modal.create(GeneralQuestionPage, { "question": JSON.parse(JSON.stringify(this.generalQuestions[index])), submissionId: this.submissionId });
    modal.onDidDismiss(data => {
      if (data) {
        this.generalQuestions[index] = data;
        this.enableSubmitBtn = this.enableGeneralaSubmission();
        this.localStorage.setLocalStorage('generalQuestions_' + this.submissionId, this.allGeneralQuestions)
      }
    })
    modal.present();
  }

  enableGeneralaSubmission(): boolean {
    let completed = false;
    for (const question of this.generalQuestions) {
      if (question.isCompleted) {
        return true
      }
    }
    return false
  }

  checkForNetworkTypeAlert() {
    if (this.network.type !== ('3g' || '4g' || 'wifi')) {
      let alert = this.alertCntrl.create({
        title: `{{'actionSheet.confirm' | translate}}`,
        message: `{{'actionSheet.networkSlowAlert' | translate }}` , 
        buttons: [
          {
            text:  `{{'actionSheet.no'|translate}}`,
            role: 'cancel',
            handler: () => {
            }
          },
          {
            text: `{{'actionSheet.yes'|translate}}`,
            handler: () => {
              this.goToImageListing()
            }
          }
        ]
      });
      alert.present();
    }
  }


  goToImageListing() {
    this.ngps.checkForLocationPermissions();
    if (this.networkAvailable) {
      const params = {
        _id: this.submissionId,
      }
      this.navCtrl.push(GeneralQuestionSubmitPage, params);
    } else {
      this.translate.get('toastMessage.enableInternet').subscribe(translations =>{
        this.utils.openToast(translations);
      })
    }


  }

}
