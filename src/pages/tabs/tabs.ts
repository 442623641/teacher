import { Component,ViewChild } from '@angular/core';
import { PaperPage } from '../paper/paper';
import { NavController,Tabs } from 'ionic-angular';
import { MarkPage } from '../mark/mark';
import { usercenterPage } from '../usercenter/usercenter';
import { LoginPage } from '../login/login';
import { NativeService } from "../../providers/NativeService";
import { UserService } from "../../providers/UserService";
import { HttpHandler } from "../../providers/HttpHandler";
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  @ViewChild(Tabs) tabs: Tabs;
  showToast:boolean=false;
  isShowLogin:boolean=false;
  paperRoot: any = PaperPage;
  scoringRoot: any = MarkPage;
  usercenterRoot: any = usercenterPage;
  constructor( 
    private nativeService:NativeService,
    public navCtrl: NavController,
    private handleService:HttpHandler,
    private userService: UserService) {}
  ngOnInit(){
    this.initialize();
  }
  initialize(){
    this.handleService.handleAuth$.subscribe((message)=>{
      if(!this.isShowLogin){
        this.isShowLogin=true;
        this.navCtrl.push(LoginPage,{},{animate:true,animation:"wp-transition"});
        this.presentToast(message);
        this.userService.logout();
      }
      //setTimeout(()=>this.isShowLogin=false,60000);
    });
    //handle event of http response with 403
    this.handleService.handleMessage$.subscribe((message) => {
      this.presentToast(message);
      console.log(message);
    });
  }
  presentToast(msg){
    if(!this.showToast){
      this.nativeService.showToast(msg);
      this.showToast=true;
      setTimeout(()=>this.showToast=false,2000);
    }
  }
  refresh(e){
    //console.log(this.tabs);
    let nav=this.tabs.getActiveChildNav();
    let refreshPage=e===0?PaperPage:MarkPage;
    //nav.root=PaperPage;
    //nav.setRoot(PaperPage);
    //console.log(this.navCtrl);
    //console.log(this.navCtrl)
    setTimeout(()=>nav.setRoot(refreshPage),500);
    //console.log(nav);
    //console.log('tabs',e);

  }

}
