import { Component, Input } from '@angular/core';

/**
 * Generated class for the ExpansionPanelComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'expansion-panel',
  templateUrl: 'expansion-panel.html'
})
export class ExpansionPanelComponent {

  text: string;
  @Input() datas ;
  // @Input() datas = {
  //   order: 2,
  //   chart: {
  //     type: "expansion",
  //     title: "Descriptive view for HM for school performance",
  //     data: [
  //       {
  //         domainName: "Domain 1",
  //         domainId: "DOMAIN ID",
  //         criterias: [
  //           {
  //             name: "Infrastructure condition",
  //             level: "Level 1"
  //           },
  //           {
  //             name: "Infrastructure ",
  //             level: "Level 2"
  //           },
  //           {
  //             name: "condition",
  //             level: "Level 3"
  //           }
  //         ]
  //       },
  //       {
  //         domainName: "Domain 2",
  //         domainId: "DOMAIN ID",
  //         criterias: [
  //           {
  //             name: "Infrastructure condition",
  //             level: "Level 1"
  //           },
  //           {
  //             name: "Infrastructure ",
  //             level: "Level 2"
  //           },
  //           {
  //             name: "condition",
  //             level: "Level 3"
  //           }
  //         ]
  //       }
  //     ]
  //   }
  // }

  isOpenIndex ;
  constructor() {
    console.log('Hello ExpansionPanelComponent Component');
    this.text = 'Hello World';
  }

}
