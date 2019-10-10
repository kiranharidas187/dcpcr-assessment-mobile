import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { UtilsProvider } from '../../providers/utils/utils';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { DashboardPage } from '../dashboard/dashboard';

/**
 * Generated class for the ProgramListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-program-listing',
  templateUrl: 'program-listing.html',
})
export class ProgramListingPage {
  entity: any;
  programList: any;
  isProgramListAvailable: boolean = false;
  isIos ;

  constructor(public navCtrl: NavController,private platform : Platform, public utils: UtilsProvider, public navParams: NavParams, private apiProvider: ApiProvider) {
    this.entity = this.navParams.get('entity');
    this.isIos = this.platform.is('ios') ? true : false;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProgramListingPage');
    this.getProgramList()
  }
  getProgramList() {
    console.log(JSON.stringify(this.entity))
    this.utils.startLoader();
        this.apiProvider.httpPost(AppConfigs.roles.programList, { "entityId": this.entity._id, "entityType": this.entity.entityType, "immediateChildEntityType": this.entity.immediateSubEntityType ? this.entity.immediateSubEntityType :  this.entity.immediateChildEntityType ? this.entity.immediateChildEntityType : "" }, success => {
      this.programList = success
      // this.isProgramListAvailable = this.programList.length ? true : false;
      console.log(JSON.stringify(success))
      console.log(JSON.stringify(this.programList))

      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
      console.log("error");
      this.utils.openToast(error)
    }, { "dhiti": true })
  }
  getReportsAccordingToSolution(programId , solutionId, solutionName){
    this.navCtrl.push(DashboardPage , { "entity" :this.entity,"programId" : programId , "solutionId":solutionId, solutionName:solutionName} )
  }
}
