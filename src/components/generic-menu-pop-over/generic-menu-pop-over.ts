import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, App } from 'ionic-angular';
import { AssessmentAboutPage } from '../../pages/assessment-about/assessment-about';
import { ObservationEditPage } from '../../pages/observation-edit/observation-edit';
ObservationEditPage
/**
 * Generated class for the GenericMenuPopOverComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'generic-menu-pop-over',
  templateUrl: 'generic-menu-pop-over.html'
})
export class GenericMenuPopOverComponent {

  text: string;
  showAbout = false;
  showEdit = false;
  assessmentIndex;
  assessmentName;
  isObservation;
  constructor(
    private appCtrl: App,
    private navParams: NavParams,
    private viewCntrl: ViewController
  ) {
    console.log('Hello GenericMenuPopOverComponent Component');
    this.text = 'Hello World';
    this.showAbout = this.navParams.get('showAbout')
    this.showEdit = this.navParams.get('showEdit')
    this.assessmentIndex = this.navParams.get('assessmentIndex')
    this.assessmentName = this.navParams.get('assessmentName');
    this.isObservation = this.navParams.get('isObservation');
  }
  goToAbout() {
    this.appCtrl.getRootNav().push(AssessmentAboutPage, { assessmentIndex: this.assessmentIndex, assessmentName: this.assessmentName, isObservation: this.isObservation})
    this.viewCntrl.dismiss();

  }
  goToEdit() {
    this.appCtrl.getRootNav().push(ObservationEditPage, { assessmentIndex: this.assessmentIndex, assessmentName: this.assessmentName })
    this.viewCntrl.dismiss();
  }
}
