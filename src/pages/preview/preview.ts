import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { Network } from '@ionic-native/network';
import { TranslateService } from '@ngx-translate/core';
import { ImageListingPage } from '../image-listing/image-listing';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { Diagnostic } from '@ionic-native/diagnostic';

@Component({
  selector: 'page-preview',
  templateUrl: 'preview.html',
})
export class PreviewPage {

  submissionId;
  entityName;
  selectedEvidenceIndex;
  selectedEvidenceName;
  currentEvidence;
  entityDetails;
  evidenceSections;
  allAnsweredForEvidence: boolean;
  networkAvailable: any;


  constructor(public navCtrl: NavController, public navParams: NavParams,
    private localStorage: LocalStorageProvider, private utils: UtilsProvider,
    private network: Network, private translate: TranslateService,
    private alertCtrl: AlertController, private events: Events,
    private diagnostic: Diagnostic,
    private ngps: NetworkGpsProvider) {


    this.events.subscribe('network:offline', () => {
      this.networkAvailable = false;
    });

    // Online event
    this.events.subscribe('network:online', () => {
      this.networkAvailable = true;
    });
    this.networkAvailable = this.ngps.getNetworkStatus()
  }

  ionViewDidEnter() {
    console.log('ionViewDidLoad PreviewPage');
    this.submissionId = this.navParams.get('_id');
    this.entityName = this.navParams.get('name');
    this.selectedEvidenceIndex = this.navParams.get('selectedEvidence');
    // this.utils.startLoader();
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.submissionId)).then(data => {
      this.entityDetails = data;
      this.currentEvidence = data['assessment']['evidences'][this.selectedEvidenceIndex];
      this.evidenceSections = this.currentEvidence['sections'];
      this.checkForEvidenceCompletion();
      console.log(JSON.stringify(data))
      // this.utils.stopLoader();
    }).catch(error => {
      // this.utils.stopLoader();
    })
  }

  checkForEvidenceCompletion(): void {
    let allAnswered;
    for (const section of this.evidenceSections) {
      allAnswered = true;
      for (const question of section.questions) {
        if (!question.isCompleted) {
          allAnswered = false;
          break;
        }
      }
      if (this.currentEvidence.isSubmitted) {
        section.progressStatus = 'submitted';
      } else if (!this.currentEvidence.startTime) {
        section.progressStatus = '';
      } else if (allAnswered) {
        section.progressStatus = 'completed';
      } else if (!allAnswered && section.progressStatus) {
        section.progressStatus = 'inProgress';
      } else if (!section.progressStatus) {
        section.progressStatus = '';
      }
    }
    this.allAnsweredForEvidence = true;
    for (const section of this.evidenceSections) {
      if (section.progressStatus !== 'completed') {
        this.allAnsweredForEvidence = false;
        break;
      }
    }
    this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.submissionId), this.entityDetails)
  }

  getLabels(question) {
    console.log(question.value)
    // const value = question.value.split(',');
    const labels = [];
    for (const option of question.options) {
      if (question.value.includes(option.value)) {
        labels.push(option.label)
      }
    }
    return labels

  }




  checkForNetworkTypeAlert() {
    if (this.network.type !== ('3g' || '4g' || 'wifi')) {
      let translateObject;
      this.translate.get(['actionSheet.confirm', 'actionSheet.yes', 'actionSheet.no', 'actionSheet.slowInternet']).subscribe(translations => {
        translateObject = translations;
        console.log(JSON.stringify(translations))
      })
      let alert = this.alertCtrl.create({
        title: translateObject['actionSheet.confirm'],
        message: translateObject['actionSheet.slowInternet'],
        buttons: [
          {
            text: translateObject['actionSheet.no'],
            role: 'cancel',
            handler: () => {
              //console.log('Cancel clicked');
            }
          },
          {
            text: translateObject['actionSheet.yes'],
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
    if (this.networkAvailable) {
      this.diagnostic.isLocationEnabled().then(success => {
        if (success) {
          const params = {
            selectedEvidenceId: this.currentEvidence._id,
            _id: this.submissionId,
            name: this.entityName,
            selectedEvidence: this.selectedEvidenceIndex,
          }
          this.navCtrl.push(ImageListingPage, params);
        } else {
          this.ngps.checkForLocationPermissions();
        }
      }).catch(error => {
        this.ngps.checkForLocationPermissions();
      })
    } else {
      this.translate.get('toastMessage.connectToInternet').subscribe(translations => {
        this.utils.openToast(translations);
      })
    }


  }


}
