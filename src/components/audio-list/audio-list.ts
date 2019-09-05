import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the AudioListComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'audio-list',
  templateUrl: 'audio-list.html'
})
export class AudioListComponent {

  text: string;
  playFlag : boolean = false;
  @Input() audioList
  @Output() audioPlay = new EventEmitter ();
  constructor() {
    console.log('Hello AudioListComponent Component');
    this.text = 'Hello World';
  }
  playAudioFunc(fileName,index){
    this.playFlag = !this.playFlag;

    console.log("list audio play")
    this.audioPlay.emit({
      fileName : fileName,
      index : index
    })
  }
  delete(fileName,index){
    
  }

}
