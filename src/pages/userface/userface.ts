import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { UserService } from "../../providers/UserService";
import {AppService} from "../../providers/AppService";


@Component({
  selector: 'userface',
  templateUrl: 'userface.html'
})
export class userfacePage {
  //@ViewChild(usercenterPage) multiPicker:usercenterPage;
  _userName:string="";
  _schoolName:string="";
  userinfoObj:any;
  schoolName;
  Avatar:Array<string>=[];
  myFace:string="avatar-0.jpg";
  data:{head:string}={head:this.myFace};
  headUrl:string="";
  
  constructor(public navCtrl: NavController,
              public userService: UserService,
              public appService:AppService
  ) {}

  selectAvatar(_Avatar){
    this.myFace=_Avatar;
    this.data.head=this.myFace;
    this.userinfoObj.head=_Avatar;
    this.userService.setUserInfo(this.userinfoObj);
    this.appService.uploadHeadInfo(this.data).then(res=>{
      console.log("设置成功");
    }).catch(err=>{
      console.log(err);
    })
  }

  ionViewDidLoad() {
    this.userService.getUserInfo().then(value => {
      this._schoolName=value.schoolName;
      this._userName=value.name;
      this.myFace=value.head;
      this.headUrl=value.headUrl;
      this.userinfoObj = value;
    });

    for(let i=0; i<4; i++){
      this.Avatar.push("avatar-"+i+".jpg");
    }
  }

}
