import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';

/**
 * Generated class for the BarChartComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'bar-chart',
  templateUrl: 'bar-chart.html'
})
export class BarChartComponent implements OnInit {

  @Input() data;
  @Input() questionNumber;
  Highcharts = Highcharts; // required
  chartConstructor = 'chart'; // optional string, defaults to 'chart'
  updateFlag = false; // optional boolean
  oneToOneFlag = true; // optional boolean, defaults to false
  runOutsideAngular = false;
  chartObj;

  constructor() {
    console.log('Hello BarChartComponent Component');
  }

  ngOnInit() {
    this.chartObj = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'bar'
      },
      title: {
        text: " "
      },
      xAxis: this.data.chart.xAxis,
      yAxis: this.data.chart.yAxis,
      tooltip: {
        // pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        bar: {
          dataLabels: {
            enabled: false
          },
          showInLegend: false
        }
      },
      series: this.data.chart.data

    }

  }

}
