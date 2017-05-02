/**
 * added by 442623641@qq.com 201703161032.
 * 原生API
 */
import {Injectable} from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { AppVersion } from '@ionic-native/app-version';
import { CallNumber} from '@ionic-native/call-number';
import { Toast } from '@ionic-native/toast';
import { Dialogs } from '@ionic-native/dialogs';
import { StatusBar } from '@ionic-native/status-bar';
import { Keyboard } from '@ionic-native/keyboard';
import { NativePageTransitions } from '@ionic-native/native-page-transitions';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { ToastController, LoadingController, Platform, Loading, AlertController,ModalController,Config} from 'ionic-angular';
//import {AppVersion, Toast,Dialogs} from 'ionic-native';
import {Observable} from "rxjs";

//import { PhotoView } from '../components/photoViewer';
import { PhotosViewer } from '../pages/photosviewer/photos-viewer';

declare var LocationPlugin;
declare var AMapNavigation;
declare var cordova: any;
@Injectable()
export class NativeService {
  private loading: Loading;
  private loadRunning: boolean = false;
  public native:boolean;

  constructor(private platform: Platform,
              private toastCtrl: ToastController,
              private alertCtrl: AlertController,
              private loadingCtrl: LoadingController,
              private modalCtrl:ModalController,
              private photoViewer:PhotoViewer,
              private screenOrientation: ScreenOrientation,
              private callNumber:CallNumber,
              private nativePageTransitions: NativePageTransitions,
              private appVersion:AppVersion,
              private toast:Toast,
              private dialogs:Dialogs,
              private keyboard:Keyboard,
              private statusBar: StatusBar,
              private config:Config){
    this.native=platform.is('mobile') && !platform.is('mobileweb');
  }

  /**
   * 是否真机环境
   * @return {boolean}
   */
  isMobile() {
    return this.platform.is('mobile') && !this.platform.is('mobileweb');
  }

  /**
   * 是否android真机环境
   * @return {boolean}
   */
  isAndroid() {
    return this.isMobile() && this.platform.is('android');
  }

  /**
   * 是否ios真机环境
   * @return {boolean}
   */
  isIos() {
    return this.isMobile() && (this.platform.is('ios') || this.platform.is('ipad') || this.platform.is('iphone'));
  }

  isIpad() {
    return this.isMobile() && this.platform.is('ipad');
  }

  showStatusBar(){
    if (this.native) {
      this.statusBar.show();
    }else{
      return ;
    }
  }
  hideStatusBar(){
    if (this.native) {
      this.statusBar.hide();
    }else{
      return ;
    }
  }
  /**
   * 统一调用此方法显示提示信息
   * @param message 信息内容
   * @param duration 显示时长
   */
  showToast = (message: string = '操作完成', duration: number = 2000) => {
    //let color=bg=="white"?"#333333":'#FFFFFF';
    if (this.native) {
      console.log('showToast',message);
      this.toast.show(message, String(duration), 'top').subscribe();
      return new Observable(observer => {
          setTimeout(() => {
              observer.next(42);
              observer.complete();
          }, 2000);
      });
      /*
      Toast.showWithOptions({
        message:message,
        duration:String(duration),
        position:'top',
        styling:{ opacity:0.7, 
          cornerRadius: 5 }
        });*/
    } else {
      this.toastCtrl.create({
        message: message,
        duration: duration,
        position: 'top',
        showCloseButton: false,
      }).present();
      return new Observable(observer => {
          setTimeout(() => {
              observer.next(42);
              observer.complete();
          }, 2000);
      });
    }
  };
  landscape=()=>{
    if (this.native) {
        // get current
        //console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'
        // set to landscape
        return this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE).then(()=>
            console.log(this.screenOrientation.type));
      }else{
        return new Promise((resolve, reject) => {
            resolve(null);
        });
      }
  }
  isLandscape=()=>{
    return this.screenOrientation.type==this.screenOrientation.ORIENTATIONS.LANDSCAPE
    ||this.screenOrientation.type==this.screenOrientation.ORIENTATIONS.LANDSCAPE_SECONDARY;
  }
  portrait=()=>{
    if (this.native) {
    // get current
      console.log(this.screenOrientation.type); // logs the current orientation, example: 'landscape'
      // set to landscape
      //this.screenOrientation.unlock();
      let lock= this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
      this.screenOrientation.unlock();
      return lock;
    }
    else{
      return new Promise((resolve, reject) => {
        resolve(null);
      });
    }
  }
  /**
   * 对话框
   * @param msg 信息内容
   * @buttons 按钮
   * @return {Promise<T>}
   */
  showConfirm=(msg:string="确定这样做？",btns:Array<string>=["确认","取消"])=> {
      if (this.native) {
        return this.dialogs.confirm(msg,'',btns).then(btn=>{return btn-1});
      } 
      return new Promise((resolve, reject) => {
        let confirm = this.alertCtrl.create({
          title:null,
          message: msg,
          buttons: [
            {
              text: btns[0],
              handler: () => {
                console.log('Disagree clicked');
                resolve(1);
              }
            },
            {
              text: btns[1],
              handler: () => {
                console.log('Agree clicked');
                resolve(2);
              }
            }
          ]
        });
        confirm.present();
      });
  }
  /**
   * 对话框
   * @param msg 信息内容
   * @buttons 按钮
   * @return {Promise<T>}
   */
  showAlert=(msg:string="确定这样做？",btn:string="我知道了",title?:string)=> {
      if (this.native) {
        return this.dialogs.alert(msg,title,btn);
      } 
      return new Promise((resolve, reject) => {
        let confirm = this.alertCtrl.create({
          title:title,
          message: msg,
          buttons: [{
              text: btn,
              handler: () => {
                resolve(1);
              }
            }]
        });
        confirm.present();
      });
  }

  /**
   * 统一调用此方法显示loading
   * @param content 显示的内容
   */
  showLoading = (content: string = "加载中...") => {
    if (!this.loadRunning) {
      this.loadRunning = true;
      this.loading = this.loadingCtrl.create({
        spinner:'ios',
        content: content,
        showBackdrop:true,
        cssClass:"embedded",
        dismissOnPageChange:true,
        duration: 5000
      });
      this.loading.present();
      setTimeout(() => {//最长显示10秒
        //this.loading.dismiss();
        this.loadRunning = false;
      }, 5000);
    }
  };

  /**
   * 关闭loading
   */
  hideLoading = () => {
    if (this.loadRunning) {
      this.loading.dismiss();
      this.loadRunning = false;
    }
  };

  /**
   * 获得用户当前坐标
   * @return {Promise<T>}
   */
  getUserLocation() {
    return new Promise((resolve, reject) => {
      if (this.native) {
        LocationPlugin.getLocation(data => {
          resolve({'lng': data.longitude, 'lat': data.latitude});
        }, msg => {
          console.error('定位错误消息' + msg);
          alert(msg.indexOf('缺少定位权限') == -1 ? ('错误消息：' + msg) : '缺少定位权限，请在手机设置中开启');
          reject('定位失败');
        });
      } else {
        console.log('非手机环境,即测试环境返回固定坐标');
        resolve({'lng': 113.350912, 'lat': 23.119495});
      }
    });
  }
   /**
   * 图片预览
   * @param url
   * @param title
   */
   showImage(urls:string [],title:string){
    if (this.native&&urls.length===1) {
      let temps=(urls[0]).split('?');
      let url=encodeURI(temps[0])+(temps[1]?('?'+temps[1]):'');
      this.photoViewer.show(url, title, {share: false});
      console.log('url',url);
      // console.log('urlencode',encodeURI(urls[0]));
    }else{
      //let modal = this.modalCtrl.create(PhotoView,{ urls:urls,title:title});
      //modal.present();
      let modal = this.modalCtrl.create(PhotosViewer, {
        photos:urls,//.map(item=>{return {url:item}}),
        title:title,
      });
      modal.present();
    }
   }
  
  /**
   * 地图导航
   * @param startPoint 开始坐标
   * @param endPoint 结束坐标
   * @param type 0实时导航,1模拟导航,默认为模拟导航
   * @return {Promise<T>}
   */
  navigation(startPoint, endPoint, type = 1) {
    return new Promise((resolve, reject) => {
      if (this.platform.is('mobile') && !this.platform.is('mobileweb')) {
        AMapNavigation.navigation({
          lng: startPoint.lng,
          lat: startPoint.lat
        }, {
          lng: endPoint.lng,
          lat: endPoint.lat
        }, type, function (message) {
          resolve(message);//非手机环境,即测试环境返回固定坐标
        }, function (message) {
          alert('导航失败:' + message);
          reject('导航失败');
        });
      } else {
        this.showToast('非手机环境不能导航');
      }
    });
  }
  showKeyboard=(keyboard:boolean)=>{
    if(!close){
      return this.keyboard.close();
    }else{
      return this.keyboard.show();
    }
  }
  /**
   *  @name 获取app版本信息demo
   */
  showAppVersion() {
    if (!this.native) {
      return new Promise((resolve)=>{
        resolve('1.3.0');
      });
    }
    this.appVersion.getAppName().then(value => {
      console.log(value);//ionic2_tabs
    });
    this.appVersion.getPackageName().then(value => {
      console.log(value);//com.kit.platform
    });

    //return this.appVersion.getVersionCode();
    return this.appVersion.getVersionNumber();
    //AppVersion.getVersionNumber().then(value => {
    //  console.log(value);//0.0.1
    //});
  }
  /**
   *  @name 电话
   *  @param 号码
   */
  calling(number:any){
    if (!this.native) {
      location.href = "tel:"+number+"" ;
    }else{
      this.callNumber.callNumber(number,true)
      .then(() => console.log('Launched dialer!'))
      .catch(() => console.log('Error launching dialer'));
    }
  }
  /**
   *  @name 页面导航
   */
   get nav(){
    let defaults=(direction:string="forward")=>{
      return {
          direction: direction=='forward'?'left':'right',
          androiddelay: direction=='forward'?150:0,
          winphonedelay: direction=='forward'?250:0,
          duration: 400, // in milliseconds (ms), default 400,
          slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
          iosdelay: direction=='forward'?60:0, // ms to wait for the iOS webview to update before animation kicks in, default -1
          fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
          fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
        }
    }

    let push=(page:any,params?:any)=>{
        params=params||{};
        let modal=this.modalCtrl.create(page,params);
        if (this.native) {
          this.config.set('', 'animate', false);
          setTimeout(()=>{this.config.set('', 'animate', true)},1000);
          //modal.ionViewDidEnter=()=>{
          //  this.pageEnter();
          //}
        }
        modal.present();
        return modal;
    }
    let pop=(modal,params?:any)=>{
        params=params||{};
        if (this.native) {
          this.config.set('', 'animate', false);
          this.pageLeave();
          setTimeout(()=>{this.config.set('', 'animate', true)},500);
        } 
        modal.dismiss(params);
    }
    return {pop:pop,push:push};
  }
  /**
   *  @name 页面过场动画 进入新页面 ionViewDidEnter 调用
   *  
   */
  pageEnter(){
    if (!this.native){
      return new Promise((resolve)=>resolve(true));
    }
    let options={
      direction: 'left',
      duration: 400, // in milliseconds (ms), default 400,
      slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
      iosdelay: 50, // ms to wait for the iOS webview to update before animation kicks in, default -1
      androiddelay: 150, // same as above but for Android, default -1
      winphonedelay: 250, // same as above but for Windows Phone, default -1,
      fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
      fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    };
    return this.nativePageTransitions.slide(options);
  }
   /**
   *  @name 页面过场动画 退出页面 页面pop之前 调用
   *  
   */
  pageLeave(){
    if (!this.native){
      return new Promise((resolve)=>resolve(true));
    }
    let options={
      direction: 'right',
      duration: 400, // in milliseconds (ms), default 400,
      slowdownfactor: 4, // overlap views (higher number is more) or no overlap (1), default 4
      iosdelay: 0, // ms to wait for the iOS webview to update before animation kicks in, default -1
      androiddelay: 0, // same as above but for Android, default -1
      winphonedelay: 0, // same as above but for Windows Phone, default -1,
      fixedPixelsTop: 0, // the number of pixels of your fixed header, default 0 (iOS and Android)
      fixedPixelsBottom: 0, // the number of pixels of your fixed footer (f.i. a tab bar), default 0 (iOS and Android)
    };
    return this.nativePageTransitions.slide(options);
  }
  /**
   * @name 获取网络类型
   */
  getNetworkType() {
    if (!this.native) {
      return true;
    }
    return navigator['connection']['type'];// "none","wifi","4g","3g","2g"...
  }

  isConnecting() {
    return this.getNetworkType() != 'none';
  }
}
