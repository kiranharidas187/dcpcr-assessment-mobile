import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, Events } from 'ionic-angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilsProvider } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'page-feedback',
  templateUrl: 'feedback.html',
})
export class FeedbackPage {

  feedbackForm: any;
  networkConnected: boolean;
  form: FormGroup;
  schoolId: string;
  schoolName: string;
  programId: string;
  submissionId: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private translate : TranslateService,
    private viewCntrl: ViewController, private ngps: NetworkGpsProvider,
    private events: Events, private localStorage: LocalStorageProvider,
    private utils: UtilsProvider, private apiService: ApiProvider) {
    this.events.subscribe('network:offline', () => {
      this.networkConnected = false;
    });

    // Online event
    this.events.subscribe('network:online', () => {
      this.networkConnected = true;
    });
    this.networkConnected = this.ngps.getNetworkStatus()
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FeedbackPage');
    this.getFeedbackForm();
    this.schoolId = this.navParams.get('schoolId');
    this.schoolName = this.navParams.get('schoolName');
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.schoolId)).then(schoolDetails => {
      if (schoolDetails) {
        this.programId = schoolDetails['program']._id;
      }
    }).catch(error => {
    })
    this.submissionId = this.navParams.get('submissionId')
  }

  getFeedbackForm(): void {
    this.utils.startLoader()
    this.apiService.httpGet(AppConfigs.feedback.getFeedbackForm, success => {
      this.feedbackForm = success.result;
      this.form = this.createFormGroup();
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    })
  }

  checkForVisibility(field) {
    if (field.visibleIf) {
      const visibility = eval('"' + this.form['controls'][field.visibleIf[0].field].value + '"' + field.visibleIf[0].operator + '"' + field.visibleIf[0].value + '"');
      return visibility
    } else {
      return true
    }
  }

  createFormGroup(): any {
    let formGrp = {};
    this.feedbackForm.forEach(formfield => {
      formGrp[formfield.field] = formfield.validation.required ? new FormControl(formfield.value || this[formfield.field] || "", Validators.required) : new FormControl(formfield.value || "");
    });
    return new FormGroup(formGrp)
  }

  update(): void {
    const payload = { "feedback": this.form.value }
    if (this.networkConnected) {
      this.utils.startLoader();
      this.apiService.httpPost(AppConfigs.feedback.submitFeedback + this.submissionId, payload, success => {
        this.utils.stopLoader();
        this.utils.openToast(success.message);
        this.viewCntrl.dismiss()
      }, error => {
        this.utils.stopLoader();
        this.utils.openToast(error.message);
      })
    } else {
      this.translate.get(['toastMessage.networkConnectionForAction', 'toastMessage.ok']).subscribe(translations =>{
        this.utils.openToast(translations.networkConnectionForAction , translations.ok);
      })
    }

  }

  cancel(): void {
    this.viewCntrl.dismiss();
  }

}
