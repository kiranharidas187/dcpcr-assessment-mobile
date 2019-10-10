import { Component } from '@angular/core';
import { NavController, NavParams, App, Events } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { UtilsProvider } from '../../providers/utils/utils';
import { Storage } from '@ionic/storage';
import { AppConfigs } from '../../providers/appConfig';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'page-entity-profile-edit',
  templateUrl: 'entity-profile-edit.html',
})
export class EntityProfileEditPage {

  entityProfile: Array<string>;
  entityId: any;
  entityName: string;
  entityData: any;
  networkConnected: boolean;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private apiService: ApiProvider,
    private utils: UtilsProvider,
    private storage: Storage,
    private app: App,
    private translate:TranslateService,
    private ngps: NetworkGpsProvider,
    private events: Events,
    private localStorage: LocalStorageProvider) {
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad EntityProfilePage');
    this.entityId = this.navParams.get('_id');
    this.entityName = this.navParams.get('name');
    this.localStorage.getLocalStorage(this.utils.getAssessmentLocalStorageKey(this.entityId)).then(data => {
      this.entityData = data;
      this.entityProfile = this.entityData['entityProfile']['form'];
      
      this.events.subscribe('network:offline', () => {
        this.networkConnected = false;
      });
      // Online event
      this.events.subscribe('network:online', () => {
        this.networkConnected = true;
      });
      this.networkConnected = this.ngps.getNetworkStatus()
    }).catch(error => {
    })
  }

  goToPage(): void {
    this.app.getRootNav().push('EvidenceListPage', { _id: this.entityId, name: this.entityName })
  }

  updateProfile(): void {
    if (this.networkConnected) {
       this.utils.startLoader();
      const payload = {
        'entityProfile': {},
      }
      for (const field of this.entityProfile) {
        payload.entityProfile[field['field']] = field['value'];
      }

      //console.log(JSON.stringify(payload));
      const submissionId = this.entityData['assessment'].submissionId;
      const url = AppConfigs.survey.submission + submissionId;

      this.apiService.httpPost(url, payload, response => {
        this.utils.openToast(response.message);
        this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.entityId), this.entityData)
        this.utils.stopLoader();
        this.navCtrl.pop();
      }, error => {
        this.utils.stopLoader();
      })
    } else {
      this.translate.get('toastMessage.connectToInternet').subscribe(translations =>{
        this.utils.openToast(translations);
      })
    }
  }

  saveProfile(): void {
    this.localStorage.setLocalStorage(this.utils.getAssessmentLocalStorageKey(this.entityId), this.entityData)
    this.navCtrl.pop();
  }


}
