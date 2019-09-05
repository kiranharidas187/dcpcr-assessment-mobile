import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ModalController, ViewController } from 'ionic-angular';
import { HintPage } from '../../pages/hint/hint';

/*
  Generated class for the HintProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class HintProvider {

  constructor(public http: HttpClient, private modalCtrl: ModalController) {
    console.log('Hello HintProvider Provider');
  }
  presentHintModal(hint) {
    console.log(JSON.stringify(hint))
    let hintModal = this.modalCtrl.create(HintPage, hint);
    hintModal.onDidDismiss(data => {
    });
    hintModal.present();
  }
}
