import { Component } from '@angular/core';
import { NavController ,AlertController,ToastController,App} from 'ionic-angular';
import { AppService } from "../../providers/AppService";
import {UserService} from  "../../providers/UserService";
import {usercenterPage} from "../../pages/usercenter/usercenter";
import { NativeService } from '../../providers/NativeService';
import {isNumber} from "ionic-angular/es2015/util/util";

//@ViewChild('myTabs') tabRef: Tabs;
@Component({
  selector: 'feedback',
  templateUrl: 'feedback.html'
})
export class feedbackPage {

  txtContent:string="";
  _length:number=300;
  _n_length:number=0;

  constructor(public navCtrl: NavController,public alertCtrl: AlertController,public userService:UserService,public appCtrl: App,public toastCtrl:ToastController,
  public appService:AppService,private nativeService:NativeService) {
  }
  getContent(){
    this._length=300-this.txtContent.length;
    this._n_length=this.txtContent.length;
  }

  submitFeed(){
    if(this.txtContent.length===0){
      this.presentToast("请填写您要反馈的建议！");
      return;
    }
    this.appService.sendFeed(this.txtContent).then(v=>{

      if(v.result) {
        this.presentAlert("感谢您的建议，是否停留在当前页？")
        //this.presentToast("感谢您的建议!");
        this.txtContent="";
        return;
      }
      else {
        this.presentToast("提交失败，请重新提交！");
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
          text: '是',
          handler: () => {

          }
        },
        {
          text:'否',
          handler:()=>{
            this.appCtrl.getRootNav().setRoot(usercenterPage);
          }
        }
      ]
    });
    confirm.present();
  }

  presentToast(msg){
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
  ionViewWillLeave(){
    if(this.nativeService.isIos()) {
      this.nativeService.showKeyboard(false);
    }
  }

}
