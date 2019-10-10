import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { ReportEntityListingPage } from '../report-entity-listing/report-entity-listing';
import { UtilsProvider } from '../../providers/utils/utils';

/**
 * Generated class for the RoleDashboardPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-role-listing',
  templateUrl: 'role-listing.html',
})
export class RoleListingPage {
  roles = [];
  entityType: any;

  constructor(public navCtrl: NavController,
    private utils : UtilsProvider,
    private localStorageProvider: LocalStorageProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RoleListingPage');
    this.utils.startLoader();
    this.localStorageProvider.getLocalStorage('profileRole').then(success =>{
      this.roles = success.result.roles;
      // this.entityType = success.result.roles.entityType
       console.log(JSON.stringify(success))
      this.utils.stopLoader();
       
    }).catch(
      error =>{
        this.utils.stopLoader();

      }

    );
  }
  roleSelected(role){
    console.log(JSON.stringify(role))
    this.navCtrl.push(ReportEntityListingPage ,{  "currentEntityType" : role.immediateSubEntityType, "data" : role.entities  , "entityType" : role.entities[0].immediateSubEntityType})
  }
}
