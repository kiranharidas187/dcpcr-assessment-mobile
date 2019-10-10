import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AssessmentAboutPage } from '../../pages/assessment-about/assessment-about';
import { EntityListingPage } from '../../pages/entity-listing/entity-listing';

/**
 * Generated class for the ProgramListingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */


@Component({
  selector: 'program-listing',
  templateUrl: 'program-listing.html'
})
export class ProgramListingComponent {

  @Input() programList;
  @Input() entityType;
  @Input() assessmentlocalStorageName;

  @Input() showMenu = true;
  @Output() getAssessmentDetailsEvent = new EventEmitter();
  @Output() openMenuEvent = new EventEmitter();
  @Input() enableAddRemoveEntityButton = false;
  @Input() homePage: boolean = false;
  text: string;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {

  }



  openAbout(index) {
    this.navCtrl.push(AssessmentAboutPage, { assessmentIndex: index, assessmentName: this.entityType + "List", programIndex: index, programs: this.programList, assessmentType: this.entityType, isObservation: false })
  }
  goToEntityFunc(programIndex) {
    this.navCtrl.push(EntityListingPage, { programIndex: programIndex, programs: this.programList, assessmentType: this.entityType })

  }

}
