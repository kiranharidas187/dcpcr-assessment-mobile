import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { AppConfigs } from '../../../../providers/appConfig';
import { ApiProvider } from '../../../../providers/api/api';
import { UtilsProvider } from '../../../../providers/utils/utils';
/**
* Generated class for the SchoolListPage page.
*
* See https://ionicframework.com/docs/components/#navigation for more info on
* Ionic pages and navigation.
*/
@Component({
 selector: 'page-entity-list',
 templateUrl: 'entity-list.html',
})
export class EntityListPage {
 entityList;
 observationId;
 searchUrl;
 limit = 10;
 page = 1;
 totalCount = 0;
 searchValue = "";
 selectableList: any;
 index: any = 50;
 list: any = [];
 arr = [];
 selectedListCount = {
   count: 0
 }
 solutionId: any;
 constructor(
   public navCtrl: NavController,
   public navParams: NavParams,
   public viewCntrl: ViewController,
   private apiProviders: ApiProvider,
   private utils: UtilsProvider
 ) {
   this.searchUrl = AppConfigs.cro.searchEntity;
   this.observationId = this.navParams.get('data');
   this.solutionId = this.navParams.get('solutionId');
   console.log(this.observationId)
 }
 ionViewDidLoad() {
   console.log('ionViewDidLoad SchoolListPage');
 }
 addSchools() {
   let selectedSchools = []
   this.selectableList.forEach(element => {
     if (element.selected && !element.preSelected)  {
       selectedSchools.push(element);
     }
   });
   console.log(selectedSchools.length);
   this.viewCntrl.dismiss(selectedSchools);
 }
 cancel(){
   this.viewCntrl.dismiss();
 }
 search(event?) {
   this.searchValue = event ? event : this.searchValue;
   this.utils.startLoader();
   this.index = 50;
   this.apiProviders.httpGet(this.searchUrl + this.observationId + "?search=" + this.searchValue + "&page=" + this.page + "&limit=" + this.limit, success => {
     this.arr = event ? [] : this.arr;
     for (let i = 0; i < success.result[0].data.length; i++) {
       success.result[0].data[i].isSelected = success.result[0].data[i].selected;
       success.result[0].data[i].preSelected = success.result[0].data[i].selected ? true : false;
     }
     event ? null : this.page++;
     console.log(JSON.stringify(success.result[0]))
     this.totalCount = success.result[0].count;
     console.log(JSON.stringify(success))
     // this.selectableList = [...success.result[0].metaInformation]
     this.selectableList = [...success.result[0].data]
     this.utils.stopLoader();
   }, error => {
     this.utils.stopLoader();
   })
 }
}