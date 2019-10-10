import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TextToSpeech } from '@ionic-native/text-to-speech';
import { Events } from 'ionic-angular';

/*
  Generated class for the TextToSpeechProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class TextToSpeechProvider {

  constructor(public http: HttpClient, private tts: TextToSpeech,
    private events: Events
  ) {
    console.log('Hello TextToSpeechProvider Provider');
  }

  speechFromText(options) {
    return new Promise((resolve, reject) => {
      options['local'] = options.local ? options.local : 'en-IN';
      options['rate'] = options.rate ? options.rate : .5;
      this.tts.speak(options)
        .then(success => {
          resolve(success)
        })
        .catch(error => {
          reject(error);
        });
    });
  }

  stopSpeech() {
    return new Promise((resolve, reject) => {
      this.tts.speak("").then(success => {
        resolve(success);
      }).catch(error => {
        reject(error);
      });
    });
  }

}
