import { Component, ɵConsole } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { ObservationDetailsPage } from '../observation-details/observation-details';
import { EntityListPage } from '../observations/add-observation-form/entity-list/entity-list';
import { EntityListingPage } from '../entity-listing/entity-listing';

/**
 * Generated class for the AssessmentAboutPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-assessment-about',
  templateUrl: 'assessment-about.html',
})
export class AssessmentAboutPage {
  data;
  assessmentIndex;
  assessmentName;
  isObservation: boolean = false;
  programList;
  assessmentType;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,

  ) {
    this.assessmentIndex = this.navParams.get('assessmentIndex');
    this.assessmentName = this.navParams.get('assessmentName');
    this.isObservation = this.navParams.get('isObservation')  ;
    this.programList = this.navParams.get('programs');
    this.assessmentType = this.navParams.get('assessmentType');
    console.log(JSON.stringify(this.assessmentName))

  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage(this.assessmentName).then(success => {
      this.data = success[this.assessmentIndex]
      // console.log(JSON.stringify(success[this.assessmentIndex]))
    }).catch(error => {

    });
    console.log('ionViewDidLoad AssessmentAboutPage');
  }
  goToEntity() {
    if (this.isObservation) {
      this.navCtrl.push(ObservationDetailsPage, { selectedObservationIndex: this.assessmentIndex });
    } else {
      this.navCtrl.push(EntityListingPage, { programIndex: this.assessmentIndex, programs: this.programList, assessmentType: this.assessmentType })

    }
    // this.navCtrl.push(EntityListingPage)
    // EntityListingPage,{ programIndex : assessmentIndex , programs : this.programList , assessmentType : this.entityType }
  }
}
