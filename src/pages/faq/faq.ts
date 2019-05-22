import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { DetailPage } from '../detail/detail';

@Component({
  selector: 'page-faq',
  templateUrl: 'faq.html',
})
export class FaqPage {

  faqContent = [
    {
      heading: "What if my phone/screen is hung?",
      content: `<p><ul><li>Press home button → close all applications → click on SDI app → resume survey. Data filled will not be lost.</li>
      <li>Restart your phone → click on SDI app → resume survey. Data filled will not be lost.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What to do if I’m unable to submit the form?",
      content: `<p><ul><li>Check if your data is turned on</li>
      <li>Check if you have network</li>
      <li>Move to an area where there is better network reception</li>
      <li>Try after 5 minutes</li>
      <li>Put your phone on airplane mode for a few seconds → turn airplane mode off →try again to submit</li>
      <li>Try submitting in a Wi-Fi zone</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What do I do if I receive an incoming call during the survey?",
      content: `<p><ul><li>Answer the incoming call. Data filled will not be lost.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What should I do if I press home button by mistake?",
      content: `<p><ul><li>Go back to the application window. Resume survey. Data filled will not be lost.
      </li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What if I have no network on my phone?",
      content: `<p><ul><li>The app can work without phone network. No action required</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What to do when I have no internet connection?",
      content: `<p><ul><li>Internet connectivity is required to log into the app and at the time of submitting the form. At all other times, the app can work offline without any loss of data filled.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What do I do if I have a fluctuating internet during the survey?",
      content: `<p><ul><li>The app once logged in is designed to work without any loss of data filled irrespective of internet, network or fluctuating connection.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What should I do if my phone battery is exhausted?",
      content: `<p><ul><li>Charge your phone → restart → open SDI app → resume survey. Data filled will not be lost.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What to do if my application crashes?",
      content: `<p><ul><li>Click on SDI app → resume survey. Data filled will not be lost.</li>
      <li>If crashed a second time: Restart your phone → click on SDI app → resume survey. Data filled will not be lost.</li>
      <li>If data is lost before submission of form, contact your immediate supervisor.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What if my camera is not working?",
      content: `<p><ul><li>Close all apps → click on SDI app → resume survey → take picture. Data filled will not be lost.</li>
      <li>Restart your phone → click on SDI app → resume survey → take picture. Data filled will not be lost.
      </li>
      </ul></p>`,
      images: []
    },
    {
      heading: "How do I logout of the app?",
      content: `<p><ul><li>Once you login, there is no logout option.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What happens to the filled data if I uninstall and delete the app?",
      content: `<p><ul><li>Once uninstalled and deleted, the data from your app would get deleted as well. </li>
      </ul></p>`,
      images: []
    },
    {
      heading: "Can I restore the filled data if I clear cache on phone or clear the app data manually?",
      content: `<p><ul><li>Once cache is cleared or the app data is cleared manually, the data filled will be lost.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "What to do if my screen is blank?",
      content: `<p><ul><li>Close the app and launch it again. If the problem persists, inform your immediate supervisor. </li>
      </ul></p>`,
      images: []
    },
    {
      heading: "Is this app collecting my location at all times?",
      content: `<p><ul><li>No. Your location is collected as soon as you give permission at the time of login. Location is mandatory for the starting of the survey. Twice, during the time of filling in the survey only if your internet data is switched on and once you submit your form at every ECM, your location is collected by the app. It is thus advised to submit your form within the school premises.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "Can I see the ECMs that have been submitted by my fellow assessors of the school?",
      content: `<p><ul><li>Yes, when online click on the refresh button to see if any other ECM has been submitted.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "Can I fill the ECM once submitted online?",
      content: `<p><ul><li>No, you cannot edit the form once submitted online.</li>
      </ul></p>`,
      images: []
    },
    {
      heading: "Where is all the saved data getting stored?",
      content: `<p><ul><li>All the data being collected is automatically getting saved on your phone. Ensure to not clear cache on your phone to avoid erasing your filled data</li>
      </ul></p>`,
      images: []
    },
    {
      heading: `Where can I find the training and application manual?
      Find the  Assessor Training Manual here-`,
      content: `<p  class="_flex-box _justify-content-center _cursor-pointer"><a href="https://docs.google.com/document/d/1difw6K1mkESMsNGXeWLsfKz_iaWzawI9IEsYBiZJzyM/edit?usp=sharing">
      <button class="_cursor-pointer ">Click here to see the document</button>
      </a>
      </p>`,
      images: []
    },
    {
      heading: `Find the Application Manual here-`,
      content: `<p class="_flex-box _justify-content-center _cursor-pointer"><a href="https://docs.google.com/document/d/1Tw3WvCQRonmWjICC8AXYd-2VwrIPEJDFsScTy_CC4Xk/edit?usp=sharing">
      <button class="_cursor-pointer">Click here to see the document</button>
      </a>
      </p>`,
      images: []
    }
  ]
  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  goTodetailsPage(i) {
    this.navCtrl.push(DetailPage, { content: this.faqContent[i], header: 'headings.faqs' })
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad FaqPage');
  }

}
