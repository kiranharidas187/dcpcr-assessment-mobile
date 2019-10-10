import { Component, ViewChild, OnInit } from '@angular/core';
import { Platform, AlertController, Nav, App, MenuController, Events } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { CurrentUserProvider } from '../providers/current-user/current-user';
import { WelcomePage } from '../pages/welcome/welcome';
import { TranslateService } from '@ngx-translate/core';
import { Network } from '@ionic-native/network';
import { NetworkGpsProvider } from '../providers/network-gps/network-gps';
import { HomePage } from '../pages/home/home';
import { AppConfigs } from '../providers/appConfig';
import { InstitutionsEntityList } from '../pages/institutions-entity-list/institutions-entity-list';
import { FaqPage } from '../pages/faq/faq';
import { AboutPage } from '../pages/about/about';
import { IndividualListingPage } from '../pages/individual-listing/individual-listing';
import { UtilsProvider } from '../providers/utils/utils';
import { ObservationsPage } from '../pages/observations/observations';
import { Deeplinks } from '@ionic-native/deeplinks';
import { IonicApp } from 'ionic-angular';
import { ApiProvider } from '../providers/api/api';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { RoleListingPage } from '../pages/role-listing/role-listing';
import { ReportEntityListingPage } from '../pages/report-entity-listing/report-entity-listing';
import * as Highcharts from 'highcharts';


@Component({
  templateUrl: 'app.html'

})
export class MyApp {

  @ViewChild(Nav) nav: Nav;
  rootPage: any;
  isAlertPresent: boolean = false;
  networkSubscription: any;
  networkAvailable: boolean;
  appName: string = AppConfigs.appName;
  appVersion = AppConfigs.appVersion;
  appEnvironment = AppConfigs.environment;
  // rootPage: any = "LoginPage";
  allPages: Array<Object> = [
    {
      name: "home",
      icon: "home",
      component: HomePage,
      active: true
    },
    {
      name: "institutional",
      icon: "book",
      component: InstitutionsEntityList,
      active: false
    },
    {
      name: "individual",
      icon: "person",
      component: IndividualListingPage,
      active: false
    },
    {
      name: "observations",
      icon: "eye",
      component: ObservationsPage,
      active: false
    },
    {
      name: "faqs",
      icon: "help",
      // component: FaqPage,
      externalLink: true,
      active: false
    },
    {
      name: "about",
      icon: "information-circle",
      component: AboutPage,
      active: false
    }
  ]
  profileRoles = [];
  currentPage;
  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private currentUser: CurrentUserProvider,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private network: Network,
    private events: Events,
    private ionicApp: IonicApp,
    private currentUserProvider: CurrentUserProvider,
    private apiProvider: ApiProvider,
    private networkGpsProvider: NetworkGpsProvider,
    private menuCntrl: MenuController,
    private deepLinks: Deeplinks,
    private utils: UtilsProvider,
    private localStorageProvider: LocalStorageProvider
  ) {








    this.events.subscribe('navigateTab', data => {
      console.log(data);
      let index: number = this.findIndex(data);
      this.goToPage(index);
    })
    this.events.subscribe('multipleRole', data => {
      if (data) {

        this.allPages.splice(this.allPages.length - 2, 0, {
          name: "dashboard",
          icon: "analytics",
          component: RoleListingPage,
          extenalLink: false,
          active: false
        })
      }
    });
    this.events.subscribe('loginSuccess', data => {
      if (data == true) {
        // this.goToPage(0);
        for (const page of this.allPages) {
          page['active'] = false;
        }
        this.allPages[0]['active'] = true;

      }
    })

    platform.ready().then(() => {
      Highcharts.setOptions({
        colors: ['#D35400','#F1C40F', '#3498DB', '#8E44AD', '#154360', '#145A32']
      })

      // this.goToPage(0);
      // console.log("go to page")

      // this.currentPage = this.nav.getActive();
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.initilaizeApp();
      this.networkGpsProvider.initializeNetworkEvents();
      this.registerBAckButtonAction();
      this.initTranslate();
      // this.networkListenerInitialize();
      // Offline event
      // this.events.subscribe('network:offline', () => {
      //   alert('network:offline ==> ' + this.network.type);
      // });

      // // Online event
      // this.events.subscribe('network:online', () => {
      //   alert('network:online ==> ' + this.network.type);
      // });

    });

  }
  // ionViewDidLoad() {
  //   console.log("fired")
  //   this.allPages.forEach((page,index) =>{
  //     this.allPages[index]['active'] = page['name'] == 'home' ? true : false;
  //   })
  // }
  // ionViewDidLoad(){
  //   this.localStorageProvider.getLocalStorage('profileRole').then( roles => {
  //     this.profileRoles = roles;
  //     console.log(JSON.stringify(roles))
  //     this.getRoles();

  //   }).catch( error =>{
  //     this.getRoles();
  //     console.log("called get roles")
  //   })
  // }
  // getRoles() {
  //  console.log("i m here")
  //   let currentUser =   this.currentUserProvider.getCurrentUserData();
  //  console.log(JSON.stringify(currentUser) + "usr details")
  //   // this.apiProvider.httpGet(AppConfigs.roles.getProfile+currentUser.sub,success =>{
  //   //   this.profileRoles = success.result;
  //   //   console.log(JSON.stringify(success))
  //   //   this.localStorageProvider.setLocalStorage('profileRole',success.result);
  //   // },error =>{
  //   //   this.utils.openToast(error);
  //   // })  
  //   console.log("func end");
  // }

  ionViewWillLeave() {
    if (this.networkSubscription) {
      this.networkSubscription.unsubscribe();
    }
  }

  goToPage(index) {
    // if ( this.allPages[index]['name'] != 'home'){
    this.menuCntrl.close();
    if (this.allPages[index]["externalLink"]) {
      this.utils.openExternalLinkOnBrowser(AppConfigs.externalLinks.faq)
    } else {
      for (const page of this.allPages) {
        page['active'] = false;
      }
      this.allPages[0]['active'] = true;
      if (this.allPages[index]['name'] === 'dashboard') {
        this.localStorageProvider.getLocalStorage('profileRole').then(success => {
          // this.roles = success.result.roles;
          success.roles.length === 1 ?
            this.nav.push(ReportEntityListingPage, { "currentEntityType": success.roles[0].immediateSubEntityType, "data": success.roles[0].entities, "entityType": success.roles[0].entities[0].immediateSubEntityType })
            :
            this.nav.push(this.allPages[index]['component']);

        }).catch(error => {
        });
      }
      else {
        if (this.allPages[index]['name'] !== 'home') {
          this.nav.push(this.allPages[index]['component']);

        }
      }
      // this.utils.setAssessmentLocalStorageKey(this.allPages[index]['name'] === "individual" ? "assessmentDetails_" : "schoolDetails_")
      //     }
      //   }
      // else{
      //   this.menuCntrl.close();
    }
  }

  initTranslate() {
    this.translate.setDefaultLang('en');
  }

  networkListenerInitialize(): void {
    console.log("network listener")

    console.log("Network type " + this.network.type)
    this.networkSubscription = this.network.onDisconnect().subscribe(() => {
      this.networkAvailable = false;
      this.networkGpsProvider.setNetworkStatus(this.networkAvailable);
    });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.networkAvailable = true;
      this.networkGpsProvider.setNetworkStatus(this.networkAvailable);
    });

    this.networkSubscription.add(connectSubscription);

    this.networkAvailable = this.network.type !== 'none' ? true : false;
    this.networkGpsProvider.setNetworkStatus(this.networkAvailable);
  }

  initilaizeApp(): void {
    this.statusBar.styleDefault();
    this.statusBar.overlaysWebView(false);
    this.currentUser.checkForTokens().then(response => {
      this.rootPage = WelcomePage;
      if (response.isDeactivated) {
        this.rootPage = WelcomePage;
        this.allPages[0]['active'] = true;
        for (const page of this.allPages) {
          page['active'] = false;
        }
        this.splashScreen.hide()
      } else {
        this.rootPage = HomePage;
        for (const page of this.allPages) {
          page['active'] = false;
        }
        this.allPages[0]['active'] = true;
        const paths = {
          '/about-us': AboutPage,
          '/home': HomePage,
          '/individual': IndividualListingPage,
          '/institutional': InstitutionsEntityList,
          '/faq': FaqPage,
        }
        this.deepLinks.route(paths).subscribe(match => {
          this.rootPage = paths[match['$link']['path']];
          console.log(JSON.stringify(match))
          console.log('Successfully matched route', match);
        }, nomatch => {
          console.log(JSON.stringify(nomatch))
          console.error('Got a deeplink that didn\'t match', nomatch);
        });
      }

    }).catch(error => {
      this.rootPage = WelcomePage;
      // this.splashScreen.hide()
      // this.statusBar.overlaysWebView(false);

    })
    // this.statusBar.hide();
    // this.statusBar.overlaysWebView(false);

  }

  registerBAckButtonAction(): void {
    this.platform.registerBackButtonAction(() => {
      let ready = true;
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
        this.ionicApp._modalPortal.getActive() ||
        this.ionicApp._toastPortal.getActive() ||
        this.ionicApp._overlayPortal.getActive();

      if (activePortal) {
        ready = false;
        activePortal.dismiss();
        activePortal.onDidDismiss(() => { ready = true; });
        return;
      }
      let alert;
      // this.nav.indexOf('WelcomePage')
      // console.log("hiii "+ JSON.stringify(this.nav.getByIndex(0)))
      if (this.nav.length() > 1) {
        this.nav.pop();
      } else {
        if (!this.isAlertPresent) {
          this.isAlertPresent = true;
          alert = this.alertCtrl.create({
            title: 'App termination',
            message: 'Do you want to close the app?',
            enableBackdropDismiss: false,
            buttons: [{
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Application exit prevented!');
                this.isAlertPresent = false;
              }
            }, {
              text: 'Close App',
              handler: () => {
                this.platform.exitApp(); // Close this application
              }
            }]
          });
          alert.present()
        }
      }
    })
  }
  findIndex(componentName) {
    let currentIndex;
    this.allPages.forEach((page, index) => {
      if (componentName == page['name']) {
        currentIndex = index;
      }
    });
    return currentIndex;
  }

}