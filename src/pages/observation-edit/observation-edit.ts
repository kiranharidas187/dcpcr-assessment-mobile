import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { UtilsProvider } from '../../providers/utils/utils';
import { FormGroup } from '@angular/forms';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';

/**
 * Generated class for the ObservationEditPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-observation-edit',
  templateUrl: 'observation-edit.html',
})
export class ObservationEditPage {
  data;
  assessmentIndex;
  assessmentName;
  formGroup: FormGroup;
  formFields = [
    {
      "field": "name",
      "label": "Title",
      "value": "",
      "visible": true,
      "editable": true,
      "validation": {
        "required": true
      },
      "input": "text"
    },
    {
      "field": "description",
      "label": "Description",
      "value": "",
      "visible": true,
      "editable": true,
      "validation": {
        "required": true
      },
      "input": "text"
    }
  ];
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
    private utils: UtilsProvider,
    private apiService: ApiProvider
  ) {
    this.assessmentIndex = this.navParams.get('assessmentIndex');
    this.assessmentName = this.navParams.get('assessmentName')
    console.log(JSON.stringify(this.assessmentName))
    console.log(JSON.stringify(this.assessmentIndex))

  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage(this.assessmentName).then(success => {
      this.data = success[this.assessmentIndex];
      this.formFields[0].value = this.data.name;
      this.formFields[1].value = this.data.description;
      this.formGroup = this.utils.createFormGroup(this.formFields)
      console.log(JSON.stringify(success[this.assessmentIndex]))
    }).catch(error => {

    });
    console.log('ionViewDidLoad AssessmentAboutPage');
  }

  updateObservation() {
    if (this.formGroup.valid) {
      this.utils.startLoader();
      this.apiService.httpPost(AppConfigs.cro.observationUpdate + this.data._id, this.formGroup.value, success => {
        this.utils.stopLoader();
        this.data.name = this.formGroup.value.title;
        this.data.description = this.formGroup.value.description;
        this.localStorage.setLocalStorage(this.assessmentName, this.data);
        this.navCtrl.pop();
      }, error => {
        this.utils.stopLoader();

      })
    }
  }

}
