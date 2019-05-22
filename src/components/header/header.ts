import { Component, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { NetworkGpsProvider } from '../../providers/network-gps/network-gps';
import { FeedbackProvider } from '../../providers/feedback/feedback';
import { Events, ModalController, ViewController } from 'ionic-angular';
import { QuestionDashboardPage } from '../../pages/question-dashboard/question-dashboard';

@Component({
  selector: 'header',
  templateUrl: 'header.html'
})
export class HeaderComponent implements OnDestroy{
  @Input() title: string;
  @Input() showMenu :boolean = true;
  @Input() showLogout: boolean;
  @Input() hideBack: boolean; 
  @Input() dashbordData: any;
  @Input() enableDashboard: boolean;
  @Input() disableNetwork: boolean;
  @Input() showClose: boolean;
  @Output() onDashboardOpen = new EventEmitter();
  
  text: string;
  networkSubscription: any;
  networkAvailable: boolean;
  subscription: any;
  dashboardModal: any;

  constructor(private ngps: NetworkGpsProvider, 
    private feedbackService: FeedbackProvider, 
    private events: Events,
    private modalcntrl: ModalController,
    private viewCtrl: ViewController) {

    this.subscription = this.events.subscribe('network:offline', () => {
      // this.utils.openToast("Network disconnected");
      this.networkAvailable = false;
    });

    // Online event
    const onine = this.events.subscribe('network:online', () => {
      // this.utils.openToast("Network connected");
      this.networkAvailable = true;
    });

    this.networkAvailable = this.ngps.getNetworkStatus();
    
  }

  ngOnDestroy() {
    if(this.subscription){
      this.subscription.unsubscribe();
    }
  }

  feedback(): void {
    this.feedbackService.sendFeedback();
  }

  openDashboard(): void {
    this.dashboardModal = this.modalcntrl.create(QuestionDashboardPage, {"questions":this.dashbordData});
    this.onDashboardOpen.emit(this.dashboardModal);
    this.dashboardModal.present();
  }

  closeDashboard() {
    this.viewCtrl.dismiss();
  }

}
