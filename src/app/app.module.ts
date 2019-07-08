import { NgModule, ErrorHandler } from '@angular/core';
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { IonicStorageModule } from '@ionic/storage';
import { Network} from '@ionic-native/network';
import { MyApp } from './app.component';

import { AboutPage } from '../pages/about/about';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPageModule } from '../pages/login/login.module';
import { AuthProvider } from '../providers/auth/auth';
import { CurrentUserProvider } from '../providers/current-user/current-user';
import { WelcomePage } from '../pages/welcome/welcome';
import { SchoolListProvider } from '../providers/school-list/school-list';
import { UtilsProvider } from '../providers/utils/utils';
import { ApiProvider } from '../providers/api/api';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Geolocation } from '@ionic-native/geolocation';
import { Diagnostic } from '@ionic-native/diagnostic';
import { EvidenceListPageModule } from '../pages/evidence-list/evidence-list.module';
import { SectionListPageModule } from '../pages/section-list/section-list.module';
import { QuestionerPageModule } from '../pages/questioner/questioner.module';
import { ComponentsModule } from '../components/components.module';
import { DirectivesModule } from '../directives/directives.module';
import { FaqPage } from '../pages/faq/faq';
import { EntityProfileEditPage } from '../pages/entity-profile-edit/entity-profile-edit';
import { Camera } from '@ionic-native/camera';
import { File } from '@ionic-native/file';
import { FilePath } from '@ionic-native/file-path';
import { FileTransfer} from '@ionic-native/file-transfer';
import { ImagePicker } from '@ionic-native/image-picker';
import { ImageListingPage } from '../pages/image-listing/image-listing';
import { MatrixActionModalPage } from '../pages/matrix-action-modal/matrix-action-modal';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { RatingProvider } from '../providers/rating/rating';
import { RatingCriteriaListingPageModule } from '../pages/rating-criteria-listing/rating-criteria-listing.module';
import { RatingPageModule } from '../pages/rating/rating.module';
import { NetworkGpsProvider } from '../providers/network-gps/network-gps';
import { RatedCriteriaListPageModule } from '../pages/rated-criteria-list/rated-criteria-list.module';
import { FeedbackProvider } from '../providers/feedback/feedback';
import { EvidenceProvider } from '../providers/evidence/evidence';
import { QuestionDashboardPage } from '../pages/question-dashboard/question-dashboard';
import { PhotoLibrary } from '@ionic-native/photo-library';
import { RemarksPage } from '../pages/remarks/remarks';
import { RegistryListPageModule } from '../pages/registry-list/registry-list.module';
import { UpdateLocalSchoolDataProvider } from '../providers/update-local-school-data/update-local-school-data';
import { FeedbackPage } from '../pages/feedback/feedback';
import { DetailPage } from '../pages/detail/detail';
import { Device } from '@ionic-native/device';
import { ExtendedDeviceInformation } from '@ionic-native/extended-device-information';
import { GeneralQuestionListPageModule } from '../pages/general-question-list/general-question-list.module';
import { GeneralQuestionPage } from '../pages/general-question/general-question';
import { GeneralQuestionSubmitPage } from '../pages/general-question-submit/general-question-submit';
import { SlackProvider } from '../providers/slack/slack';
import { Keyboard } from '@ionic-native/keyboard';
import { LocalStorageProvider } from '../providers/local-storage/local-storage';
import { HTTP } from '@ionic-native/http';
import { IndividualListingPage } from '../pages/individual-listing/individual-listing';
import { ProgramDetailsPage } from '../pages/program-details/program-details';
import { InstitutionsEntityList } from '../pages/institutions-entity-list/institutions-entity-list';
import { EntityProfilePageModule } from '../pages/entity-profile/entity-profile.module';
import { ObservationsPageModule } from '../pages/observations/observations.module';
import { AssessmentServiceProvider } from '../providers/assessment-service/assessment-service';
import { Deeplinks } from '@ionic-native/deeplinks';
import { SolutionDetailsPage } from '../pages/solution-details/solution-details';
import { IonicStepperModule } from 'ionic-stepper';
import { ObservationProvider } from '../providers/observation/observation';
import { AssessmentAboutPage } from '../pages/assessment-about/assessment-about';

@NgModule({
  declarations: [
    MyApp,
    AboutPage,
    HomePage,
    WelcomePage,
    InstitutionsEntityList,
    FaqPage,
    EntityProfileEditPage,
    ImageListingPage,
    MatrixActionModalPage,
    QuestionDashboardPage,
    SolutionDetailsPage,
    RemarksPage,
    FeedbackPage,
    DetailPage,
    GeneralQuestionPage,
    GeneralQuestionSubmitPage,
    IndividualListingPage,
    ProgramDetailsPage,
    AssessmentAboutPage
  ],
  imports: [
    BrowserAnimationsModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    TranslateModule.forRoot(
      {
        loader: {
         provide: TranslateLoader,
         useFactory: (setTranslateLoader),
         deps: [HttpClient]
       }
      }
    ),
    LoginPageModule,
    HttpModule,
    HttpClientModule,
    EntityProfilePageModule,
    EvidenceListPageModule,
    SectionListPageModule,
    QuestionerPageModule,
    ComponentsModule,
    DirectivesModule,
    RatingCriteriaListingPageModule,
    RatingPageModule,
    RatedCriteriaListPageModule,
    RegistryListPageModule,
    GeneralQuestionListPageModule,
    IonicStepperModule,

    ObservationsPageModule  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    AboutPage,
    HomePage,
    WelcomePage,
    InstitutionsEntityList,
    FaqPage,
    EntityProfileEditPage,
    ImageListingPage,
    SolutionDetailsPage,
    MatrixActionModalPage,
    QuestionDashboardPage,
    RemarksPage,
    FeedbackPage,
    DetailPage,
    GeneralQuestionPage,
    GeneralQuestionSubmitPage,
    IndividualListingPage,
    ProgramDetailsPage,
    
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    InAppBrowser,
    AuthProvider,
    CurrentUserProvider,
    Network,
    SchoolListProvider,
    // HttpInterceptorProvider,
    // {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorProvider, multi: true},
    UtilsProvider,
    ApiProvider,
    AndroidPermissions,
    Geolocation,
    Diagnostic,
    Camera,
    File,
    FilePath,
    FileTransfer,
    ImagePicker,
    LocationAccuracy,
    PhotoLibrary,
    RatingProvider,
    NetworkGpsProvider,
    FeedbackProvider,
    EvidenceProvider,
    UpdateLocalSchoolDataProvider,
    Device,
    ExtendedDeviceInformation,
    SlackProvider,
    Keyboard,
    LocalStorageProvider,
    HTTP,
    AssessmentServiceProvider,
    Deeplinks,
    ObservationProvider

  ]
})
export class AppModule { }
export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
 }