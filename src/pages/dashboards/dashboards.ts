import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import * as Highcharts from 'highcharts';
import { UtilsProvider } from '../../providers/utils/utils';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { AppAvailability } from '@ionic-native/app-availability';
import { InAppBrowser } from '@ionic-native/in-app-browser';

@Component({
  selector: 'page-dashboards',
  templateUrl: 'dashboards.html',
})
export class DashboardsPage {
  schoolId;
  schoolName;
  selectedEvidenceIndex;
  currentEvidenceId;
  schoolData;
  currentEvidence;
  responses;
  newResponse = [];
  teachers = [];
  graphResponse = [];
  domains = [];
  selectedTeacher;
  selectedDomain;
  levels = {
    1:0,
    2:0,
    3:0,
    4:0
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private utils: UtilsProvider, private localStorage: LocalStorageProvider,
    public appAvailability :AppAvailability ,
    public platform :Platform,
    public iab : InAppBrowser
  ) {
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.selectedEvidenceIndex = this.navParams.get('selectedEvidence');
    this.currentEvidenceId = this.navParams.get('selectedEvidenceId');
    this.createGraphObject();
  }

  createGraphObject() {
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId)).then(data => {
      this.schoolData = data;
      this.currentEvidence = this.schoolData['assessments'][0] ? this.schoolData['assessments'][0]['evidences'][this.selectedEvidenceIndex] : this.schoolData['assessments']['evidences'][this.selectedEvidenceIndex];
      this.responses = this.currentEvidence.sections[0]['questions'][0]['value'];
      this.responses.map(instances => {
        const instance = []
        instances.map(question => {
          const obj = {
            questionType: question.questionType,
            value: isNaN(question.value) ? question.value : parseInt(question.value),
            question: question.question[0],
            responseType: question.responseType
          }
          instance.push(obj)
        })
        this.graphResponse.push(instance);
      })
      this.getTeachersList();
      this.getDomainsList();
      this.onTeacherChange(this.teachers[0]);
      this.onDomainChange(this.domains[0]);
      this.selectedTeacher = this.teachers[0];
    }).catch(error => {
    });
  }

  getTeachersList() {
    for (const instance of this.graphResponse) {
      this.teachers.push(instance[0].value)
    }
  }

  getDomainsList() {
    for (const question of this.graphResponse[0]) {
      // for (const question of instance) {
      if (question.responseType === 'slider') {
        const string = question.question.substring(18, question.question.length)
        this.domains.push(string.trim())
      }
      // }
    }
    this.selectedDomain = this.domains[0];

    console.log(JSON.stringify(this.domains))
  }

  Highcharts = Highcharts; // required
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngular = false;
  viewMode = "teacherWise";
  chartObject = [
    {
      pie: {
        startAngle: 0,
        endAngle: 360,
      },
      series:[],
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Performance (teacher wise)'
      },
      xAxis: {
        max:4
      }
    },
    {
      series:
        [{
          innerSize: '20%',
          data: [
            ]
        }],
      chart: {
        type: 'pie'
      },
      title: {
        text: 'Teacher Rapport with Learning'
      },

      legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle',
        enabled: false
      },


    }
  ]

  ionViewDidLoad() {
    console.log('ionViewDidLoad DashboardsPage');

  }

  onTeacherChange(teacher) {
    const data = [{ data: [] }]
    for (const instance of this.graphResponse) {
      for (const question of instance) {
        if (instance[0].value === teacher && question.responseType === 'slider') {
          data[0].data.push([question.question.substring(18, question.question.length), question.value])
        }
      }
    }
    this.chartObject[0].series = data;
    this.updateFlag = true;
  }

  clearLevels() {
    for (const key of Object.keys(this.levels) ) {
      this.levels[key] = 0;
    }
  }

  onDomainChange(domain) {
    this.clearLevels();
    console.log("inside domain chnage");
    const data = [{ data: [] }]
    let levels = {}
    for (const instance of this.graphResponse) {
      for (const question of instance) {
        if (question.question.substring(18, question.question.length).trim() === domain && question.responseType === 'slider') {
          this.levels[question.value] = this.levels[question.value]+1;
        }
      }
    }
    for (const key of  Object.keys(this.levels) ) {
      if(this.levels[key]){
        data[0].data.push(["Rating " + key, this.levels[key]])
      }
    }
    console.log(data[0].data)
    this.chartObject[1].series[0]['data'] = data[0].data;
    console.log(JSON.stringify(this.chartObject[1]));
    this.updateFlag = true;

  }

  openLearnerApp( ){
    // let appUrl = 'twitter://user?screen_name=' ;
    let appUrl = 'unnati://';
    // let appUrl = 'community.shikshalokam.org/public/#!/course/do_3127730736811622401743';
  let app: string;
	if (this.platform.is('ios')) {
    app = 'unnati://';
    console.log("platform is ios");
	} else if (this.platform.is('android')) {
    app = 'io.ionic.starter';
    console.log("platform is android");
    
  } 
  // else {
	// 	let browser = new InAppBrowser(httpUrl + username, '_system');
	// 	return;
	// }

	this.appAvailability.check(app).then(
		() => { // success callback
      // let browser = this.iab.create('twitter://' , '_system');
      this.iab.create(appUrl, '_system', 'location=no');
      // window.open(appUrl, '_system', 'location=no');

        console.log('Unnati is available');
      
		},
		() => { // error callback
      // let browser = this.iab.create('https://www.instagram.com/' , '_system');
      // window.open('https://twitter.com/gajotres', '_system', 'location=no');
        console.log('Unnati is not available');
      
		}
	);
}

}




// openInstagram(username: string) {
// 	this.launchExternalApp('instagram://', 'com.instagram.android', 'instagram://user?username=', 'https://www.instagram.com/', username);
// }

// openTwitter(username: string) {
// 	this.launchExternalApp('twitter://', 'com.twitter.android', 'twitter://user?screen_name=', 'https://twitter.com/', username);
// }

// openFacebook(username: string) {
// 	this.launchExternalApp('fb://', 'com.facebook.katana', 'fb://profile/', 'https://www.facebook.com/', username);
// }