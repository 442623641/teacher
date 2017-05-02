import { NgModule, ErrorHandler,enableProdMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { IonicStorageModule } from '@ionic/storage';
import { MyApp } from './app.component';
import { HttpModule } from '@angular/http';
import { MultiPickerModule } from 'ion-multi-picker';
import { IonicImageViewerModule } from 'ionic-img-viewer';
enableProdMode();
/* 
* native plugins 
*/
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AppVersion } from '@ionic-native/app-version';
import { CallNumber} from '@ionic-native/call-number';
import { Toast } from '@ionic-native/toast';
import { Dialogs } from '@ionic-native/dialogs';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HTTP } from '@ionic-native/http';
import { Keyboard } from '@ionic-native/keyboard';
import { NativeAudio } from '@ionic-native/native-audio';
import { AppUpdate } from '@ionic-native/app-update';
/* 
* pages 
*/
import { WelcomePage } from '../pages/welcome/welcome';
import { TabsPage } from '../pages/tabs/tabs';
import { LoginPage } from '../pages/login/login';
import { ForgetPage } from '../pages/forget/forget';
import { Forget2Page } from '../pages/forget2/forget2';

import { PaperPage } from '../pages/paper/paper';
import { PaperOptions } from '../pages/paperoptions/paperoptions';
import { PaperMenu } from '../pages/papermenu/papermenu';
import { ScorentityPage } from '../pages/scorentity/scorentity';
import { AnswerentityPage } from '../pages/answerentity/answerentity';

import { MarkcheakPage } from '../pages/markcheak/markcheak';
import { MarkbackPage } from '../pages/markback/markback';
import { MarkPage } from '../pages/mark/mark';
import { MarkProgressPage } from '../pages/markprogress/mark-progress';
import { MarkingPage } from '../pages/marking/marking';

import { usercenterPage } from '../pages/usercenter/usercenter';
 import { changepasswordPage } from '../pages/changepassword/changepassword'; 
import { changepassword2Page } from '../pages/changepassword2/changepassword2'; 
import { feedbackPage } from '../pages/feedback/feedback';
 import { setupPage } from '../pages/setup/setup';
 import { aboutPage } from '../pages/about/about';
import { userfacePage } from '../pages/userface/userface';
/* 
* propovers 
*/
import { PropoverMarkMenu } from '../pages/propovers/markmenu/markmenu';
import { PropoverMarkBackMenu } from '../pages/propovers/markbackmenu/markbackmenu';
/* 
* components 
*/
import { Rubber} from '../components/rubber';
import { VirtualSlides } from '../components/virtualSlides';
import { Loading } from '../pages/loading/loading';
import { PhotosViewer } from '../pages/photosviewer/photos-viewer';
import { ZoomableImage } from '../pages/zoomableimage/zoomable-image';
import { PhotoView } from '../components/photoViewer';
import { ElasticLine } from '../components/elasticLine';
import { Countdown } from '../components/countdown';
import { ImgLazyLoader } from '../components/imgLazyLoader';
import { RippleButton } from '../components/ripple';
/* 
* services 
*/
import {NativeService} from "../providers/NativeService";
import { HttpService } from "../providers/HttpService";
import { UserService } from "../providers/UserService";
import { PaperService } from "../providers/PaperService";
import {MarkService} from "../providers/MarkService";
import {MyErrorHandler} from "../providers/MyErrorHandler";
import {MarkingService} from "../providers/MarkingService";
import {MarkCheakService} from "../providers/MarkCheakService";
import { AppUpdateService } from "../providers/AppUpdateService";
import { HttpHandler } from "../providers/HttpHandler";
import { Chart } from "../providers/Chart";
import { AppService} from "../providers/AppService";

/* 
* pipe 
*/
import { Progress } from "../pipes/mark.pipe";

/* 
* directives 
*/
import { SoundableDirective } from '../directives/soundable.directive';
import { ZoomableDirective } from '../directives/zoomableImage.directive';
import { ScrollableDirective } from '../directives/scrollable.directive';
import { TapPressDirective } from '../directives/tappress.directive';
/* 
* highcharts
*/
import { ChartModule } from 'angular2-highcharts';
import { HighchartsStatic } from 'angular2-highcharts/dist/HighchartsService';

declare var require: any;
export function highchartsFactory() {
      const highcharts = require('highcharts');
      const highchartsMore = require('highcharts/highcharts-more');
      highchartsMore(highcharts);
      return highcharts;
}

@NgModule({
  declarations: [
    MyApp,
    WelcomePage,
    TabsPage,
    LoginPage,
    ForgetPage,
    Forget2Page,
    PaperPage,
    PaperOptions,
    PaperMenu,
    MarkPage,
    MarkProgressPage,
    MarkingPage,
    ScorentityPage,
    AnswerentityPage,

    PropoverMarkMenu,

    usercenterPage,
    changepasswordPage,
    changepassword2Page,
    feedbackPage,
    setupPage,
    aboutPage,
    MarkcheakPage,
    MarkbackPage,
    userfacePage, 


    PropoverMarkBackMenu,
    /* 
    * components 
    */
    VirtualSlides,
    Loading,
    Rubber,
    PhotoView,
    ElasticLine,
    Countdown,
    PhotosViewer,
    ZoomableImage,
    ImgLazyLoader,
    RippleButton,

    /* 
    * directives 
    */
    ZoomableDirective,
    SoundableDirective,
    ScrollableDirective,
    TapPressDirective,

  /* 
  * pipe 
  */
    Progress

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp,
    {
      scrollAssist: false,    // Valid options appear to be [true, false]
      autoFocusAssist: false,  // Valid options appear to be ['instant', 'delay', false]
      backButtonText:'',
      mode:'ios',
      iconMode: 'ios',
      tabsPlacement: 'bottom',
      popoverEnter:"popover-md-pop-in",
      popoverLeave:"popover-md-pop-out",
      modalEnter:"modal-md-slide-in",
      modalLeave:"modal-md-slide-out",
      pageTransition: 'ios',
      tabsHideOnSubPages:true
    }),
    HttpModule,
    MultiPickerModule,
    IonicStorageModule.forRoot(),
    ChartModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
     MyApp,
    WelcomePage,
    TabsPage,
    LoginPage,
    ForgetPage,
    Forget2Page,
    PaperPage,
    PaperOptions,
    PaperMenu,
    MarkPage,
    MarkProgressPage,
    MarkingPage,
    ScorentityPage,
    AnswerentityPage,

    PropoverMarkMenu,

    usercenterPage,
    changepasswordPage,
    changepassword2Page,
    feedbackPage,
    setupPage,
    aboutPage,
    MarkcheakPage,
    MarkbackPage,
    userfacePage, 


    PropoverMarkBackMenu,
  /* 
  * components 
  */
    VirtualSlides,
    Loading,
    Rubber,
    PhotoView,
    ElasticLine,
    Countdown,
    PhotosViewer,
    RippleButton,
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    NativeService,
    UserService,
    HttpService,
    PaperService,
    Chart,
    HttpHandler,
    AppService,
    AppUpdateService,

    MarkingService,

    MarkService,
    MarkCheakService,
    {provide: HighchartsStatic, useFactory: highchartsFactory},
    SplashScreen,
    PhotoViewer,
    ScreenOrientation,
    CallNumber,
    NativePageTransitions,
    AppVersion,
    Toast,
    Dialogs,
    StatusBar,
    HTTP,
    Keyboard,
    NativeAudio,
    AppUpdate
  ]
})
export class AppModule {}
