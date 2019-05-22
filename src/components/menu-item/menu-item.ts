import { Component } from '@angular/core';
import { NavParams, App, ViewController, Events , ModalController} from 'ionic-angular';
import { RatingProvider } from '../../providers/rating/rating';
import { UtilsProvider } from '../../providers/utils/utils';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { RegistryFormPage } from '../../pages/registry-form/registry-form';
import { UpdateLocalSchoolDataProvider } from '../../providers/update-local-school-data/update-local-school-data';
import { FeedbackPage } from '../../pages/feedback/feedback';

@Component({
  selector: 'menu-item',
  templateUrl: 'menu-item.html'
})
export class MenuItemComponent {

  submissionId: any;
  schoolId: string;
  schoolName: string;
  parent: any;
  networkAvailable: boolean;
  subscription: any;
  programId: string;
  hideTeacherRegistry = true;
  hideLeaderRegistry=true;
  hideFeedback= true;
  showMenuIcon = true;
  constructor(private navParams: NavParams, private ratingService: RatingProvider,
    private appCtrl: App, private viewCtrl: ViewController, private utils: UtilsProvider,
    private events: Events, private ngps: NetworkGpsProvider, private modalCntrl: ModalController,
    private usld: UpdateLocalSchoolDataProvider) {
    console.log('Hello MenuItemComponent Component');
    this.submissionId = this.navParams.get('submissionId');
    this.schoolId = this.navParams.get('_id');
    this.schoolName = this.navParams.get('name');
    this.hideTeacherRegistry = this.navParams.get('hideTeacherRegistry');
    this.hideLeaderRegistry=this.navParams.get('hideLeaderRegistry');
    this.hideFeedback= this.navParams.get('hideFeedback');
    // this.showMenuIcon = this.navParams.get('showMenuIcon');
    // this.parent = this.navParams.get("parent");
    this.programId = this.navParams.get("programId")
    this.subscription = this.events.subscribe('network:offline', () => {
      this.utils.openToast("Network disconnected");
      this.networkAvailable = false;
    });

    // Online event
    const onine = this.events.subscribe('network:online', () => {
      this.utils.openToast("Network connected");
      this.networkAvailable = true;
    });

    this.networkAvailable = this.ngps.getNetworkStatus();
  }

  goToFlaggin(): void {
    const school = {
      _id: this.schoolId,
      name: this.schoolName
    }
    // const submissionId = this.schoolDetails[school._id]['assessments'][0].submissionId;
    if (!this.networkAvailable) {
      this.utils.openToast("Please enable your internet connection to continue.", "Ok");
    } else {
      this.ratingService.fetchRatedQuestions(this.submissionId, school);
    }
    this.close();
  }

  goToRating(): void {
    const school = {
      _id: this.schoolId,
      name: this.schoolName
    }
    if (!this.networkAvailable) {
      this.utils.openToast("Please enable your internet connection to continue.", "Ok");
    } else {
      this.ratingService.checkForRatingDetails(this.submissionId, school);
    }
    this.close();
  }

  goToProfile(): void {
    this.appCtrl.getRootNav().push('EntityProfilePage', {
      _id: this.schoolId,
      name: this.schoolName,
      // parent: this.parent
    })
    this.close();
  }

  goToRegistry(registryType): void {
    this.appCtrl.getRootNav().push('ParentsListPage', {
      _id: this.schoolId,
      name: this.schoolName,
      registry: registryType
    })
    this.close();
  }

  close() {
    this.viewCtrl.dismiss();
  }

  refreshSchoolData(): void {
    const schoolData = {
      _id: this.schoolId,
      name: this.schoolName,
    };
    this.usld.getLocalData(schoolData);
    this.close();
  }

  addParent(): void {
    const params = {
      _id: this.schoolId,
      name: this.schoolName,
    }
    let parentForm = this.modalCntrl.create(RegistryFormPage, params);
    // parentForm.onDidDismiss(data => {
    //   if (data) {
    //     data.programId = this.schoolDetails['program']._id;
    //     data.schoolId = this.schoolId;
    //     data.schoolName = this.schoolName;
    //     this.parentInfoList.push(data)
    //     this.storage.set('ParentInfo', this.parentInfoList);
    //   }

    // })
    parentForm.present();
    this.close();
  }

  feedback(): void {
    const params = {
      schoolId: this.schoolId,
      schoolName: this.schoolName,
      programId: this.programId,
      submissionId: this.submissionId
    }
    let feedbackModal = this.modalCntrl.create(FeedbackPage, params);
    feedbackModal.present();
    this.close();

  }
}
