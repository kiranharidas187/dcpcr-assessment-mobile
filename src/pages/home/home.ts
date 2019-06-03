import { Component } from '@angular/core';
import { NavController, App, Events, Platform, AlertController } from 'ionic-angular';
import { CurrentUserProvider } from '../../providers/current-user/current-user';
import { ApiProvider } from '../../providers/api/api';
import { Storage } from '@ionic/storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { SchoolConfig } from '../../providers/school-list/schoolConfig';
import { WelcomePage } from '../welcome/welcome';
import { RatingProvider } from '../../providers/rating/rating';
import { PopoverController } from 'ionic-angular';
import { MenuItemComponent } from '../../components/menu-item/menu-item';
import { Network } from '@ionic-native/network';
import { EvidenceProvider } from '../../providers/evidence/evidence';
import { AppConfigs } from '../../providers/appConfig';
import { UpdateLocalSchoolDataProvider } from '../../providers/update-local-school-data/update-local-school-data';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { InstitutionsEntityList } from '../institutions-entity-list/institutions-entity-list';
import { IndividualListingPage } from '../individual-listing/individual-listing';
import { ObservationsPage } from '../observations/observations';
import { DashboardsPage } from '../dashboards/dashboards';

declare var cordova: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  userData: any;
  schoolList: Array<object>;
  schoolDetails = [];
  evidences: any;
  subscription: any;
  networkAvailable: boolean;
  isIos: boolean = this.platform.is('ios');
  parentList: any = [];
  errorMsg: string;
  generalQuestions: any;
  schoolIndex = 0;
  currentProgramId: any;

  allPages: Array<Object> = [
   
    {
      name: "institutional",
      subName: 'assessments',
      icon: "book",
      component: InstitutionsEntityList,
      active: false
    },
    {
      name: "individual",
      subName: 'assessments',
      icon: "person",
      component: IndividualListingPage,
      active: false
    },
    {
      name: "observations",
      subName: '',
      icon: "eye",
      component: ObservationsPage,
      active: false
    },
    {
      name: "dashboard",
      subName: '',
      icon: "analytics",
      component: DashboardsPage,
      active: false
    }
   
  ]

  constructor(public navCtrl: NavController,
    private currentUser: CurrentUserProvider,
    private apiService: ApiProvider,
    private utils: UtilsProvider, private appCtrl: App,
    private storage: Storage,
    private ratingService: RatingProvider,
    private popoverCtrl: PopoverController,
    private network: Network,
    private events: Events,
    private evdnsServ: EvidenceProvider,
    private platform: Platform,
    private ulsd: UpdateLocalSchoolDataProvider,
    private alertCntrl: AlertController,
    private app: App,
    private localStorage: LocalStorageProvider
  ) {
    this.subscription = this.events.subscribe('localDataUpdated', () => {
      this.getLocalSchoolDetails();
    });

    this.isIos = this.platform.is('ios') ? true : false;

  }

  ionViewWillEnter() {
    this.onInit();
    if (this.network.type != 'none') {
      this.networkAvailable = true;
    }
  }

  getSchoolListApi(): void {
    this.utils.startLoader();
    this.apiService.httpGet(SchoolConfig.getSchoolsOfAssessors + '/', response => {
      this.schoolList = response.result;
      this.storage.set('schools', this.schoolList);
      if (!this.schoolList.length) {
        this.utils.stopLoader();
        this.errorMsg = response.message;
        // this.unauthorized(response.message);
      } else {
        this.utils.stopLoader();
      }
    }, error => {
      this.utils.stopLoader();
      if (error.status == '401') {
        this.appCtrl.getRootNav().push(WelcomePage);
      }
    })
  }
  goToPage(index) {
    this.events.publish('navigateTab',this.allPages[index]['name'])
  }
  unauthorized(msg) {
    let alert = this.alertCntrl.create({
      title: "Unauthorized",
      subTitle: msg,
      buttons: [
        {
          text: 'Ok',
          role: 'role',
          handler: data => {
            this.apiService.doLogout().then(success => {
              this.currentUser.removeUser();
              let nav = this.app.getRootNav();
              nav.setRoot(WelcomePage);
            }).then(error => {
            })
          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present();
  }



  getSchoolDetails(): void {
    if (!this.schoolIndex) {
      this.utils.stopLoader();
      this.utils.startLoader(`Please wait while fetching school details.`)
    }
    this.apiService.httpGet(SchoolConfig.getSchoolDetails + this.schoolList[this.schoolIndex]['_id'] + '/', response => {
      this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolList[this.schoolIndex]['_id']), response.result);
      this.localStorage.setLocalStorage("generalQuestions_" + this.schoolList[this.schoolIndex]['_id'], response.result['assessments'][0]['generalQuestions'] ? response.result['assessments'][0]['generalQuestions'] : null);
      this.localStorage.setLocalStorage("generalQuestionsCopy_" + this.schoolList[this.schoolIndex]['_id'], response.result['assessments'][0]['generalQuestions']);
      this.schoolList[this.schoolIndex]['submissionId'] = response.result['assessments'][0].submissionId;
      this.schoolList[this.schoolIndex]['programId'] = response.result.program._id;
      this.mappSubmissionData(response.result);
      this.schoolList[this.schoolIndex]['schoolDetailsFetched'] = true;
      this.localStorage.setLocalStorage('schools', this.schoolList);
      if (this.schoolIndex === this.schoolList.length - 1) {
        this.getParentRegistry();
      } else {
        this.schoolIndex++;
        this.getSchoolDetails();
      }
    }, error => {
    })
  }

  mappSubmissionData(schoolDetailsObj): void {
    this.ulsd.mapSubmissionDataToQuestion(schoolDetailsObj);
  }

  openAction(school, evidenceIndex) {
    this.utils.setCurrentimageFolderName(this.schoolDetails[school._id.toString()]['assessments'][0]['evidences'][evidenceIndex].externalId, school._id)
    const options = { _id: school._id, name: school.name, selectedEvidence: evidenceIndex, schoolDetails: this.schoolDetails, parent: this };
    this.evdnsServ.openActionSheet(options);
  }

  goToRating(school): void {
    const submissionId = this.schoolDetails[school._id]['assessments'][0].submissionId;
    this.ratingService.checkForRatingDetails(submissionId, school);
  }

  getParentRegistryForm(): void {
    this.apiService.httpGet(AppConfigs.parentInfo.getParentRegisterForm, success => {
      this.localStorage.setLocalStorage('parentRegisterForm', success.result)
    }, error => {
    })
  }

  getLocalSchoolDetails(): void {
    this.storage.get('schoolsDetails').then(details => {
      this.schoolDetails = JSON.parse(details);
      for (const schoolId of Object.keys(this.schoolDetails)) {
        this.checkForProgressStatus(this.schoolDetails[schoolId]['assessments'][0]['evidences'])
      }
    })
    this.localStorage.getLocalStorage('generalQuestions').then(questions => {
      if (questions) {
        this.generalQuestions = questions;
      }
    }).catch(error => {

    })
  }

  goToSections(school, evidenceIndex) {
    if (this.schoolDetails[school._id.toString()]['assessments'][0]['evidences'][evidenceIndex].startTime) {
      this.utils.setCurrentimageFolderName(this.schoolDetails[school._id.toString()]['assessments'][0]['evidences'][evidenceIndex].externalId, school._id)
      this.appCtrl.getRootNav().push('SectionListPage', { _id: school._id, name: school.name, selectedEvidence: evidenceIndex, parent: this })
    } else {
      this.openAction(school, evidenceIndex);
    }
  }

  goToGeneralQuestionList(school): void {
    this.appCtrl.getRootNav().push('GeneralQuestionListPage', { _id: school._id, name: school.name })
  }

  gotToEvidenceList(school) {
    this.appCtrl.getRootNav().push('EvidenceListPage', { _id: school._id, name: school.name, parent: this })
  }

  goToProfile(school): void {
    this.appCtrl.getRootNav().push('EntityProfilePage', { _id: school._id, name: school.name, parent: this })
  }

  getParentRegistry() {
    for (const school of this.schoolList) {
      this.apiService.httpGet(AppConfigs.parentInfo.getParentList + school['_id'], data => {
        this.parentListSuccessCallback(data.result)
      }, error => {

      })
    }
  }

  parentListSuccessCallback = (parentdata) => {
    this.parentList.push(parentdata);
    for (const parent of parentdata) {
      if (parent) {
        parent.uploaded = true;
      }
    }
    const schoolId = parentdata.length ? parentdata[0]['schoolId'] : null;
    this.localStorage.setLocalStorage("parentDetails_" + schoolId, parentdata)
    if (this.parentList.length === this.schoolList.length) {
      this.utils.stopLoader();
      for (const parent of parentdata) {
        if (parent) {
          parent.uploaded = true;
        }
      }
    }
  }


  checkForProgressStatus(evidences) {
    for (const evidence of evidences) {
      if (evidence.isSubmitted) {
        evidence.progressStatus = 'submitted';
      } else if (!evidence.startTime) {
        evidence.progressStatus = '';
      } else {
        evidence.progressStatus = 'completed';
        for (const section of evidence.sections) {
          if (section.progressStatus === 'inProgress' || !section.progressStatus) {
            evidence.progressStatus = 'inProgress';
          }
        }
      }
    }
  }

  onInit() {
    this.navCtrl.id = "HomePage";
    this.storage.get('parentRegisterForm').then(form => {
      if (!form) {
        this.getParentRegistryForm();
      }
    })
    this.userData = this.currentUser.getCurrentUserData();
    this.localStorage.getLocalStorage('schools').then(schools => {
      this.schoolList = schools;
    }).catch(error => {
      // this.getSchoolListApi();
    })
  }

  checkForAllSchoolDetailsFetchedStatus() {
    let index = 0;
    for (const school of this.schoolList) {
      if (!school['schoolDetailsFetched']) {
        this.schoolIndex = index;
        this.getSchoolDetails();
        break;
      }
      index++;
    }
  }

  getRatedQuestions(school): void {
    const submissionId = this.schoolDetails[school._id]['assessments'][0].submissionId;
    this.ratingService.fetchRatedQuestions(submissionId, school);
  }

  openMenu(myEvent, index) {
    let popover = this.popoverCtrl.create(MenuItemComponent, {
      submissionId: this.schoolList[index]['submissionId'],
      _id: this.schoolList[index]['_id'],
      name: this.schoolList[index]['name'],
      parent: this,
      programId: this.schoolList['programId']
    });
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillLeave() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


}
