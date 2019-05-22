import { Component } from '@angular/core';
import { NavController, NavParams, App, PopoverController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SchoolConfig } from '../../providers/school-list/schoolConfig';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { WelcomePage } from '../welcome/welcome';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { MenuItemComponent } from '../../components/menu-item/menu-item';
import { UpdateLocalSchoolDataProvider } from '../../providers/update-local-school-data/update-local-school-data';
import { AppConfigs } from '../../providers/appConfig';

@Component({
  selector: 'institutions-entity-list',
  templateUrl: 'institutions-entity-list.html',
})
export class InstitutionsEntityList {


  schoolList: Array<object>;
  schoolDetails = [];
  enableRefresh = AppConfigs.configuration.enableAssessmentListRefresh;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private storage: Storage,
    private apiService: ApiProvider, private appCtrl: App,
    private utils: UtilsProvider,
    private localStotrage: LocalStorageProvider,
    private popoverCtrl: PopoverController,
    private ulsd: UpdateLocalSchoolDataProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InstitutionsEntityList');
    this.utils.startLoader();
    this.localStotrage.getLocalStorage('schools').then(schools => {
      // this.schoolList = schools;
      if (schools) {
      this.schoolList = schools;
      console.log("school Local storage if loop")

      } else {
        this.getSchoolListApi();
      console.log("school Local storage else loop" )

      }
      this.utils.stopLoader();
    }).catch(error => {
      console.log("no local storage" )

      this.getSchoolListApi();

      this.utils.stopLoader();

    })
  }

  getSchoolListApi(): void {
    console.log("api list called")
    // this.utils.startLoader();
    this.apiService.httpGet(SchoolConfig.getSchoolsOfAssessors, response => {
      // console.log(JSON.stringify(response.result));
      this.schoolList = response.result;
      this.storage.set('schools', this.schoolList);
      // this.localStotrage.setLocalStorage('schools',this.schoolList)

      // this.utils.stopLoader();
      

    }, error => {
      // this.utils.stopLoader();
      if (error.status == '401') {
        this.appCtrl.getRootNav().push(WelcomePage);
      }
    })
  }

  getSchoolDetails(): void {
    for (const school of this.schoolList) {
      this.apiService.httpGet(SchoolConfig.getSchoolDetails + school['_id'] + '?assessmentType=institutional', this.successCallback, error => {
      })
    }
  }

  getAssessmentDetails(schoolIndex) {
    this.utils.startLoader('Fetching school details.');
    this.schoolList[schoolIndex]['downloaded'] = true;
    this.localStotrage.setLocalStorage('schools', this.schoolList);
    this.apiService.httpGet(SchoolConfig.getSchoolDetails + this.schoolList[schoolIndex]['_id'], successData => {


      console.log(JSON.stringify(successData));
      this.localStotrage.setLocalStorage("generalQuestions_" + this.schoolList[schoolIndex]['_id'], successData.result['assessments'][0]['generalQuestions']);
      this.localStotrage.setLocalStorage("generalQuestionsCopy_" + this.schoolList[schoolIndex]['_id'], successData.result['assessments'][0]['generalQuestions']);
      this.schoolList[schoolIndex]['downloaded'] = true;
      this.localStotrage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolList[schoolIndex]['_id']), successData.result);
      this.ulsd.mapSubmissionDataToQuestion(successData.result);
      this.utils.stopLoader();
    }, errorData => {
      this.utils.stopLoader();

    })
  }

  refresh(event) {
    event ?" " : this.utils.startLoader();
    this.apiService.httpGet(SchoolConfig.getSchoolsOfAssessors, response => {
      const downloadedAssessments = []
      const currentAssessments = response.result;
      for (const school of this.schoolList) {
        if (school['downloaded']) {
          downloadedAssessments.push(school['_id']);
        }
      }
      if (!downloadedAssessments.length) {
        this.localStotrage.setLocalStorage("schools", response.result);
        event ? event.complete() : this.utils.stopLoader();
      } else {
        for (const assessment of currentAssessments) {
          if (downloadedAssessments.indexOf(assessment._id) >= 0) {
            assessment.downloaded = true;
          }
        }
        this.localStotrage.setLocalStorage("schools", currentAssessments);
        event ? event.complete() : this.utils.stopLoader();
      }
    }, error => {

    })
  }


  gotToEvidenceList(school) {
    this.appCtrl.getRootNav().push('EvidenceListPage', { _id: school._id, name: school.name, parent: this })
  }

  successCallback = (response) => {
    this.schoolDetails.push(response.result);
    if (this.schoolDetails.length === this.schoolList.length) {
      this.utils.stopLoader();
      const schoolDetailsObj = {}
      for (const school of this.schoolDetails) {
        schoolDetailsObj[school['schoolProfile']._id] = school;
      }
      this.storage.set('schoolsDetails', JSON.stringify(schoolDetailsObj));
    }
  }

  goToDetails(index): void {
    this.appCtrl.getRootNav().push('EntityProfilePage', { _id: this.schoolList[index]['_id'], name: this.schoolList[index]['name'] })
  }



  openMenu(myEvent, index) {
    let popover = this.popoverCtrl.create(MenuItemComponent, {
      submissionId: this.schoolList[index]['submissionId'],
      _id: this.schoolList[index]['_id'],
      name: this.schoolList[index]['name'],
      programId: this.schoolList['programId']
    });
    popover.present({
      ev: myEvent
    });
  }

  ionViewWillEnter() {
  }

}
