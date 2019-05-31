import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import * as Highcharts from 'highcharts';
import { UtilsProvider } from '../../providers/utils/utils';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';

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
    private utils: UtilsProvider, private localStorage: LocalStorageProvider
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

}
