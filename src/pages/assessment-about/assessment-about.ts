import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { ObservationDetailsPage } from '../observation-details/observation-details';

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
  data ;
  assessmentIndex;
  assessmentName;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private localStorage: LocalStorageProvider,
     
     ) {
   this.assessmentIndex =  this.navParams.get('assessmentIndex');
   this.assessmentName = this.navParams.get('assessmentName')
   console.log(JSON.stringify(this.assessmentName))
   console.log(JSON.stringify(this.assessmentIndex))

  }

  ionViewDidLoad() {
    this.localStorage.getLocalStorage(this.assessmentName).then( success => {
    this.data = success[this.assessmentIndex]
    console.log(JSON.stringify(success[this.assessmentIndex]))
    }).catch(error => {

    });
    console.log('ionViewDidLoad AssessmentAboutPage');
  }
  goToEntity(){
    this.navCtrl.push(ObservationDetailsPage, { selectedObservationIndex: this.assessmentIndex })
  }
}
