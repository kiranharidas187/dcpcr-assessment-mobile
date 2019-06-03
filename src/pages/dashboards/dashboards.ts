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
  teachers = [];
  graphResponse = [];
  domains = [];
  selectedTeacher;
  seletedDomain;
  levels = {
    1:0,
    2:0,
    3:0,
    4:0
  }

  constructor(public navCtrl: NavController, public navParams: NavParams,
    private utils: UtilsProvider, private localStorage: LocalStorageProvider
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
      this.seletedDomain = this.domains[0];
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
      data[0].data.push(["Rating " + key, this.levels[key]])
    }
    console.log(data[0].data)
    this.chartObject[1].series[0]['data'] = data[0].data;
    console.log(JSON.stringify(this.chartObject[1]));
    this.updateFlag = true;

  }

}
