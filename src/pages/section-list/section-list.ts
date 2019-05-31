import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, App, Events, Platform , AlertController} from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { UtilsProvider } from '../../providers/utils/utils';
import { ImageListingPage } from '../image-listing/image-listing';
import { Diagnostic } from '@ionic-native/diagnostic';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { Network } from '@ionic-native/network';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { DashboardsPage } from '../dashboards/dashboards';

@IonicPage()
@Component({
  selector: 'page-section-list',
  templateUrl: 'section-list.html',
})
export class SectionListPage {

  evidenceSections: any;
  schoolName: string;
  schoolId: any;
  selectedEvidenceIndex: any;
  selectedEvidenceName: string;
  schoolData: any;
  allAnsweredForEvidence: boolean;
  userData: any;
  currentEvidence: any;
  networkAvailable: any;
  isIos: boolean = this.platform.is('ios');

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private storage: Storage, private appCtrl: App,
    private currentUser: CurrentUserProvider,
    private apiService: ApiProvider, private utils: UtilsProvider,
    private diagnostic: Diagnostic, private ngps: NetworkGpsProvider,
    private feedback: FeedbackProvider,
    private events: Events, private platform: Platform,
    private alertCtrl: AlertController, private network: Network, private localStorage : LocalStorageProvider) {

    this.events.subscribe('network:offline', () => {
      this.networkAvailable = false;
    });

    // Online event
    this.events.subscribe('network:online', () => {
      this.networkAvailable = true;
    });
    this.networkAvailable = this.ngps.getNetworkStatus()
  }
  ionViewWillEnter() {
    // console.log('Entered')
    // console.log(JSON.stringify(this.userData))
    console.log('ionViewDidLoad SectionListPage');
    this.utils.startLoader();
    this.userData = this.currentUser.getCurrentUserData();
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.selectedEvidenceIndex = this.navParams.get('selectedEvidence');
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId)).then(data => {
      // console.log("in data")
      // console.log(JSON.stringify(data))

      this.schoolData = data;
      this.currentEvidence = this.schoolData['assessments'][0] ? this.schoolData['assessments'][0]['evidences'][this.selectedEvidenceIndex] : this.schoolData['assessments']['evidences'][this.selectedEvidenceIndex];
      // console.log("current evidence")
      // console.log(this.currentEvidence)

      this.evidenceSections = this.currentEvidence['sections'];
      this.selectedEvidenceName = this.currentEvidence['name'];
      this.checkForEvidenceCompletion();
      this.utils.stopLoader();
    }).catch( error => {
      this.utils.stopLoader();
    })
    // this.storage.get('schoolsDetails').then(data => {
    //   this.schoolData = JSON.parse(data);
    //   this.currentEvidence = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex];
    //   this.evidenceSections = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['sections'];
    //   this.selectedEvidenceName = this.schoolData[this.schoolId]['assessments'][0]['evidences'][this.selectedEvidenceIndex]['name'];
    //   this.checkForEvidenceCompletion();
    //   this.utils.stopLoader();
    // }).catch(error => {
    //   this.utils.stopLoader();
    // })
  }

  ionViewDidLoad() {
    this.diagnostic.isLocationEnabled().then(success => {
      this.ngps.checkForLocationPermissions();
    }).catch(error => {
      
    })

  }


  checkForEvidenceCompletion(): void {
    console.log("in ")
    let allAnswered;
    for (const section of this.evidenceSections) {
      console.log("sectionnnn")
      allAnswered = true;
      for (const question of section.questions) {
        // console.log(question.isCompleted)
        console.log("is completed: " + question.isCompleted)
        if (!question.isCompleted) {
          console.log("not completed " + section.name + "qid " + question._id)
          allAnswered = false;
          break;
        }
      }
      console.log("All answere: "+ allAnswered)
      if (this.currentEvidence.isSubmitted) {
        section.progressStatus = 'submitted';
      } else if (!this.currentEvidence.startTime) {
        section.progressStatus = '';
      }else if (allAnswered) {
        // console.log("hiiiii")
        section.progressStatus = 'completed';
      } else if (!allAnswered && section.progressStatus) {
        section.progressStatus = 'inProgress';
      } else if (!section.progressStatus) {
        section.progressStatus = '';
      }
      // console.log("Progress status " + section.progressStatus)
      // section.progressStatus = allAnswered ? 'completed' : section.progressStatus;
    }
    this.allAnsweredForEvidence = true;
    // console.log(JSON.stringify(this.evidenceSections))

    for (const section of this.evidenceSections) {
      if (section.progressStatus !== 'completed') {
        this.allAnsweredForEvidence = false;
        break;
      }
    }
    this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData)
    // this.utils.setLocalSchoolData(this.schoolData);
    // this.allAnsweredForEvidence = allAnswered;
  }

  goToQuestioner(selectedSection): void {
    const params = {
      _id: this.schoolId,
      name: this.schoolName,
      selectedEvidence: this.selectedEvidenceIndex,
      selectedSection: selectedSection
    };
    // this.appCtrl.getRootNav().push('QuestionerPage', params);
    if (!this.evidenceSections[selectedSection].progressStatus) {
      this.evidenceSections[selectedSection].progressStatus = this.currentEvidence.startTime ? 'inProgress' : '';
      // this.utils.setLocalSchoolData(this.schoolData)
    this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData)

    }
    this.navCtrl.push('QuestionerPage', params);
  }

  checkForNetworkTypeAlert() {
    // if(this.network.type !== ('3g' || '4g' || 'wifi')){
    //   let alert = this.alertCtrl.create({
    //     title: 'Confirm',
    //     message: 'You are connected to a slower data network. Image upload may take longer time. Do you want to continue?',
    //     buttons: [
    //       {
    //         text: 'No',
    //         role: 'cancel',
    //         handler: () => {
    //           console.log('Cancel clicked');
    //         }
    //       },
    //       {
    //         text: 'Yes',
    //         handler: () => {
    //           this.goToImageListing()
    //         }
    //       }
    //     ]
    //   });
    //   alert.present();
    // }
    this.demoSubmit();
  }


  goToImageListing() {
    if(this.networkAvailable) {
      this.diagnostic.isLocationEnabled().then(success => {
        if (success) {
          const params = {
            selectedEvidenceId: this.currentEvidence._id,
            _id: this.schoolId,
            name: this.schoolName,
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
      this.utils.openToast("Please enable network to continue");
    }
    

  }

  demoSubmit() {
    console.log(JSON.stringify(this.schoolData));
    this.currentEvidence.isSubmitted = true;
    this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData);
    this.navCtrl.pop();
    this.utils.openToast("ECM submitted successfully");
  }

  submitEvidence() {
    const payload = this.constructPayload();
    console.log(JSON.stringify(payload));

    const submissionId = this.schoolData['assessments'][0].submissionId;
    const url = AppConfigs.survey.submission + submissionId;
    if(this.networkAvailable){
      this.apiService.httpPost(url, payload, response => {
        this.utils.openToast(response.message);
        this.schoolData['assessments'][0]['evidences'][this.selectedEvidenceIndex].isSubmitted = true;
        // this.utils.setLocalSchoolData(this.schoolData);
        this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId), this.schoolData)
  
        // console.log(JSON.stringify(response))
      }, error => {
        console.log(JSON.stringify(error))
      })
    } else {
      this.utils.openToast("Please enable network connection for this action.");
    }

    // console.log(JSON.stringify(this.constructPayload()));

  }

  constructPayload() {
    const payload = {
      'schoolProfile': {},
      'evidence': {}
    }
    const schoolProfile = {};
    const evidence = {
      id: "",
      externalId: "",
      answers: []
    };
    for (const field of this.schoolData['schoolProfile']['form']) {
      schoolProfile[field.field] = field.value
    }
    // schoolProfile['updatedBy'] =  this.userData.sub;
    schoolProfile['updatedDate'] = Date.now();

    evidence.id = this.schoolData['assessments'][0]['evidences'][this.selectedEvidenceIndex]._id;
    evidence.externalId = this.schoolData['assessments'][0]['evidences'][this.selectedEvidenceIndex].externalId;

    for (const section of this.evidenceSections) {
      for (const question of section.questions) {
        const obj = {
          qid: question._id,
          value: question.value,
          remarks: question.remarks
        };
        evidence.answers.push(obj);
      }
    }
    payload.schoolProfile = schoolProfile;
    payload.evidence = evidence;
    return payload
  }

  feedBack() {
    this.feedback.sendFeedback()
  }


  ionViewWillLeave() {
    if (this.navParams.get('parent')) {
      this.navParams.get('parent').onInit();
    }
  }

  goToDashboard() {
    const params = {
      selectedEvidenceId: this.currentEvidence._id,
      _id: this.schoolId,
      name: this.schoolName,
      selectedEvidence: this.selectedEvidenceIndex,
    }
    this.navCtrl.push(DashboardsPage, params)
  }
}
