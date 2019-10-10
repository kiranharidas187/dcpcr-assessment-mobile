// import { HttpClient , HttpHeaders} from '@angular/common/http';
import { Http } from '@angular/http';

import { Injectable } from '@angular/core';
import { AppConfigs } from '../appConfig';
import { Device } from '@ionic-native/device';
import { Network } from '@ionic-native/network';
import { NetworkGpsProvider } from '../network-gps/network-gps';
import { CurrentUserProvider } from '../current-user/current-user';
import { Events } from 'ionic-angular';

@Injectable()
export class SlackProvider {
  subscription: any;
  networkAvailable: boolean;

  constructor(public http: Http, private device: Device, private network: Network, private ngps: NetworkGpsProvider,
    private currentUser: CurrentUserProvider, private events: Events) {
    console.log('Hello SlackProvider Provider');
    this.subscription = this.events.subscribe('network:offline', () => {
      // this.utils.openToast("Network disconnected");
      this.networkAvailable = false;
    });

    // Online event
    const onine = this.events.subscribe('network:online', () => {
      // this.utils.openToast("Network connected");
      this.networkAvailable = true;
    });

    this.networkAvailable = this.ngps.getNetworkStatus();
  }

  pushException(errorDetails?: any): void {
    const payload = {
      "text": "Mobile Exception Log. ",
      "attachments": [
        {
          "fallback": "App Name",
          "title": `App Name`,
          "text": `${AppConfigs.appName}`
        },
        {
          "fallback": "Environment",
          "title": `Environment`,
          "text": `${AppConfigs.environment}`
        },
        {
          "fallback": "Device Details",
          "title": `Device Details`,
          "text": `OS ${this.device.platform} ${this.device.version} , ${this.device.manufacturer}, ${this.device.model}`
        }, {
          "fallback": "Network",
          "title": `Network`,
          "text": `${this.network.type}. Network Connected= ${this.ngps.networkStatus}`
        },
        {
          "fallback": "User Details",
          "title": `User Details`,
          "text": `${this.currentUser.getCurrentUserData()['name']}, ${this.currentUser.getCurrentUserData()['email']}`
        },
        {
          "fallback": "App version",
          "title": `App version`,
          "text": `${AppConfigs.appVersion}`
        }

      ]

    }
    if(errorDetails) {
        payload.attachments.push(errorDetails)
    }
   if(AppConfigs.enableSlack)
   {
    this.http.post(AppConfigs.slack.exceptionUrl, JSON.stringify(payload)).subscribe(result => {
    }, error => {
      console.log(JSON.stringify(error))
    })
   }
  }

}
