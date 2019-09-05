import { Component, Input, Output, EventEmitter } from '@angular/core';
import {  Platform } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { LocalStorageProvider } from '../../providers/local-storage/local-storage';
import { UtilsProvider } from '../../providers/utils/utils';
/**
 * Generated class for the AudioRecordingListingComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
declare var cordova: any;

@Component({
  selector: 'audio-recording-listing',
  templateUrl: 'audio-recording-listing.html'
})
export class AudioRecordingListingComponent {
  @Input() submissionId ;
  @Input() evidenceId
  recording: boolean = false;
  filePath: string;
  fileName: string;
  audio: MediaObject;
  audioList: any[] = [];
  isIos: boolean = this.platform.is('ios');
  interval;
  timeLeft: number = 0;
  minutes: number = 0;
  seconds: number = 0;
  appFolderPath: string;
  datas: any;
  @Output() audioAddedEvent = new EventEmitter() ;




  @Input()
  set data(data) {
    this.datas = data;
    console.log(JSON.stringify(data))
  }

  get name() {
    return true
  }
  @Input() schoolId: string;
  @Input() generalQuestion: boolean;


  imageList: Array<any> = [];
  imageNameCounter: number = 0;
  localEvidenceImageList: any;
  allLocalImageList: any = {};

  constructor(
    private media: Media,
    private file: File,
    private storage: Storage,
    private utils: UtilsProvider,
    private localStorage : LocalStorageProvider,
    private platform: Platform
  ) {

    this.isIos = this.platform.is('ios') ? true : false;
    console.log("on const")
    this.getAudioList();

  }
  // ionViewDidLoad(){
  //   console.log("on did load")
  //   this.getAudioList();
  // }
  ngOnInit() {
    this.storage.get(this.generalQuestion ? 'genericQuestionsImages' : 'allImageList').then(data => {
      this.allLocalImageList = JSON.parse(data) ? JSON.parse(data) : {};
      console.log(data)
      if (!this.generalQuestion) {
        if (this.allLocalImageList[this.submissionId]) {
          this.allLocalImageList[this.submissionId][this.evidenceId] = (this.allLocalImageList[this.submissionId][this.evidenceId]) ? this.allLocalImageList[this.submissionId][this.evidenceId] : []
        } else {
          console.log(this.submissionId + " " + this.evidenceId)
          this.allLocalImageList[this.submissionId] = {};
          this.allLocalImageList[this.submissionId][this.evidenceId] = []
          this.localEvidenceImageList = [];
        }
      } else {
        if (this.allLocalImageList[this.submissionId]) {
          this.allLocalImageList[this.submissionId] = (this.allLocalImageList[this.submissionId]) ? this.allLocalImageList[this.submissionId] : []
        } else {
          this.allLocalImageList[this.submissionId] = [];
          this.localEvidenceImageList = [];
        }
      }
      // this.allLocalImageList = JSON.parse(data) ? JSON.parse(data) : {};
      // this.localEvidenceImageList = (this.allLocalImageList && this.allLocalImageList[this.evidenceId]) ? this.allLocalImageList[this.evidenceId] : [];
    })
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + 'images' : cordova.file.externalDataDirectory + 'images';
  }
  setLocalDatas(fileName) {
    this.datas.fileName.push(fileName);
    if (!this.generalQuestion) {
      this.allLocalImageList[this.submissionId][this.evidenceId].push({ name: fileName, uploaded: false });
    } else {
      this.allLocalImageList[this.submissionId].push({ name: fileName, uploaded: false });
    }
    this.updateLocalImageList();
  } 

  updateLocalImageList() {
    this.utils.setLocalImages(this.allLocalImageList, this.generalQuestion);
  }

  getAudioList() {
    this.localStorage.getLocalStorage("allImageList").then(data =>{
      data = JSON.parse(data);
      data[this.submissionId][this.evidenceId].forEach(element => {
          if (element.audio)
          {
            this.audioList.push(element);
          }
      });
    }).catch( error =>{

    })
      // this.audioList = JSON.parse(localStorage.getItem("audiolist"));
      // console.log(this.audioList);
    // }


  }
  



  startRecord() {
    
    if (this.platform.is('ios')) {
      this.file.checkDir(this.file.documentsDirectory, 'images').then(success => {
        this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';
        this.filePath = this.file.documentsDirectory +"images/"+ this.fileName;
        this.audio = this.media.create(this.filePath);
        this.recording = true;
        this.startTimer();
        this.audio.startRecord();
        this.setLocalDatas(this.fileName);

      }).catch(err => {
        this.file.createDir(cordova.file.documentsDirectory, 'images', false).then(success => {
          this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';
          this.filePath = this.file.documentsDirectory+"images/" + this.fileName;
          this.audio = this.media.create(this.filePath);
          this.recording = true;
        this.startTimer();
        this.audio.startRecord();
        this.setLocalDatas(this.fileName);

        }, error => { })
      });

      
    } else if (this.platform.is('android')) {
      this.file.checkDir(this.file.externalDataDirectory, 'images').then(success => {
        this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';
        this.filePath = this.file.externalDataDirectory +"images/"+ this.fileName;
        console.log(this.filePath)
        this.audio = this.media.create(this.filePath);
        this.recording = true;
        this.startTimer();
        this.audio.startRecord();
        this.setLocalDatas(this.fileName);

      }).catch(err => {
        console.log("No image File")

        this.file.createDir(cordova.file.externalDataDirectory, 'images', false).then(success => {
          console.log("file created with name image")
        this.fileName = 'record'+new Date().getDate()+new Date().getMonth()+new Date().getFullYear()+new Date().getHours()+new Date().getMinutes()+new Date().getSeconds()+'.mp3';
        this.filePath = this.file.externalDataDirectory+"images/"+this.fileName;
        console.log(this.filePath)
        this.audio = this.media.create(this.filePath);
        this.recording = true;
        this.startTimer();
        this.audio.startRecord();
        this.setLocalDatas(this.fileName);
        }, error => { })
      });
     
    }
  
  }
  startTimer() {
    if(this.recording){
    this.interval = setInterval(() => {
      if(this.timeLeft >= 0) {
        this.timeLeft++;
         console.log(this.timeLeft)
        this.minutes = Math.ceil(this.timeLeft / 60) - 1;
        this.seconds = Math.floor(this.timeLeft % 60)
      } else {
        this.timeLeft = 0;
        // this.minutes = Math.ceil(this.timeLeft / 60) - 1;
        this.minutes = 0;
        // this.seconds = Math.floor(this.timeLeft % 60);
        this.seconds = 0;
      }
    },1000)
  }
    
  }
  stopRecord() {
    this.recording = false;
    this.timeLeft = 0;
    this.minutes = 0;
    this.seconds = 0;
    clearInterval(this.interval)
    this.audio.stopRecord();
    this.audioAddedEvent.emit(true);
    console.log(JSON.stringify(this.datas))
    // let data = { name: this.fileName , uploaded : false , audio : true};
    // this.audioList.push(data);
    // this.localStorage.getLocalStorage('allImageList').then( data =>{
    //  console.log(data +"localstorage");

    //   data= JSON.parse(data)
    //  data[this.submissionId][this.evidenceId].push({
    //    name: this.fileName,
    //    uploaded : false,
    //    audio : true
    //  })
    //  this.localStorage.setLocalStorage( 'allImageList', JSON.stringify(data));
    // } ).catch( error =>{
    //   console.log("no local")
    //   let data :any ={
    //     [this.submissionId] : {
    //       [this.evidenceId]:[]
    //     }
    //   };
    //   data[this.submissionId][this.evidenceId].push({
    //     name: this.fileName,
    //     uploaded : false
    //   });
    //  this.localStorage.setLocalStorage( 'allImageList', JSON.stringify(data));
    // });
  }


  playAudio(file,idx) {
    console.log(file)
    if (this.platform.is('ios')) {
      this.filePath = this.file.documentsDirectory.replace(/file:\/\//g, '') + file;
      this.audio = this.media.create(this.filePath);
    } else if (this.platform.is('android')) {
      // this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      this.filePath = this.file.externalDataDirectory.replace(/file:\/\//g, '') + file;
      console.log(this.filePath)
      this.audio = this.media.create(this.filePath);
      console.log("audio")
    }
    this.audio.play();
    this.audio.setVolume(1);
  }

}
