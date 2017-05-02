/*
 *add by leo 201703151706003
 *阅卷菜单
*/
import { Component } from '@angular/core';
import { ViewController} from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { NativeService } from "../../../providers/NativeService";
import { MarkCheakService } from "../../../providers/MarkCheakService";

@Component({
  selector: 'page-markBackMenu',
  templateUrl: 'markbackmenu.html'
})
export class PropoverMarkBackMenu {

  refreshOptions:boolean=false;
  exceptionItem:string="";
  paramsData:any;
  callbackyc:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public nativeService:NativeService,
    public markCheakService:MarkCheakService,) {

  }
  ngAfterViewInit(){
    this.paramsData=this.navParams.get("task");
    this.callbackyc=this.navParams.get('callbackyc');
  }

    dismiss(exit:boolean=false) {
    this.viewCtrl.dismiss({exit:exit,refreshOptions:this.refreshOptions});
  }

  saveOptions(){
    console.log(this.paramsData.errType);
    if(this.paramsData.errType==undefined){
      this.nativeService.showToast("请选择异常类型");
      return;
    }else {
      this.markCheakService.markbackExceptionSubmit(this.paramsData).then(submitRes=> {

        this.callbackyc(this.paramsData).then(()=>{
          this.dismiss();
        });
      }).catch(err=> {
        console.log(err);
      });
    }
  }
  setException(item:string=""){
    this.exceptionItem=item;
    this.paramsData.errType=item;
  }

}
