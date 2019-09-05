import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the HintPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-hint',
  templateUrl: 'hint.html',
})
export class HintPage {

  hint: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private viewCntrl: ViewController) {
    this.hint = this.navParams.get('hint');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad HintPage');
  }
  cancel(): void {
    this.viewCntrl.dismiss();
  }

}
