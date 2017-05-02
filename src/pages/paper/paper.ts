import { Component} from '@angular/core';

import { NavController} from 'ionic-angular';
import { PaperService } from "../../providers/PaperService";
import { NativeService } from '../../providers/NativeService';

import { Chart } from "../../providers/Chart";
import { ScorentityPage } from '../scorentity/scorentity';
import { AnswerentityPage } from '../answerentity/answerentity';
import { PaperMenu } from '../papermenu/papermenu';
import { Selected,Options } from "../../model/paper.model";
import { MyResponse } from "../../model/page.model";

@Component({
  selector: 'paper-page',
  templateUrl: 'paper.html'
})
export class PaperPage {
  private request:MyResponse=new MyResponse();

  private showMenu:boolean=false;
  private backdrop:number=0;
  private selected:Selected;
  private options:{score:any,item:any}={score:null,item:null};
  answers:Array<any>=[];
  constructor(
    private nativeService:NativeService,
    private paperService:PaperService,
  	private chart:Chart,
    private navCtrl: NavController) {
  }
    ngAfterViewInit(){
      //(<any>window).MobclickAgent.onPageBegin('paper');
      // 侧栏考试选项
      this.paperService.options()
      .then(re=>{
        if(!re||!re.total){
          return ;
        }
        //this.request.status=200;
        this.paperService.setLocalOptions(re);
        this.paperService.setLocalClasses(re.classes);
        let options=new Options(re.exams,re.classes, re.subjects,re.total);
        //this.setDeafultTempSelected(options);
        this.loadData(this.setDeafultTempSelected(options),false);
      }).catch(e=>this.request=e);
  }
  openModalScorentity() {

    this.navCtrl.push(ScorentityPage,{ params: this.scorentityParams});

  }
  openModalAnswerentity(th:string) {
    //let modal = this.modalCtrl.create(ModalAnswerentity,);
    //modal.present();
    this.navCtrl.push(AnswerentityPage,{ params: {
      examGuid:this.selected.exam.code,
      classCode:this.selected.class.code,
      subject:this.selected.subject,
      schoolGuid:this.selected.schoolGuid,
      th:th,
    }});
  }
  openMenu(){
    //this.nativeService.pageEnter();
    
    this.navCtrl.push(PaperMenu,
      {selected:this.selected,
      onMenuPop:this.onMenuPop.bind(this)},
      //{animate:!this.nativeService.native}
      );
    //.then((re)=>{ e=>this.request=e;});
    this.backdrop=12;
    this.showMenu=true;
  }
  menuClose(){
    //this.showMenu=false;
    if(this.navCtrl.getActive().name=='PaperMenu'){
      this.onMenuPop();
    }
    this.navCtrl.pop();
  }
  onMenuPop(opt?:any){  
    this.showMenu=false;
    
    setTimeout(()=>{
        this.backdrop=-1;
      },500);
    opt&&this.loadData(opt);
  }
  loadData(opt:any,showLoading:boolean=true){
    showLoading&&this.nativeService.showLoading();
    this.selected=opt;
    this.answers.length=0;
    this.paperService.scenes(this.params).then(res=>{
      if(!res.items||!res.answers||!res.scores){
        this.request.status=700;
        return;
      }
      //答题情况
      res.answers.map(item=>{
          item.color=item.rate<30?'red':item.rate<40?'blue':'green';
          item.options=item.obj?
          this.chart.column(item.content.long,item.content.lat,item.color,{animation:false})
          :this.chart.pie(item.content,{animation:false});
      });
      this.answers=res.answers;
      //小题得分
      this.options.item= this.chart.polygon(res.items.long,res.items.lat);
      //成绩分布
      this.options.score= this.chart.column(res.scores.long,res.scores.lat);
      this.request.status=200;
      this.nativeService.hideLoading();

    }).catch(e=>this.request=e);
    /*
    this.paperService.scoresScene(this.params)
    .then(re=>{
      if(!re||!re.long){
        this.request.status=700;
        return;
      }
      this.options.score= this.chart.column(re.long,re.lat);
      showLoading&&this.nativeService.hideLoading();
    })
    .catch(e=>this.request=e);
    //小题得分
    this.paperService.itemScene(this.params)
    .then(re=>{this.options.item= this.chart.polygon(re.long,re.lat)})
    .catch(e=>this.request=e);
    //答题情况
    this.paperService.answerScene(this.params)
    .then(
      re=>{
        re.map(item=>{
          item.color=item.rate<30?'red':item.rate<40?'blue':'green';
          item.options=item.obj?
          this.chart.column(item.content.long,item.content.lat,item.color,{animation:false})
          :this.chart.pie(item.content,{animation:false});
        });
        this.answers=re;
        this.request.status=200;
      }
    ).catch(e=>
      this.request=e
    );*/
  }
  get params(){
    return {
        examGuid:this.selected.exam.code,
        classCode:this.selected.class.code,
        subject:this.selected.subject,
        schoolGuid:this.selected.schoolGuid}
  }
  get scorentityParams(){
    return {
        examGuid:this.selected.exam.code,
        classCode:this.selected.class.code,
        schoolGuid:this.selected.schoolGuid,
        title:this.selected.exam.name+''+this.selected.class.name,
      }
  }

  chartRender(re:any){
  	return this.chart.column(re.long,re.lat);
  }


  setDeafultTempSelected(options:any){
    return new Selected(
      {name:options.exams[0].name,code:options.exams[0].code},
      {name:options.classes[0].name,code:options.classes[0].code},
      options.subjects[0],
      options.school.code);

  }
}
