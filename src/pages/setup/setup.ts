import { Component } from '@angular/core';
import { NavController,App,AlertController } from 'ionic-angular';
import { UserService } from "../../providers/UserService";
import { AppService } from "../../providers/AppService";
import { LoginPage } from '../login/login';
import { aboutPage } from '../about/about';
import { AppUpdateService } from "../../providers/AppUpdateService";
import { NativeService } from "../../providers/NativeService";

//declare let cordova:any;
//@ViewChild('myTabs') tabRef: Tabs;
@Component({
  selector: 'setup',
  templateUrl: 'setup.html'
})
export class setupPage {

  _version:any;
  private version:string="";
  private _text:string="立即更新"

  constructor(public navCtrl: NavController,
              public userService:UserService,
              public appCtrl: App,
              public alertCtrl: AlertController,
              public nativeService:NativeService,
              public appService:AppService,
              public appUpdateService:AppUpdateService
  ) {
    this.getmyVersion()
  }

  logout():void{
    this.userService.logout();
    this.appCtrl.getRootNav().setRoot(LoginPage);
  }

  goaboutPage(){
    this.navCtrl.push(aboutPage);
  }

  //获取当前版本
  getmyVersion(){
    this.nativeService.showAppVersion().then(_version=>{
      this._version='V'+_version;
      this.version=_version;
    }).catch(err=>{
      console.log(err);
    });
  }

  //获取当前最新版本
  getVersion() {

    this.nativeService.showLoading("正在查询...");
    let _message:string="";
     this.appService.getAppversion().then(v=>{
       this.nativeService.hideLoading();
       if(!this.cheakVersion(this.nativeService.isAndroid()?v.version:v.iosVersion,this.version)){
         _message="您当前的版本已经是最新版本";
         this._text="确定";
       }else{
         _message='检测到最新版本为：V'+v.version;
         this._text="立即更新";
       }

       let confirm = this.alertCtrl.create({
         title: '产品版本提示',
         message: _message,
         buttons: [
           {
             text: '取消',
             handler: () => {
               console.log('Disagree clicked');
             }
           },
           {
             text: this._text,
             handler: () => {
               if(this._text!="确定") {
                 this.appUpdateService.upgradeAppService(v.vurl,v.appStoreurl);
                 console.log('updata');
               }
               console.log('Agree clicked');
             }
           }
         ]
       });
       setTimeout(() => {
         confirm.present();
       }, 400);

     }).catch(e=>{console.log(e)});
  }

  //检查版本号
  cheakVersion(newVersion:string,oldVersion:string){
    let newVersionArr=newVersion.split(".");
    let oldVersionArr=oldVersion.split(".");
    if(parseInt(newVersionArr[0])>parseInt(oldVersionArr[0])){
      return true;
    }else if(parseInt(newVersionArr[1])>parseInt(oldVersionArr[1])){
      return true;
    }else if(parseInt(newVersionArr[2])>parseInt(oldVersionArr[2])){
      return true;
    }else{
      return false;
    }

  }

}
