import { Component } from '@angular/core';
import { NavController,ToastController } from 'ionic-angular';
import { changepassword2Page } from '../changepassword2/changepassword2';
import {AppService} from "../../providers/AppService";
import {NativeService} from "../../providers/NativeService";

@Component({
  selector: 'changepassword',
  templateUrl: 'changepassword.html'
})
export class changepasswordPage {

  login: {usercode?: string, vcode?: string} = {usercode:'',vcode:''};
  _time:number=60;
  _vcodeStr:string="获取验证码";
  maincolor:string="mainOrange";
  buttonDisabled:boolean=false;
  spinner:boolean=false;
  private timer;

  constructor(public navCtrl: NavController,public toastCtrl:ToastController,public appService:AppService,
    public nativeService:NativeService,
              ) {}

  nextPage(){
    if(!this.login.usercode||!(/^1[34578]\d{9}$/.test(this.login.usercode))){
      this.presentToast('请输入正确的手机号码');
      return;
    }
    if(!this.login.vcode){
      this.presentToast('请输验证码');
      return;
    }

    //检查验证码是否正确，正确进入下一步
    this.spinner=true;
    this.appService.checkVcode(this.login.vcode).then(v=>{
      this.spinner=false;
      if(v.result){
        this.navCtrl.push(changepassword2Page, {userCode: this.login.usercode, vCode: this.login.vcode});
        this.clearTimer();
      }
      else {
        this.presentToast('验证码错误！');
        this.clearTimer();
        return;
      }
    })
  }

  //获取验证码
  getvcode(){
    if(!this.login.usercode||!(/^1[34578]\d{9}$/.test(this.login.usercode))){
      this.presentToast('请输入正确的手机号码');
      return;
    }
    this.isetInterval();
    this.appService.getVcode(this.login.usercode).then(v=>{
      this.presentToast(v.msg);
      if(!v.result){
        this._time=10;
        clearInterval(this.timer);
        this.isetInterval();
      }
    });

  }

  presentToast(msg){
    this.nativeService.showToast(msg);
  }

  //验证码倒计时
  isetInterval() {
    this.maincolor="maindiscolor";
    this.buttonDisabled=true;
    this._vcodeStr=this._time+"秒后可重发";
    this.timer = setInterval(() => {
      this._time--;
      this._vcodeStr=this._time+"秒后可重发";
      if(this._time==0){
        this.clearTimer();
      }
    }, 1000);
  }

  //销毁组件时清除定时器
  clearTimer() {
    this._vcodeStr="重发验证码";
    this._time=60;
    this.maincolor="mainOrange";
    this.buttonDisabled=false;
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
  ionViewWillLeave(){
    if(this.nativeService.isIos()) {
      this.nativeService.showKeyboard(false);
    }
  }
}
