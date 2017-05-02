import { Component} from '@angular/core';
import { Platform ,IonicApp,App} from 'ionic-angular';
import { NativeAudio } from '@ionic-native/native-audio';
import { Keyboard } from '@ionic-native/keyboard';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { UserService } from "../providers/UserService";
import { HttpService } from "../providers/HttpService";
import { AppService } from "../providers/AppService";
import { NativeService } from "../providers/NativeService";
import { TabsPage } from '../pages/tabs/tabs';
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from '../pages/login/login';
import { AppUpdateService } from "../providers/AppUpdateService";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  //@ViewChild(Nav) nav: Nav;
  keyboardShow:any;
  rootPage: any;
  constructor(
    private nativeAudio: NativeAudio,
    private keyboard: Keyboard,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private userService: UserService,
    private httpService:HttpService,
    private platform: Platform,
    private nativeService:NativeService,
    private appService:AppService,
    private ionicApp: IonicApp,
    private app: App,
    public appUpdateService:AppUpdateService,
    ){}
  ngOnInit(){
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
        this.keyboard.disableScroll(true);
        this.nativeAudio.preloadComplex('keyboard', 'assets/sounds/keyboard.wav',0.6,1,0);
        this.nativeAudio.preloadComplex('sent', 'assets/sounds/sent.wav',0.6,1,0);

        this.platform.registerBackButtonAction(() =>this.hardwareBack());

        //友盟统计初始化
        let mobclickAgent = (<any>window).MobclickAgent;
        if(mobclickAgent){
          mobclickAgent.init();
          mobclickAgent.setDebugMode(false);
        }

        document.addEventListener("resume", () =>{
          this.forcedUpdate();
        }, false);
    });

  }
  forcedUpdate(){
      this.appService.getAppversion().then(v=>{
          if(v.isForcedUpdate){
              this.nativeService.showAlert("检测到有重要版本发布，请立即更新！","确定","温馨提示").then(()=>{
                  this.appUpdateService.upgradeAppService(v.vurl,v.appStoreurl);
              });
          }
      });
  }

  hardwareBack(){
      //close keyborad when it on openning;
      console.log('keyboardShow',this.keyboardShow);
      if(this.keyboardShow){
        this.keyboard.close();
        return;
      }

      let ready = true;
      //console.log("Back button action called");
      let activePortal = this.ionicApp._loadingPortal.getActive() ||
         this.ionicApp._modalPortal.getActive() ||
         this.ionicApp._toastPortal.getActive() ||
         this.ionicApp._overlayPortal.getActive();
      //debugger;
      if (activePortal) {
         ready = false;
         activePortal.dismiss();
         activePortal.onDidDismiss(() => { ready = true; });
         console.log("handled with portal");
         return;
      }
      let nav = this.app.getActiveNav();
      let view = nav.getActive();
      let page = view ? view.instance : null;
      if(page && page instanceof LoginPage ){
        this.platform.exitApp();
        return;
      }

      if (!nav.canGoBack()) {
         window['plugins'].appMinimize.minimize();
      }
      else if(nav.canGoBack() || view && view.isOverlay) {
         nav.pop();
      }
      else {
         console.log("ERROR with back button handling");
      }
  }

  ngAfterViewInit(){
    setTimeout(()=>this.forcedUpdate(),3000);
    this.httpService.getLocalInfo().then(info=>{
      this.httpService.local=info||{};
      this.userService.getLocalVersion().then(version=>{
      this.nativeService.showAppVersion().then(code=>{
          if(version!=code){
            this.rootPage=WelcomePage;
          }else{
            this.rootPage=TabsPage;
          }
          setTimeout(()=>{
            this.splashScreen.hide(); 
            this.statusBar.styleDefault();
            this.nativeService.isIos()||this.statusBar.backgroundColorByHexString('#ffffff');
          },300);
          this.userService.setLocalAppVersion(code);
        })
      })
    });
    this.keyboard.onKeyboardShow().subscribe(data =>this.keyboardShow=true);
    this.keyboard.onKeyboardHide().subscribe(data =>this.keyboardShow=false);
  }
}
