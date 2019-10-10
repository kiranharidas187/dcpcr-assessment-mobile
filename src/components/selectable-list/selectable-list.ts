import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ApiProvider } from '../../providers/api/api';
/**
* Generated class for the SelectableListComponent component.
*
* See https://angular.io/api/core/Component for more info on Angular
* Components.
*/
@Component({
 selector: 'selectable-list',
 templateUrl: 'selectable-list.html'
})
export class SelectableListComponent {
  @Input() selectableList  ;
  @Input() listOfNotSelectedCount;
  @Input() totalCount : number;
  @Output() infinityScrollEvent = new EventEmitter();
  @Input() index = 100 ;
  @Output() searchUrl  = new EventEmitter();
  @Input() observationId;
  infinityScrollFlag = true;
  @Input() selectedListCount ;
  text: string;
  constructor(
    private apiProviders : ApiProvider
  ) {
    console.log('Hello SelectableListComponent Component');
    this.text = 'Hello World';
    // this.selectableList = this.filterSelected();
    // this.list = this.selectableList.slice(0,this.index-1);
  }
  // filterSelected(){
  //   let arr = [];
  //   if(this.selectableList){
      
  //   }
  //   this.selectableList.forEach(element => {
  //     if(! element.selected)
  //     {
  //       arr.push(element);
  //     }
  //   });
  //   console.log("filtered array");
  //   console.log(JSON.stringify(arr))
  //   return arr;
  // }
  doInfinite(infiniteScroll) {
    console.log("doInfinite function called");
    setTimeout(() => {
      this.infinityScrollEvent.emit()
      // for (let i=0 ; ( i < 10 ) && this.index < this.selectableList.length; i++ ) {
      //   this.list.push(this.selectableList[this.index++]);
      // }
    //  this.infinityScrollFlag = this.list.length === this.selectableList.length ? false : true;
      infiniteScroll.complete();
    }, 500);
  }
  searchEntity(event){
    if(!event.value){
      this.selectableList = [];
      return
    }
      if(!event.value || event.value.length < 3){
         return;
      }
     
    console.log("search entity called")
    console.log(event.value);
    this.searchUrl.emit(event.value)
    // this.filterSelected();
  }
  clearEntity(){
    this.selectableList = []
  }
  checkItem(listItem){
    console.log("checked")
    listItem.selected = !listItem.selected; 
    listItem.selected ?  this.selectedListCount.count++ : this.selectedListCount.count-- ;
  }
  ionViewWillEnter(){
    console.log(this.selectedListCount + "count")
    console.log(JSON.stringify(this.selectableList))
    

  }
}
