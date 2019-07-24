import { Component, ViewChild, ElementRef, ɵConsole, ViewChildren, QueryList, AfterViewInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, Config, Events } from 'ionic-angular';
import { FormGroup, Validators } from '@angular/forms';
import { ApiProvider } from '../../../providers/api/api';
import { UtilsProvider } from '../../../providers/utils/utils';
import { SolutionDetailsPage } from '../../solution-details/solution-details';
import { NetworkGpsProvider } from '../../../providers/network-gps/network-gps';
import { LocalStorageProvider } from '../../../providers/local-storage/local-storage';
import { Diagnostic } from '@ionic-native/diagnostic';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Storage } from '@ionic/storage';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { AppConfigs } from '../../../providers/appConfig';
import { TranslateService } from '@ngx-translate/core';
import { DynamicFormComponent } from '../../../components/dynamic-form/dynamic-form';

/**
 * Generated class for the AddObservationFormPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
export interface draftData {

}
@IonicPage()
@Component({
  selector: 'page-add-observation-form',
  templateUrl: 'add-observation-form.html',
})
export class AddObservationFormPage  implements AfterViewInit{
  addObservationData;
  addObservationForm: FormGroup;
  selectedFrameWork;
  selectedSchools = [];

  index = 0;
  @ViewChild('stepper') stepper1: ElementRef;
  listOfSolution;
  selectedIndex: any = 0;
  entityTypeData: any;
  entityTypeForm: any;
  currentLocation: any;
  obsData: any;
  entityType: any;
  saveDraftType: string = 'force';
  editData: any;
  editDataIndex: any;
  searchSolutionUrl: string = "";
  solutionLimit: number = 100;
  solutionPage: number = 1;
  totalCount: number = 0;

  @ViewChildren(DynamicFormComponent) childrenComponent: QueryList<DynamicFormComponent>;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private permissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    public apiProviders: ApiProvider,
    private diagnostic: Diagnostic,
    public utils: UtilsProvider,
    private modalCtrl: ModalController,
    private networkGps: NetworkGpsProvider,
    private localStorage: LocalStorageProvider,
    private app: App,
    public translate : TranslateService,
    private storage: Storage,
    private event: Events
  ) {
    this.editData = this.navParams.get('data');
    this.editDataIndex = this.navParams.get('index');


  }
  public ngAfterViewInit(): void
  {
    this.childrenComponent.changes.subscribe((comps: QueryList<DynamicFormComponent>) =>
    {
      // Now you can access to the child component
      console.log(JSON.stringify(comps.toArray()))
      console.log("CHILDREN start")
      let jokes: DynamicFormComponent[] = this.childrenComponent.toArray(); 
      // JSON.stringify( jokes, function( key, value) {
      
      //   return value;
      // })
      // this.childrenComponent['remarkInput']

      console.log(JSON.stringify(jokes))
      console.log("CHILDREN end")
      
      if(jokes[0].){

      }
      //  jokes[0].remarkInput.setFocus();

    });
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad AddObservationPage');
    this.utils.startLoader();
    this.apiProviders.httpGet(AppConfigs.cro.getEntityListType, success => {
      this.entityTypeData = success.result;
      if (this.editData) {
        this.entityType = this.editData.data.entityId;
      }
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    });
  }

  selectChange(e) {
    this.selectedIndex = e;
  }

  getLocation() {
    this.utils.startLoader();
    const options = {
      timeout: 2000
    }
    this.permissions.checkPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {
        if (!result.hasPermission) {
          this.permissions.requestPermission(this.permissions.PERMISSION.ACCESS_FINE_LOCATION).then(result => {
            if (result.hasPermission) {
              this.locationAccuracy.canRequest().then((canRequest: boolean) => {
                if (canRequest) {
                  this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                    () => {
                      this.geolocation.getCurrentPosition(options).then((resp) => {
                        this.currentLocation = resp.coords.latitude + "," + resp.coords.longitude;
                      }).catch((error) => {
                        this.storage.get('gpsLocation').then(success => {
                          this.currentLocation = success

                        }).catch(error => {

                        })
                      });
                    }).catch(
                      error => {
                        this.translate.get('toastMessage.locationForAction').subscribe(translations =>{
                          this.utils.openToast( translations);
                        })
                        this.utils.stopLoader();
                      }
                    );
                } else {
                  this.geolocation.getCurrentPosition(options).then((resp) => {
                    this.currentLocation = resp.coords.latitude + "," + resp.coords.longitude;
                  }).catch((error) => {
                    this.storage.get('gpsLocation').then(success => {
                      this.currentLocation = success

                    }).catch(error => {

                    })
                  });
                  // })
                }

              });
            }
          }).catch(error => {
          })
        } else {
          this.locationAccuracy.canRequest().then((canRequest: boolean) => {
            if (canRequest) {
              this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(
                () => {
                  this.geolocation.getCurrentPosition(options).then((resp) => {
                    this.currentLocation = resp.coords.latitude + "," + resp.coords.longitude;
                    this.storage.set('currentLocation', this.currentLocation)
                  }).catch((error) => {
                    this.storage.get('gpsLocation').then(success => {
                      this.currentLocation = success

                    }).catch(error => {

                    })
                  });
                }).catch(
                  error => {
                    this.translate.get('toastMessage.locationForAction').subscribe(translations =>{
                      this.utils.openToast( translations);
                    })
                  }
                );
            } else {
              this.geolocation.getCurrentPosition(options).then((resp) => {
                this.currentLocation = resp.coords.latitude + "," + resp.coords.longitude;
                this.storage.set('currentLocation', this.currentLocation)
              }).catch((error) => {
                this.storage.get('gpsLocation').then(success => {
                  this.currentLocation = success
                }).catch(error => {
                })
              });
            }

          });
        }
      }).catch(error => {
      });
    this.utils.stopLoader();
  }

  addObservation() {
    this.app.getRootNav().pop();
  }

  selectSolution(frameWork) {
    this.selectedFrameWork = frameWork;
  }

  showDetails(frameWork) {
    let contactModal = this.modalCtrl.create(SolutionDetailsPage, { data: frameWork });
    contactModal.present();
  }

  getSolutionList(event ? ) {
    let solutionFlag = false;
    event ? this.solutionPage ++ : this.solutionPage ;
    this.utils.startLoader();
    this.apiProviders.httpGet(AppConfigs.cro.getSolutionAccordingToType + this.entityType + "?search="+this.searchSolutionUrl+"&limit="+this.solutionLimit+"&page="+this.solutionPage, success => {
      // console.log(JSON.stringify(success.result[0].data))
      // this.listOfSolution = event ? [...this.listOfSolution ,...success.result[0].data] :[...success.result[0].data];
      // this.totalCount = success.result[0].count;
      // console.log(JSON.stringify(this.listOfSolution))
      // if (this.editData && this.editData.data.solutionId) {
      //   this.listOfSolution.forEach(element => {
      //     if (element._id === this.editData.data.solutionId)
      //       this.selectedFrameWork = element._id;
      //   });
      // }


      this.listOfSolution = event ? [...this.listOfSolution ,...success.result] :[...success.result];
      // this.totalCount = success.result[0].count;
      console.log(JSON.stringify(this.listOfSolution))
      if (this.editData && this.editData.data.solutionId) {
        this.listOfSolution.forEach(element => {
          if (element._id === this.editData.data.solutionId)
            this.selectedFrameWork = element._id;
        });
      }
      solutionFlag = true;
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    });
    return solutionFlag;
  }

  getObservationMetaForm() {
    this.utils.startLoader();
    this.apiProviders.httpGet(AppConfigs.cro.getCreateObservationMeta + this.selectedFrameWork, success => {
      this.addObservationData = success.result;
      if (this.editData) {
        this.addObservationData.forEach(element => {
          element.value = this.editData.data[element.field];
          if (element.field === 'status') {
            element.value = 'draft';
          }
        });

      }
      this.addObservationForm = this.utils.createFormGroup(this.addObservationData);
      this.utils.stopLoader();
    }, error => {
      this.utils.stopLoader();
    });
    return (this.addObservationForm && this.currentLocation) ? true : false;
  }

  doAction() {
    let actionFlag = false;
    switch (this.selectedIndex) {
      case 0:
        actionFlag = this.entityType ? this.getSolutionList() : false;
        break;
      case 1:
        actionFlag = this.selectedFrameWork ? this.getObservationMetaForm() : false;
        break;

    }
    return actionFlag;
  }
  doInfinite(infiniteScroll) {
    console.log("doInfinite function called");
    setTimeout(() => {
      this.getSolutionList('infiniteScroll')
      infiniteScroll.complete();
    }, 500);
  }
  searchSolution(event){
    if(!event.value){
      // this.listOfSolution = [];
      this.clearSolution();
      return
    }
    if(!event.value || event.value.length < 3){
        return;
    }
    this.searchSolutionUrl = event.value;
    this.getSolutionList();
     
    // console.log("search entity called")
    // console.log(event.value);
    // this.searchUrl.emit(event.value)
    // this.filterSelected();
  }
  clearSolution(){
    // this.listOfSolution = []
    this.searchSolutionUrl ="";
    this.getSolutionList();
  }
  tmpFunc() { 
    let message ; 
     this.selectedIndex === 0 ? this.translate.get('toastMessage.selectObservationType').subscribe(translations => {
      //  console.log(JSON.stringify(translations))
      message = translations;
     })

    : this.translate.get('toastMessage.selectSolution').subscribe(translations => {
      
      message = translations;


    }) ;

    
     this.utils.openToast(message) 
  }

  saveDraft(option = 'normal') {
    if (this.entityType) {
      let obsData: {} = {
        data: {}
      };
      obsData['data'] = this.creatPayLoad('draft');
      obsData['data']['isComplete'] = this.addObservationForm ? this.addObservationForm.valid ? true : false : false;
      this.localStorage.getLocalStorage('draftObservation').then(draftObs => {
        let draft = draftObs;
        this.editDataIndex >= 0 ? draft[this.editDataIndex] = obsData : draft.push(obsData);
        this.localStorage.setLocalStorage('draftObservation', draft);
        option == 'normal' ? this.navCtrl.pop() : this.event.publish('draftObservationArrayReload');

      }).catch(() => {
        this.localStorage.setLocalStorage('draftObservation', [obsData]);
        option == 'normal' ? this.navCtrl.pop() : this.event.publish('draftObservationArrayReload');
      })


    }

  }

  creatPayLoad(type = 'publish') {
    let payLoad = this.addObservationForm ? this.addObservationForm.getRawValue() : {};
    if (type === 'draft') {
      payLoad['isComplete'] = false;
      payLoad['solutionId'] = this.selectedFrameWork ? this.selectedFrameWork : null;
      payLoad['entityId'] = this.entityType ? this.entityType : null;
    }
    return payLoad;
  }


  ionViewWillUnload() {
    if (this.saveDraftType !== 'normal')
      this.saveDraft('force');
  }

}
