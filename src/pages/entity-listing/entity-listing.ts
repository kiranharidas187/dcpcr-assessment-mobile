import { Component, EventEmitter, Output } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AssessmentServiceProvider } from '../../providers/assessment-service/assessment-service';

/**
 * Generated class for the EntityListingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-entity-listing',
  templateUrl: 'entity-listing.html',
})
export class EntityListingPage {
  entityList: any;
  programs ;
  @Output() assessmentDetailsEvent = new EventEmitter;
  programList: any;
  programIndex: any;
  pro: any;
  assessmentType: any;
  constructor(public navCtrl: NavController, public navParams: NavParams , private assessmentService : AssessmentServiceProvider) {
    this.programList = this.navParams.get('programs');
    this.programIndex = this.navParams.get('programIndex');
    this.assessmentType = this.navParams.get('assessmentType');
    this.entityList = [this.programList[this.programIndex]]
    // console.log(JSON.stringify(this.programList))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EntityListingPage');
  }
 
    getAssessmentDetails(event) {
      event.programIndex = this.programIndex;
       this.assessmentService.getAssessmentDetails(event, this.programList, this.assessmentType).then(program => {
      this.entityList = [program[this.navParams.get('programIndex')]];
    }).catch(error => {

    })
    // this.assessmentDetailsEvent.emit(event)
  }
  openMenu(event) {
    console.log("called")
    event.programIndex = this.programIndex
    this.assessmentService.openMenu(event,this.programList,true);
  }
  
}
