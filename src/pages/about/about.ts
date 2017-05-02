import { Component } from '@angular/core';
import { NavController,App } from 'ionic-angular';
import { AppService } from "../../providers/AppService";

//@ViewChild('myTabs') tabRef: Tabs;
@Component({
  selector: 'about',
  templateUrl: 'about.html'
})
export class aboutPage {

  private introduction:string="";
  constructor(public navCtrl: NavController,public appService:AppService) {

  }

  escapeChars(str) {
    str = str.replace(/&/g, '&amp;');
    str = str.replace(/</g, '&lt;');
    str = str.replace(/>/g, '&gt;');
    str = str.replace(/'/g, '&acute;');
    str = str.replace(/"/g, '&quot;');
    str = str.replace(/\|/g, '&brvbar;');
    return str;
  }

  ionViewDidLoad() {
    this.appService.getIntroduction().then(Introduction=> {
      this.introduction = Introduction.introduction;
      console.log(Introduction.introduction)
    })
  }


}
