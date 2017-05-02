/*
 *add by leo 201703151706003
 *阅卷菜单
*/
import { Component } from '@angular/core';
import { PopoverController ,ViewController} from 'ionic-angular';
import { NavController, NavParams } from 'ionic-angular';
import { MarkingService } from "../../../providers/MarkingService";
import { AppService } from "../../../providers/AppService";
import { NativeService } from "../../../providers/NativeService";
import { NativeAudio } from '@ionic-native/native-audio';
/*
  Generated class for the Markmenu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-markmenu',
  templateUrl: 'markmenu.html'
})
export class PropoverMarkMenu {
  config:{exception:boolean,entirety:boolean};
  settings:any={};
  processing:boolean=false;
  exceptionItem:string;
  refreshOptions:boolean=false;
  _nextSubject:Function;
  flip:boolean=false;
  page:string;
  task:any;
  optionMax:number=0;
  options:any []=[];
  localOptions: number []=[];
  constructor(
    private appService:AppService,
    private navCtrl: NavController, 
    private navParams: NavParams,
    private viewCtrl: ViewController,
    private markingService:MarkingService,
    private nativeService:NativeService,
    private nativeAudio:NativeAudio
    ) {
      this.config=navParams.get('config');
      //this.isEntiretyAuth=navParams.get('entirety')
  }
  get localOptionsKey():string{
    return this.task.examGuid+this.task.km+this.task.th;
  }
  ngAfterViewInit(){ 
      this.task=this.navParams.get("task");
      this.optionMax=this.navParams.get("optionMax");
      //this.settings=this.navParams.get('settings');
      for(let i=0;i<=this.optionMax;i++) this.options.push([i,false]);
      this._nextSubject=this.navParams.get("next");
      this.markingService.getLocalOptions(this.localOptionsKey).then((res)=>{
        if(this.nativeService.native){
          let callback=this.navParams.get("callback");
          callback&&setTimeout(()=>this.next(callback),800);
        }
        if(!res) return;
        this.localOptions=res;
        for(let i=0;i<this.options.length;i++){
          this.options[i][1]=this.localOptions.indexOf(this.options[i][0])>-1;
        }
      }); 
  }
  nextSubject(){
    this.viewCtrl.dismiss();
    this._nextSubject();
  }
  optionTapped(index:number){
    this.options[index][1]=!this.options[index][1];
  }
  saveOptions(){
    //this.appService.setConfiguration(this.settings);
    //let loadAudio=()=>this.settings.audio&&this.nativeAudio.preloadComplex('keyboard', 'assets/sounds/keyboard.wav',0.6,1,0);
    //this.nativeAudio.unload('keyboard');
    //setTimeout(()=>loadAudio(),1000);
    this.localOptions.length=0;
    this.refreshOptions=true;
    this.options.forEach((item)=>{
      item[1]&&this.localOptions.push(item[0]);
    });
    this.markingService.setLocalOptions(this.localOptionsKey,this.localOptions);
    this.dismiss();
  }
  next(name?:string){
  	name&&(this.page=name);
  	setTimeout(()=>{this.flip=!this.flip;},100);
  }
  dismiss(exit:boolean=false) {
    this.viewCtrl.dismiss({exit:exit,refreshOptions:this.refreshOptions,configuration:this.settings});
  }
  exception(item){
    //this.task.ru，examGuid，km，th，regionGuid，teacherGuid，yjType
    this.processing=true;
    this.markingService.exception({ru:this.task.ru,
      examGuid:this.task.examGuid,
      km:this.task.km,th:this.task.th,regionGuid:this.navParams.get("regionGuid"),
      teacherGuid:this.task.teacherGuid,
      errType:this.exceptionItem,
      yjType:this.task.yjType,
      }).then(res=>{
        this.processing=false;
        this.nativeService.showToast('提交成功');
        this._nextSubject();
        this.dismiss();
        //this.next();
      }).catch(()=>{
        this.processing=true;
        this.nativeService.showToast('网络异常，请稍后再试');
      });

  }
  setException(item:string){
    this.exceptionItem=item;
  }
  entirePaper(){
    this.nativeService.showImage([this.markingService.entirePaper+'&ru='
      +this.task.ru+'&examGuid='+
      this.task.examGuid+'&regionGuid='+
      this.navParams.get("regionGuid")],
      this.navParams.get("examName")+this.task.km);
  }
}
