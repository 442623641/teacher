import { Component ,ViewChild} from '@angular/core';
import { NavController } from 'ionic-angular';
import { changepasswordPage } from '../changepassword/changepassword';
import { feedbackPage } from '../feedback/feedback';
import { setupPage } from '../setup/setup';
import { UserService } from "../../providers/UserService";
import { userfacePage } from '../userface/userface';
import { NativeService } from "../../providers/NativeService";
import { AppService } from "../../providers/AppService";

@Component({
  selector: 'usercenter',
  templateUrl: 'usercenter.html'
})
export class usercenterPage {

  _userName:string="";
  _schoolName:string="";
  userinfoObj:any;
  schoolName;
  Avatar:string="";
  _headUrl:string="";
  private telNumber:string="";
  
  constructor(public navCtrl: NavController,
              public userService: UserService,
              public nativeService:NativeService,
              public appService:AppService
  ) {}
  gonewPage(){
    this.navCtrl.push(changepasswordPage);
  }

  gofeedbackPage(){
    this.navCtrl.push(feedbackPage);
  }

  gosetupPage(){
    this.navCtrl.push(setupPage);
  }

  callPhone(){
    if(this.nativeService.isAndroid()) {
      location.href = "tel:"+this.telNumber+"" ;
    }else{
      this.nativeService.calling(this.telNumber);
    }
  }

  openFace(){
    this.navCtrl.push(userfacePage);
  }

  resetMyFase(_Avatar){
    this.Avatar=this._headUrl+"/"+_Avatar;
    console.log(_Avatar);
  }

  ionViewDidLoad(){
    this.appService.getservicTel().then(tel=>{
      console.log(tel.tel);
      this.telNumber=tel.tel;
    })
    this.userinfoObj=this.userService.getUserInfo().then(value => {
      //console.log(value);
      this._headUrl=value.headUrl;
      this._schoolName=value.schoolName;
      this._userName=value.name;
      this.Avatar = value.headUrl + "/" + value.head;
    });
  }

  ionViewWillEnter(){
    console.log("2.0 ionViewWillEnter 当将要进入页面时触发");
    this.userService.getUserInfo().then(v=>{
      // this.Avatar=this._headUrl+"/"+v.head;
      this.Avatar="assets/avatar/"+v.head;

    })
  }
}
