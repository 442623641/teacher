import { Component } from '@angular/core';
import { NavController, NavParams,ViewController } from 'ionic-angular';
import { PaperOptions } from '../paperoptions/paperoptions';
import { PaperService } from "../../providers/PaperService";
import { Ikv,Selected,Options } from "../../model/paper.model";
import { NativeService } from "../../providers/NativeService";
import { MyResponse } from "../../model/page.model";
/*
  Generated class for the Papermenu page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-papermenu',
  templateUrl: 'papermenu.html'
})
export class PaperMenu {
  private noPageAnimate:boolean=false;
  _classes:any [];
  request:MyResponse=new MyResponse();
  menuClosed:boolean=false;
  onPop:Function;
  private tempSelected:Selected;
  options:Options;
  //是否正在加载班级列表
  private occupy:boolean=false;
  constructor(
  	private navCtrl: NavController, 
    private paperService:PaperService,
    private navParams: NavParams,
    private nativeService:NativeService,
    ) {}

  //选择考试
  examTapped(item:Ikv){
    if(item.code===this.tempSelected.exam.code){
      return;
    }
    this.occupy=true;
    this.tempSelected.exam=item;
    this.paperService.classes({examGuid:item.code}).then(res=>{
        if(!res||!res.classes||!res.classes.length){
          this.occupy=undefined;
          return;
        }   
        this._classes=res.classes;
        //this.paperService.setLocalClasses(res.classes);
        //重置class，subject
        this.options.classes=res.classes;
        this.options.subjects=res.subjects;

        //重置默认选择项
        this.classTapped(this.options.classes[0],this.options.school.code);
        this.occupy=false;
      });
  }
  //选择班级
  classTapped(item:Ikv,schoolGuid?:string){
    this.tempSelected.class=item;//{code:item.code,name:item.name};
    schoolGuid&&(this.tempSelected.schoolGuid=schoolGuid);
    this.subjectTapped(this.options.subjects[0]);
  }
  //选择科目
  subjectTapped(item:string){
    this.tempSelected.subject=item;
    if(this.options.subjects.length==1&&this.options.classes.length==1){
      this.menuClose(true);
    }
  }
  menuClose(commit?:boolean){
  	//this.viewCtrl.dismiss();
    this.menuClosed=true;
  	//this.nativeService.pageLeave();
  	this.navCtrl.pop().then(()=>{
  		this.onPop(commit?this.tempSelected:commit);
  	});
  }

  ngAfterViewInit(){
    //this.noPageAnimate=true;
  	this.tempSelected=this.navParams.get('selected');

    this.paperService.getLocalOptions().then((re)=>{

      this.paperService.classes({examGuid:this.tempSelected.exam.code}).then(res=>{
        this.options=new Options(re.exams,(res.classes&&res.classes.length?res.classes:[{name:'',code:'',list:[]}]),res.subjects,re.total);
        this._classes=res.classes;
        this.request.status=200;
      }).catch(res=> this.request=res.status?res:{status:700,message:""});
    });
    
    this.onPop=this.navParams.get('onMenuPop');
  }
  onOptionsPop(item:any,schoolGuid?:string){
    setTimeout(()=>this.noPageAnimate=false,5200);
    if(!item){
      return ;
    }
    if(schoolGuid){
      this.classTapped(item,schoolGuid);
    }else{
      this.examTapped(item);
    }
  }

  //click event for more exams
  allTapped(key:string):void{
      this.noPageAnimate=true;
      this.menuClosed=true;
      //this.nativeService.pageEnter();
      this.navCtrl.push(PaperOptions,
        {key:key,value:this.tempSelected[key].code,onPop:this.onOptionsPop.bind(this),classes:(key=="class"?this._classes:null)},
        //{animate:!this.nativeService.native}
      ).then(()=>setTimeout(()=>this.noPageAnimate=false,800));
      

  }

  setDeafultTempSelected(options:any){
    this.tempSelected=new Selected(
      {name:options.exams[0].name,code:options.exams[0].code},
      {name:options.classes[0].name,code:options.classes[0].code},
      options.subjects[0],
      options.school.code);

  }

  ionViewWillLeave(){
    this.menuClosed||this.onPop();
    this.menuClosed=false;

  }

}
