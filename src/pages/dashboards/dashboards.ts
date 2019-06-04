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
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId)).then(data => {
      this.schoolData = data;
      // this.currentEvidence = this.schoolData['assessments'][0] ? this.schoolData['assessments'][0]['evidences'][this.selectedEvidenceIndex] : this.schoolData['assessments']['evidences'][this.selectedEvidenceIndex];
      // this.responses = this.currentEvidence.sections[0]['questions']['value'];
      // this.responses.map(instances => {
      //   const instance = [];
      //   instances.map(question => {
      //     const qst = {

      //     }
      //   })
      // })
    }).catch(error => {
    })
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
      series:
        [{
          data: [
            ['Reports with Learners', 1],
            ['Learners', 2],
            ['Teaching learning process', 1],
            ['Command over content', 3],
            ['Physical environment', 2],
            ['Teaching Process', 3]]
        }],
      chart: {
        type: 'bar'
      },
      title: {
        text: 'Performance (teacher wise)'
      },
    },
    {
      series:
        [{
          innerSize: '20%',
          data: [
            ['Reports with Learners', 1],
            ['Learners', 2],
            ['Teaching learning process', 1],
            ['Command over content', 3],
            ['Physical environment', 2],
            ['Teaching Process', 3]]
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