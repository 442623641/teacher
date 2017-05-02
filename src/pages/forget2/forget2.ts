import { Component } from '@angular/core';
import { NavController,ToastController,NavParams,App,AlertController } from 'ionic-angular';
import { UserService } from "../../providers/UserService";
import {AppService} from "../../providers/AppService";
import { LoginPage } from '../login/login';
import { NativeService } from '../../providers/NativeService';
@Component({
  selector: 'forget-password',
  templateUrl: 'forget2.html'
})
export class Forget2Page {

  pass: {password?: string, newpassword?: string} = {password:'',newpassword:''};
  data: {userCode?: string, vCode?: string,password?: string} = {userCode:'',vCode:'',password:''};
  spinner:boolean=false;

  constructor(public navCtrl: NavController,public toastCtrl:ToastController,public navParams: NavParams,private nativeService:NativeService,
              public appService:AppService,public userService:UserService, public appCtrl: App,public alertCtrl: AlertController ) {
    //获取上一个页面传递的参数
    this.data.userCode=navParams.get('userCode');
    this.data.vCode=navParams.get("vCode");
  }

  changepassWrod(){
    if(!this.pass.password){
      this.presentToast("新密码不能为空！");
      return;
    }
    if(!this.pass.newpassword){
      this.presentToast("您需要再次输入一次密码！");
      return;
    }
    if(this.pass.newpassword!=this.pass.password){
      this.presentToast("两次密码输入不一至！");
      return;
    }
    if(this.pass.newpassword.length<6){
      this.presentToast("至少输入6位密码！");
      return;
    }

    this.spinner=true;
    this.data.password=this.pass.password;
    this.appService.changeBackPassWord(this.data).then(v=>{

      this.spinner=false;
      this.pass.newpassword='';
      this.pass.password='';

      if(v.result) {
        this.presentAlert("密码找回成功，请登陆！");
        return;
      }
      else{
        this.presentToast("修改密码失败！");
        return;
      }
    });

  }

  presentAlert(msg){
    let confirm = this.alertCtrl.create({
      title: '温馨提示',
      message: msg,
      buttons: [
        {
          text: '确定',
          handler: () => {
            this.appCtrl.getRootNav().setRoot(LoginPage);
          }
        }
      ]
    });
    confirm.present();
  }

  presentToast(msg){
    this.nativeService.showToast(msg);
  }
  ionViewWillLeave(){
    if(this.nativeService.isIos()) {
      this.nativeService.showKeyboard(false);
    }
  }
}
