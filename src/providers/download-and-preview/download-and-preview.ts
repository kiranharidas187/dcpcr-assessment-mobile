import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer';
import { Platform } from 'ionic-angular';
import { File } from '@ionic-native/file';
import { FileOpener } from '@ionic-native/file-opener';
import { FILE_EXTENSION_HEADERS } from '../../components/image-upload/mimTypes';
import { UtilsProvider } from '../utils/utils';
import { AppConfigs } from '../appConfig';
import { ApiProvider } from '../api/api';
import { SharingFeaturesProvider } from '../sharing-features/sharing-features';


/*
  Generated class for the DownloadAndPreviewProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/

declare var cordova: any;


@Injectable()
export class DownloadAndPreviewProvider {
  isIos: boolean;
  appFolderPath;

  constructor(public http: HttpClient, private fileTransfr: FileTransfer, private platform: Platform,
    private file: File,private shareFeature : SharingFeaturesProvider, private fileOpener: FileOpener, private utils: UtilsProvider,
    private apiProvider: ApiProvider) {
    console.log('Hello DownloadAndPreviewProvider Provider');
    this.isIos = this.platform.is('ios') ? true : false;
    this.appFolderPath = this.isIos ? cordova.file.documentsDirectory + 'submissionDocs' : cordova.file.externalDataDirectory + 'submissionDocs';
  }

  checkForSubmissionDoc(submissionId, action) {
    console.log("Check for file")
    const fileName = "submissionDoc_" + submissionId + ".pdf";
    this.file.checkFile(this.appFolderPath+ '/', fileName).then(success => {
    console.log("Check for file available")
      action === 'share' ? this.shareSubmissionDoc(this.appFolderPath+ '/'+ fileName) : this.previewSubmissionDoc(fileName)
    }).catch(error => {
    console.log("Check for file not available")

      this.getSubmissionDocUrl(submissionId, action);
      // this.downloadSubmissionDoc(submissionId, action)
    })
  }
  shareSubmissionDoc(fileName: string) {
    this.shareFeature.sharingThroughApp(fileName)
  }

  downloadSubmissionDoc(submissionId, fileRemoteUrl, action) {
    console.log("file dowload")

    const fileName = "submissionDoc_" + submissionId + ".pdf";
    const fileTransfer: FileTransferObject = this.fileTransfr.create();
    fileTransfer.download(fileRemoteUrl, this.appFolderPath + '/' + fileName).then(success => {
    console.log("file dowload success")

      if (action === 'preview') {
        this.previewSubmissionDoc(fileName)
      } else if (action === 'share') {
        this.shareSubmissionDoc(fileName)
      }
      this.utils.stopLoader();
      console.log(JSON.stringify(success))
    }).catch(error => {
    console.log("file dowload error")

      this.utils.stopLoader();
      console.log(JSON.stringify(error))
    })
  }


  getSubmissionDocUrl(submissionId, action) {
    this.utils.startLoader()
    console.log("call api")

    this.apiProvider.httpGet(AppConfigs.cro.getSubmissionPdf + submissionId, success => {
      if (success.result.url) {
    console.log("api success")

        this.downloadSubmissionDoc(submissionId, success.result.url, action)
      } else {
    console.log("api no file created")

        this.utils.openToast(success.message);
        this.utils.stopLoader();

      }
      console.log(JSON.stringify(success))
    }, error => {
      this.utils.stopLoader();
      console.log(JSON.stringify(error))
    })
  }

  previewSubmissionDoc(fileName) {
    const extension = this.getExtensionFromName(fileName);
    this.fileOpener.open(this.appFolderPath + '/' + fileName, FILE_EXTENSION_HEADERS[extension])
      .then(() => console.log('File is opened'))
      .catch(e => {
        this.utils.openToast('No file readers available');
      })
  }

  getExtensionFromName(fileName) {
    let splitString = fileName.split('.');
    let extension = splitString[splitString.length - 1];
    return extension
  }

}
