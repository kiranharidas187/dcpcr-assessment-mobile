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
  limit = 50;
  page = 1;
  totalCount = 0;
  searchValue = "";
  selectableList: any = [];
  index: any = 50;
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
      if (element.selected && !element.preSelected) {
        selectedSchools.push(element);
      }
    });

    console.log(selectedSchools.length);
    this.viewCntrl.dismiss(selectedSchools);
  }
  clearEntity(){
    this.selectableList = []
  }
  cancel() {
    this.viewCntrl.dismiss();
  }
  checkItem(listItem) {
    console.log("checked")
    listItem.selected = !listItem.selected;
    listItem.selected ? this.selectedListCount.count++ : this.selectedListCount.count--;
  }
  search(event?) {
    this.searchValue = event ? event : this.searchValue;
    event ? this.utils.startLoader() : "";
    this.page = event ? this.page : this.page + 1;
    this.apiProviders.httpGet(this.searchUrl +"?observationId="+ this.observationId + "&search=" + this.searchValue + "&page=" + this.page + "&limit=" + this.limit, success => {
      this.selectableList = event ? [] : this.selectableList;
      for (let i = 0; i < success.result[0].data.length; i++) {
        success.result[0].data[i].isSelected = success.result[0].data[i].selected;
        success.result[0].data[i].preSelected = success.result[0].data[i].selected ? true : false;
      }
      this.totalCount = success.result[0].count;
      this.selectableList = [... this.selectableList, ...success.result[0].data]
      event ? this.utils.stopLoader() : "";
    }, error => {
      event ? this.utils.stopLoader() : "";
    },{version:"v2"})
  }


  doInfinite(infiniteScroll) {
    setTimeout(() => {
      this.search();
      infiniteScroll.complete();
    }, 500);
  }
  searchEntity(event) {
    if (!event.value) {
      this.selectableList = [];
      return
    }
    if (!event.value || event.value.length < 3) {
      return;
    }
    this.search(event.value)
  }
}
