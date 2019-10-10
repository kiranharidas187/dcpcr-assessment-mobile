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
  selector: 'page-registry-form',
  templateUrl: 'registry-form.html',
})
export class RegistryFormPage {

  formFields: any = [];
  form: FormGroup;
  schoolDetails: any;
  schoolId: any;
  schoolName: any;
  programId: string;
  networkConnected: boolean;
  registryType: string;
  submissionId: any;
  solutionId: any;
  parentEntityId: any;
  createdByProgramId: any;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private viewCntrl: ViewController, private ngps: NetworkGpsProvider,
    private events: Events, private localStorage: LocalStorageProvider,
    private translate: TranslateService,
    private utils: UtilsProvider, private apiService: ApiProvider) {
    this.schoolId = this.navParams.get('_id');
    this.submissionId = this.navParams.get('submissionId');
    this.schoolName = this.navParams.get('name');
    //console.log(this.navParams.get('name'));
    //console.log(" id related to this page");
    //console.log(this.navParams.get('solutionId'));
    //console.log(this.navParams.get('parentEntityId'));
    //console.log(this.navParams.get('createdByProgramId'));

    this.registryType = this.navParams.get('registryType');
    this.solutionId = this.navParams.get('solutionId');
    this.parentEntityId = this.navParams.get('parentEntityId');
    this.createdByProgramId = this.navParams.get('createdByProgramId');
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
    //console.log('ionViewDidLoad ParentsFormPage');
    this.localStorage.getLocalStorage(this.registryType + 'RegisterForm').then(formFields => {
      if (formFields) {
        for (const formField of formFields) {
          if (formField.visible) {
            this.formFields.push(formField)
          }
        }
        this.form = this.createFormGroup();
      }
    }).catch(error => {
    })

    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.submissionId)).then(schoolDetails => {
      if (schoolDetails) {
        this.schoolDetails = schoolDetails;
        // //console.log(JSON.stringify(this.schoolDetails));
        this.programId = this.schoolDetails['program']._id;
      }
    }).catch(error => {
    })
  }

  createFormGroup(): any {
    let formGrp = {};
    this.formFields.forEach(formfield => {
      formGrp[formfield.field] = formfield.validation.required ? new FormControl(formfield.value || "", Validators.required) : new FormControl(formfield.value || "");
    });
    return new FormGroup(formGrp)
  }

  update(): void {
    // //console.log(JSON.stringify(this.schoolDetails));

    const key = this.registryType ;
    const payload = { data : [] }
    const obj = this.form.value;
    obj.programId = this.schoolDetails['program']._id;
    obj.schoolId = this.schoolId;
    obj.schoolName = this.schoolName;
    obj.solutionId = this.solutionId;
    obj.parentEntityId = this.parentEntityId;
    obj.createdByProgramId = this.createdByProgramId;
    // //console.log(JSON.stringify(this.schoolDetails));

    payload['data'].push(obj)
    //console.log(JSON.stringify(payload));
    //console.log("api calling");
    const url =AppConfigs.registry.addEntityInfo+this.registryType+"&programId="+this.createdByProgramId+"&solutionId="+this.solutionId+"&parentEntityId="+this.parentEntityId;
    //console.log(url);
    if (this.networkConnected) {
      this.utils.startLoader();
      
      this.apiService.httpPost(url, payload, success => {

        //console.log("successfully uploaded");
        this.utils.stopLoader();
        //console.log(JSON.stringify(success));
        this.utils.openToast(success.message);
        obj.uploaded = true;
        this.viewCntrl.dismiss(obj);
      }, error => {
        //console.log(" uploaded api error");

        this.translate.get(['toastMessage.someThingWentWrongTryLater','toastMessage.ok']).subscribe(translations =>{
          this.utils.openToast(translations.someThingWentWrongTryLater);
        })
        this.utils.stopLoader();
        obj.uploaded = false;
        this.viewCntrl.dismiss(obj)
      })
    } else {
      //console.log("network else");

      obj.uploaded = false;
      this.viewCntrl.dismiss(obj)
    }
  }

  cancel(): void {
    this.viewCntrl.dismiss();
  }

}
