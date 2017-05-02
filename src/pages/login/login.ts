import { Component } from '@angular/core';
import { NavController,App } from 'ionic-angular';
import { UserService } from "../../providers/UserService";
import { TabsPage } from '../tabs/tabs';
import { ForgetPage } from '../forget/forget';
import { NativeService } from '../../providers/NativeService';
import { Keyboard } from '@ionic-native/keyboard';
@Component({
  selector: 'login',
  templateUrl: 'login.html'
})

export class LoginPage {
  focus:boolean=false;
  login: {usercode?: string, password?: string} = {usercode:'',password:''};
  loging:boolean=false;
  nav:any;
  constructor(public navCtrl: NavController, 
    public userService: UserService,
    public appCtrl: App,
    private nativeService:NativeService,
    private keyboard: Keyboard) {  }
  ngOnInit() {
    this.userService.getLogin().then(res=>{
        res&&(this.login.usercode=res.usercode);
    });
    this.nav=this.appCtrl.getRootNav();
  }
  presentToast(msg){
    this.nativeService.showToast(msg);
  }
  onLogin() {
    if(this.loging){
      return;
    }
    //this.presentLoading();
    if(!this.login.usercode||!(/^1[34578]\d{9}$/.test(this.login.usercode))){
      this.presentToast('请输入正确的手机号码');
      return;
    }
    if(!this.login.password){
      this.presentToast('请输入密码');
      return;
    }
    this.loging=true;
    this.userService.login(this.login).then(res => {
      //(<any>window).MobclickAgent.profileSignInWithPUID(this.login.usercode);//友盟
      //console.log(res);
      //登陆记忆
      this.userService.setLogin(this.login);
      //初始数据
      this.userService.initialize(res);
      //测试写缓存
      this.nav.setRoot(TabsPage,{},{animate:true,animation:"wp-transition"}).catch((error)=>{
        this.presentToast(error);
      });
      this.loging=true;
    })
    .catch(res=>{
      this.loging=false;
      this.presentToast(res.message?res.message:"网络异常，请稍后再试");
    });
  }
  onFocus(e){
    this.focus=true;
    //this.keyboard.disableScroll(this.focus);
    //this.keyboard.show();
  }
  onBlur(e){
    this.focus=false;
    //this.keyboard.close();
  }

  onForgot() {
    this.navCtrl.push(ForgetPage);
  }
}
