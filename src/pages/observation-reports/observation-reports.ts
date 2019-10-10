import { Component } from '@angular/core';
import { NavController, NavParams, Platform } from 'ionic-angular';
import { ApiProvider } from '../../providers/api/api';
import { AppConfigs } from '../../providers/appConfig';
import { File } from '@ionic-native/file';
import { DownloadAndPreviewProvider } from '../../providers/download-and-preview/download-and-preview';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { UtilsProvider } from '../../providers/utils/utils';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { DatePipe } from '@angular/common';

declare var cordova: any;
@Component({
  selector: 'page-observation-reports',
  templateUrl: 'observation-reports.html',
})
export class ObservationReportsPage {

  reportObj;
  submissionId;
  observationId;
  entityId;
  error;
  payload;
  appFolderPath;
  isIos;
  fileName;
  action;

  constructor(public navCtrl: NavController, private dap: DownloadAndPreviewProvider,
    public navParams: NavParams, private platform: Platform,
    private fileTransfer: FileTransfer, private utils: UtilsProvider,
    private androidPermissions: AndroidPermissions,
    private datepipe: DatePipe,
    private apiService: ApiProvider, private file: File) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ObservationReportsPage');
    this.submissionId = this.navParams.get('submissionId');
    this.observationId = this.navParams.get('observationId')
    this.entityId = this.navParams.get('entityId');
    this.payload = {
      "entityId": this.entityId,
      "submissionId": this.submissionId,
      "observationId": this.observationId
    }
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.externalRootDirectory + '/Download/' : cordova.file.externalRootDirectory + '/Download/';
    this.getObservationReports();
  }




  getObservationReports(download = false) {
    this.utils.startLoader();
    let url;
    if (this.submissionId) {
      url = AppConfigs.observationReports.instanceReport;
    } else if (!this.submissionId && !this.entityId) {
      url = AppConfigs.observationReports.observationReport;
    } else {
      url = AppConfigs.observationReports.entityReport
    }


    this.apiService.httpPost(url, this.payload, (success) => {
      if (success) {
        this.reportObj = success;
      } else {
        this.error = "No data found"
      }
      this.utils.stopLoader();

    }, error => {
      this.error = "No data found";
      this.utils.stopLoader();
    }, { dhiti: true })

  }

  downloadSharePdf(action) {
    this.action = action;

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(status => {
      console.log(JSON.stringify(status))
      if (status.hasPermission) {
        this.getObservationReportUrl()
      } else {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE).then(success => {
          if (success.hasPermission) {
            this.getObservationReportUrl()
          }
        }).catch(error => {
          console.log(JSON.stringify(error))
        })
      }
    })
  }

  // checkForSubmissionDoc(submissiond) {
  //   console.log("Check for file")
  //   this.file.checkFile(this.appFolderPath, this.fileName).then(success => {
  //     console.log("Check for file available")
  //     this.action === 'share' ? this.dap.shareSubmissionDoc(this.appFolderPath + this.fileName) : this.dap.previewSubmissionDoc(this.appFolderPath + this.fileName)
  //   }).catch(error => {
  //     console.log("Check for file not available")
  //     // this.getObservationReports(true)
  //     this.getObservationReportUrl();
  //   })
  // }

  getObservationReportUrl() {
    this.utils.startLoader();
    // + "type=submission&"
    let url = AppConfigs.observationReports.getReportsPdfUrls ;
    const timeStamp = '_'+this.datepipe.transform(new Date(), 'yyyy-MMM-dd-HH-mm-ss a')
    if (this.submissionId) {
      url = url + "submissionId="+ this.submissionId;
      this.fileName = this.submissionId+timeStamp + ".pdf";
    } else if (!this.submissionId && !this.entityId) {
      url = url + "observationId=" + this.observationId
      this.fileName = this.observationId +timeStamp+ ".pdf";
    } else {
      url = url + "entityId=" + this.entityId + "&observationId=" + this.observationId
      this.fileName = this.entityId + '_' + this.observationId +timeStamp+ ".pdf";
    }

    this.apiService.httpGet(url, success => {
      this.utils.stopLoader();
      if (success.status === 'success' && success.pdfUrl) {
        this.downloadSubmissionDoc(success.pdfUrl);
      } else {
        this.utils.openToast(success.message)
      }
    }, error => {
      this.utils.openToast(error.message)

      this.utils.stopLoader();
    }, { dhiti: true })
  }


  downloadSubmissionDoc(fileRemoteUrl) {
    console.log("file dowload")
    this.utils.startLoader();
    const fileName = "submissionDoc_" + this.fileName;
    const fileTransfer: FileTransferObject = this.fileTransfer.create();

    fileTransfer.download(fileRemoteUrl, this.appFolderPath + fileName).then(success => {
      console.log("file dowload success")
      this.action === 'share' ? this.dap.shareSubmissionDoc(this.appFolderPath + fileName) : this.dap.previewSubmissionDoc(this.appFolderPath + fileName)
      this.utils.stopLoader();
      console.log(JSON.stringify(success))
    }).catch(error => {
      console.log("file dowload error")

      this.utils.stopLoader();
      console.log(JSON.stringify(error))
    })
  }

}
