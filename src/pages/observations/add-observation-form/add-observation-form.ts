import { Component, ViewChild, ElementRef, ɵConsole } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, App, Config, Events, AlertController } from 'ionic-angular';
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
export class AddObservationFormPage {
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
  ObservationFromTitle: any;
  ObservationFromDescription: any;
  entityList: any;
  entityListPage = 1;
  entityListLimit = 50;
  entityListTotalCount: any;
  searchEntity: string = "";
  entityCount: any;
  isPublished: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private translate: TranslateService,

    private permissions: AndroidPermissions,
    private locationAccuracy: LocationAccuracy,
    private geolocation: Geolocation,
    public apiProviders: ApiProvider,
    private diagnostic: Diagnostic,
    public utils: UtilsProvider,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private localStorage: LocalStorageProvider,
    private app: App,
    private storage: Storage,
    private event: Events
  ) {
    this.editData = this.navParams.get('data');
    this.editDataIndex = this.navParams.get('index');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddObservationPage');
    this.getSolutionList()

    // this.utils.startLoader();
    // this.apiProviders.httpGet(AppConfigs.cro.getEntityListType, success => {
    //   this.entityTypeData = success.result;
    //   console.log(JSON.stringify(this.entityTypeData))

    //   if (this.editData) {
    //     this.entityType = this.editData.data.entityId;
    //   }
    //   else{
    //     this.entityTypeData.forEach((element,index) => {
    //       if(element.name ==="schoolLeader"){
    //     this.entityType = element._id;
    //       }
    //     });
    //   }
    //   console.log(JSON.stringify(this.entityTypeData))
      // this.getSolutionList()
    //   this.utils.stopLoader();
    // }, error => {
    //   this.utils.stopLoader();
    // });
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
                    })                  }
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
    console.log("solution select")
    this.selectedFrameWork = frameWork._id;
    this.ObservationFromTitle = frameWork.name;
    this.ObservationFromDescription = frameWork.description
    if( this.editData && (this.editData.data.solutionId !== frameWork._id || this.selectedFrameWork == this.editData.data.solutionId)){
      this.editData.data.name = frameWork.name;
      this.editData.data.description = frameWork.description;
      console.log("changed sol")
    }
  }

  showDetails(frameWork) {
    let contactModal = this.modalCtrl.create(SolutionDetailsPage, { data: frameWork });
    contactModal.present();
  }

  getSolutionList(event ? ) {
    let solutionFlag = false;
    event ? this.solutionPage ++ : this.solutionPage ;
    this.utils.startLoader();
    // this.apiProviders.httpGet(AppConfigs.cro.getSolutionAccordingToType + this.entityType + "?search="+this.searchSolutionUrl+"&limit="+this.solutionLimit+"&page="+this.solutionPage, success => {
    this.apiProviders.httpGet(AppConfigs.cro.getSolutionAccordingToType + "?search="+this.searchSolutionUrl+"&limit="+this.solutionLimit+"&page="+this.solutionPage, success => {
    // console.log(JSON.stringify(success.result))
      // this.listOfSolution = event ? [...this.listOfSolution ,...success.result] :[...success.result];
      // // this.totalCount = success.result[0].count;
      // console.log(JSON.stringify(this.listOfSolution))
      // if (this.editData && this.editData.data.solutionId) {
      //   this.listOfSolution.forEach(element => {
      //     if (element._id === this.editData.data.solutionId)
      //       this.selectedFrameWork = element._id;
      //   });
      // }
      console.log(JSON.stringify(success.result[0].data))
      this.listOfSolution = event ? [...this.listOfSolution ,...success.result[0].data] :[...success.result[0].data];
      this.totalCount = success.result[0].count;
      console.log(JSON.stringify(this.listOfSolution))
      if (this.editData && this.editData.data.solutionId) {
        this.listOfSolution.forEach(element => {
          if (element._id === this.editData.data.solutionId)
            this.selectedFrameWork = element._id;
            this.ObservationFromTitle = element.name;
            this.ObservationFromDescription = element.description;
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
      console.log(JSON.stringify(this.addObservationData))
      if (this.editData) { 
        if((! this.editData.data.name ||! this.editData.data.description)  && this.editData.data.solutionId){
          this.addObservationData.forEach(element => {
          if (element.field == 'name') 
            element.value = this.ObservationFromTitle;
          if (element.field == 'description')
            element.value = this.ObservationFromDescription;
        });
        }else{
          this.addObservationData.forEach(element => {
          element.value = this.editData.data[element.field];
          if (element.field === 'status') {
            element.value = 'draft';
          }
        });
        }
      }else{
        this.addObservationData.forEach(element => {
          switch(element.field){
            case "name" : element.value = this.ObservationFromTitle;
                          break;
            case "description" : element.value = this.ObservationFromDescription;
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
      // case 0:
      //   actionFlag = this.entityType ? this.getSolutionList() : false;
      //   break;
      // case 1:
      //   actionFlag = this.selectedFrameWork ? this.getObservationMetaForm() : false;
      //   break;
      case 0:
        actionFlag = this.selectedFrameWork ? this.getObservationMetaForm() : false;        break;
      case 1:
         actionFlag = this.addObservationForm.valid ? this.getEntityList() : false;
        // actionFlag = true;
        

        break;
    }
    // this.selectedIndex === 0 ? 
    // actionFlag ? null :  this.utils.openToast("select the type of observation") 
    // : 
    // this.selectedIndex === 1 ? actionFlag ? null :  this.utils.openToast("select a solution") : null

    return actionFlag;
  }
  getEntityList(event ?) {
    event ? this.entityListPage ++ : this.entityListPage ;

    this.apiProviders.httpGet(AppConfigs.cro.searchEntity+'?solutionId='+this.selectedFrameWork+"&search="+this.searchEntity+"&page="+this.entityListPage+"&limit="+this.entityListLimit,success =>{
      this.entityListTotalCount = success.result[0].count;
      if(this.editData && this.editData.data.entities.length == 0 ){
          success.result[0].data.forEach(element => {
            element["selected"]= false;
          });
        }else if(this.editData && this.editData.data.entities.length == 0 ) {
          success.result[0].data.forEach(element => {
            
            element["selected"] = this.editData.data.entities.includes(element._id) > -1 ? true : false;
          });
        }else{
          success.result[0].data.forEach(element => {
            element["selected"]= true;
          });
        }
    this.entityList = success.result[0].data;
    this.entityCount = 0;
    this.entityList.forEach(element => {
      element.selected ? this.entityCount++ : this.entityCount
    });
    console.log(JSON.stringify(success))
    },error =>{

    },{version:"v2" , dhiti : false});
    return true;
  }
  doInfinite(infiniteScroll,type = 'solutions') {
    console.log("doInfinite function called");
    setTimeout(() => {
      type == 'solutions' ? this.getSolutionList('infiniteScroll') : this.getEntityList('infiniteScroll')
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

  searchEntities(event){
    if(!event.value){
      // this.listOfSolution = [];
      this.clearSolution();
      return
    }
    if(!event.value || event.value.length < 3){
        return;
    }
    this.searchEntity = event.value;
    this.getEntityList();
     
    // console.log("search entity called")
    // console.log(event.value);
    // this.searchUrl.emit(event.value)
    // this.filterSelected();
  }
  clearEntity(){
    // this.listOfSolution = []
    this.searchEntity ="";
    this.getEntityList();
  }
  tmpFunc() { 
    let message ; 
     this.selectedIndex === 0 ? this.translate.get('toastMessage.selectSolution').subscribe(translations => {
      //  console.log(JSON.stringify(translations))
      message = translations;
     })

    : this.translate.get('toastMessage.allValueAreMandatory').subscribe(translations => {
      
      message = translations;
     });
     this.utils.openToast(message) ;

  }

  saveDraft(option = 'normal') {
    if (this.selectedFrameWork) {
      let obsData: {} = {
        data: {}
      };
      // obsData['data']['entities'] = [];
      obsData['data'] = this.creatPayLoad('draft');
      obsData['data']['isComplete'] = this.addObservationForm && obsData['data']['entities'].length > 0 ?(this.addObservationForm && this.addObservationForm.valid)? true : false : false;
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
    payLoad['entities'] = ( this.addObservationForm && this.addObservationForm.valid )?   this.getSelectedEntities() : [];
    if (type === 'draft') {
      payLoad['isComplete'] = false;
      payLoad['solutionId'] = this.selectedFrameWork ? this.selectedFrameWork : null;
      // payLoad['entityId'] = this.entityType ? this.entityType : null;
    }
    return payLoad;
  }
  getSelectedEntities(): any {
    let entityIdList = []
    if(this.entityList){
    this.entityList.forEach(entity => {
      entity.selected ? entityIdList.push(entity._id) : null;
    });
  }

    return entityIdList;
  }


  ionViewWillUnload() {
    if (this.saveDraftType !== 'normal' && !this.isPublished)
        this.editData ?  null : this.saveDraft('force');
  }

  publishObservation(){
   let obj = {
      data :{}
    }
    let observation = {
      data:{}
    }
    observation['data'] = this.creatPayLoad('draft');
    obj['data']['status'] = 'published';
    obj['data']['startDate'] = observation.data['startDate'];
    obj['data']['endDate'] = observation.data['endDate'];
    obj['data']['name'] = observation.data['name'];
    obj['data']['description'] = observation.data['description'];
    obj['data']['entities'] = observation.data['entities'];

    console.log(JSON.stringify(obj));
    this.apiProviders.httpPost(AppConfigs.cro.createObservation + observation.data['solutionId'], obj, success => {
      console.log(JSON.stringify(success));
      // console.log("published obs")
        this.utils.openToast(success.message);
        this.isPublished = true;
        console.log(this.editDataIndex)
        if(this.editData){
          this.localStorage.getLocalStorage('draftObservation').then(draftObs=>{
            draftObs.splice(this.editDataIndex, 1);
            console.log(JSON.stringify(draftObs))
            console.log("DRAFTOBS")
            this.localStorage.setLocalStorage('draftObservation', draftObs);
          }).catch( error=>{

          })
        }
        this.navCtrl.pop();

     
    }, error => {

    })
  }

  countEntity(entity){
    entity.selected ? this.entityCount-- : this.entityCount++ ;
    console.log(this.entityCount)
  }

  async ionViewCanLeave() {
    console.log(this.saveDraftType + "  " + this.editDataIndex)
    if(this.isPublished){
      return true
    }
    if(this.saveDraftType != 'normal'  && this.editDataIndex >= -1 ){
      const shouldLeave = await this.confirmLeave();
      return shouldLeave;
    }
  }
  
  confirmLeave(): Promise<Boolean> {
    let resolveLeaving;
    const canLeave = new Promise<Boolean>(resolve => resolveLeaving = resolve);
    let translateObject ;
    this.translate.get(['actionSheet.confirmLeave','actionSheet.saveCurrentDataConfirmation','actionSheet.yes','actionSheet.no']).subscribe(translations =>{
      translateObject = translations;
      console.log(JSON.stringify(translations))
    })

    const alert = this.alertCtrl.create({
      title: translateObject['actionSheet.confirmLeave'],
      message: translateObject['actionSheet.saveCurrentDataConfirmation'],
      buttons: [
        {
          text: translateObject['actionSheet.no'],
          role: 'cancel',
          handler: () => resolveLeaving(true)
        },
        {
          text: translateObject['actionSheet.yes'],
          handler: () =>{
            this.saveDraft('force')
           resolveLeaving(true)
          }
        }
      ]
    });
    alert.present();
    return canLeave
  }


}
