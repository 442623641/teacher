import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { StatusBar } from '@ionic-native/status-bar';
/*
  Generated class for the Welcome page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html'
})
export class WelcomePage {

  constructor(public navCtrl: NavController,
    private statusBar: StatusBar,) {
    
  }
  ngOnInit(){
    this.statusBar.hide();
  }
  goHome(){
    this.statusBar.show();
  	this.navCtrl.setRoot(TabsPage,{},{animate:true,animation:"wp-transition"});
  }
}
