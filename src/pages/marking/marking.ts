import { Component ,ViewChild} from '@angular/core';
import {  NavParams ,PopoverController,NavController,Scroll,Platform} from 'ionic-angular';
import { PropoverMarkMenu } from '../propovers/markmenu/markmenu';
import { MarkingService } from "../../providers/MarkingService";
import { NativeService } from '../../providers/NativeService';
import { AppService } from "../../providers/AppService";
import { Subject,Preference } from "../../model/mark.model";
import { MyResponse } from "../../model/page.model";
import { VirtualSlides } from '../../components/virtualSlides';
/*
  Generated class for the Marking page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-marking',
  templateUrl: 'marking.html'
})
export class MarkingPage {
  localOptions:number []=[];
  pageLength=3;
  pageIndex:number=0;
  //configuration:any={};
  pop:Function;
  @ViewChild('subjectContent') subjectContent: Scroll;
  @ViewChild('optionsContent') optionsContent: Scroll;
  request:MyResponse=new MyResponse();
  remindTime:number=0;
  exceptionMess:string;
  private optionMax:number=0;
  total:number=1;
  count:number=0;
  items:Array<Subject>=[];
  mess:string="加载中...";
  @ViewChild('virtualSlides') virtualSlides: VirtualSlides;
  private preference:Preference;//=new Preference();
  private options:Array<number>=[];
  private task:any;//任务
  private end:boolean=false;
  private malloc:boolean=false;//是否将要触发动态分配；
  private currentItemIndex:number=0;//当前小题索义
  private buttonState:string;//tapable,processing,disabled
  private subjectLabelOffetTop=0;
  private sectElements:any;
  private subjectContentOverflow:boolean=false;
  private optionsContentElement:HTMLElement;
  constructor(private popoverCtrl: PopoverController, 
    private navCtrl: NavController,
    private platform:Platform,
    private navParams: NavParams,
    private markingService:MarkingService,
    private nativeService:NativeService,
    private appService:AppService,
    ) {}
  get localOptionsKey():string{
    return this.task.examGuid+this.task.km+this.task.th;
  }

  get subject():Subject{
    //console.log(this.items[0]);
    return this.items[0];
  }

  source(){
    if(this.malloc){
       let caches=[];
       this.items.forEach(item=>caches.push(item.guid));
       this.task.caches=JSON.stringify(caches);
    }else{
       this.task.caches=undefined;
    }
    this.pageIndex*this.pageLength>=this.total&&(this.pageIndex=0);
    this.pageIndex++;
   return this.markingService.subjects(this.task,this.pageIndex,this.pageLength).then((res)=>{
        //new subject 
        if(!res||!res.list||!res.list.length){ 
          this.end=true;
          return this.items;
        }
        this.malloc=res.malloc;
        res.list.forEach(item=>{
          this.items.find(old=>{return old.guid==item.guid})||
          this.items.push(new Subject(item,this.preference.scopes));
        });
    }).catch(e=>console.log(e));
  }

  ngAfterViewInit(){ 
      //(<any>window).MobclickAgent.onPageBegin('marking');
      this.task=this.navParams.get("task");
      this.count=this.navParams.get("count");
      this.total=this.navParams.get("total");
      this.pop=this.navParams.get("onPop");
      //题组偏好设置
      this.markingService.preference(this.task)
      .then(re=>{
        this.preference=new Preference(re);
        this.optionsUpdate();
        this.source().then(()=>{
          if(this.items.length){
            this.request.status=200;
            this.nativeService.hideStatusBar();
            setTimeout(()=>{
              this.nativeService.landscape().then(()=>{
                this.appService.getConfiguration().then((config)=>{
                  //console.log(config);
                  //this.configuration=config||{};
                  config=config||{noLandscapeTip:false};
                  (!this.nativeService.isLandscape()
                  &&this.nativeService.isIos()
                  &&!config.noLandscapeTip)
                  &&this.nativeService.showConfirm('开启自动旋转，切换横屏阅卷',['不再提示','知道了']).then(btn=>{
                    config.noLandscapeTip=!btn;
                    this.appService.setConfiguration(config);
                  });
                  //this.configuration.autoSubmit&&
                  //this.nativeService.showToast('你已开启自动提交,关闭请到阅卷设置进行修改');//.subscribe(()=>this.openPopoverMarkMenu({target:{getBoundingClientRect:null}},'pane'));
                });
              })
              this.sectElements=this.subjectContent.scrollElement.querySelectorAll('.subject');
              this.optionsContentElement=(<HTMLElement>this.subjectContent.scrollElement.firstChild);
              this.subjectContentOverflow=(<HTMLElement>this.subjectContent.scrollElement.firstChild).offsetHeight>this.platform.height()+10;
              },250);
          }else{
            this.request={status:402,message:'任务已完成'};
            setTimeout(()=>this.dismiss(),2000);
          }

        });
      }).catch(e=>this.request=e);
  }

 private optionsUpdate(){
    this.markingService.getLocalOptions(this.localOptionsKey)
       .then(res=>{
          if(!res||!res.length
            ||this.preference.scopes[this.currentItemIndex].options.length
            <this.preference.scopes[this.currentItemIndex].full+1){
            this.localOptions=[];
            return this.preference.scopes[this.currentItemIndex].options;
          }else{
            this.localOptions=res.filter(item=>{ return item<=this.preference.scopes[this.currentItemIndex].full});
            return this.preference.scopes[this.currentItemIndex].options
              .filter(item=>{ 
                return res.indexOf(item)==-1&&item<=this.preference.scopes[this.currentItemIndex].full;
            });
          }
      }).then(res=>{
        this.options=res;
        setTimeout(()=>this.optionsContent&&
          this.scrollAnimate(this.optionsContent,-this.optionsContent.scrollElement.scrollTop),200);
      });
  }

  itemTapped(index:number){
    
    this.currentItemIndex=index;
    this.labelAnimate(index);
    setTimeout(()=>{
          this.subjectContentScroll(index);
        },300); 
  }
  
  private subjectContentScroll(index){
    let rect=this.sectElements[index].getBoundingClientRect();
    if(rect.top<0){
      //offset=rect.top;
      //interval=-10;
      return this.scrollAnimate(this.subjectContent,rect.top);
    }else{
        let dY=rect.bottom-this.subjectContent.scrollElement.offsetHeight;
        if( dY>10){
          return this.scrollAnimate(this.subjectContent,rect.top-40);
        }else{
          return new Promise(reslove=>reslove(false));
        }
    }
  }

  //滑动动画
  scrollAnimate(scrollElement,offset,duration:number=500){
    
    return new Promise(reslove=>{
      if(!scrollElement||Math.abs(offset)<5){
        return reslove(false);
      }
      let currentFrameId=null,frames=0,interval=Math.ceil(offset*60/duration),start=scrollElement.scrollElement.scrollTop;
      if(offset<0){
        offset=offset<-scrollElement.scrollElement.scrollTop?offset:-scrollElement.scrollElement.scrollTop;
      }else{
        let rect=(<HTMLElement>scrollElement.scrollElement.firstChild).getBoundingClientRect();
        let splus=rect.bottom-scrollElement.scrollElement.offsetHeight;
        offset=offset>splus?splus:offset;
      }
      let cancel=()=>{
        window.cancelAnimationFrame(currentFrameId);
        currentFrameId = null;
        reslove(true);
      }
      let _raf=()=>{
          currentFrameId = window.requestAnimationFrame(()=>_nextFrame());
      }
      let _nextFrame=()=>{
        frames+=interval;
        let top=start+frames;
        scrollElement.scrollElement.scrollTop=top;
        console.log(frames,offset)
        if (interval>0&&frames >= offset||interval<0&&frames<= offset) {
          cancel();
        } else{
          _raf();
        }
      }
      _raf();
    });
  }
  private labelAnimate(index){
    (this.subjectLabelOffetTop=
      (<HTMLElement>this.sectElements[index]).offsetTop);
  }
  //end

  //打分
  optionsTapped(score:number,e){
    //this.setFlyer(score,e).then(()=>{
    let p= this.preference.scopes[this.currentItemIndex].range;
    (p[0]>score||p[1]<score)&&
    this.nativeService.showToast('建议分数范围为'+p[0]+'分 ~ '+p[1]+'分');
    this.subject.scores[this.currentItemIndex].self=score;
    this.remindTime=this.preference.remindTime();
    //this.configuration.autoSubmit=this.remindTime?false:this.configuration.autoSubmit;
    if(this.preference.scopes.length==this.currentItemIndex+1){
      //let itemIndex=this.currentItemIndex;
      let nextIndex=this.subject.nextIndex;
      if(nextIndex>=0){
        this.itemTapped(nextIndex);
        return;
      }
      //else{
      //  this.remindTime||this.nextSubject(null);
      //}
      
    }

    if(this.preference.scopes.length>this.currentItemIndex+1){
      this.currentItemIndex++;
      this.itemTapped(this.currentItemIndex);
      this.optionsUpdate();
    }
    if(this.buttonState=="tapable"
      ||this.subject.scores.every((item)=>{
      return item.self!=undefined;})){
        this.buttonState=this.remindTime?"disabled":"tapable";
    }
    //});
    
  }

  //下一张卷
  nextSubject(buttonState:string="processing"){
    this.buttonState=buttonState;
    this.markingService.submit({teacherGuid:this.task.teacherGuid,
      ru:this.task.ru,examGuid:this.task.examGuid,
      scores:JSON.stringify(this.subject.selies),
      regionGuid:this.subject.guid,
      yjType:this.task.yjType,
      tags:JSON.stringify(this.subject.tags),
      th:this.task.th}).then(
      (res)=>{
        this.buttonState=null;
        if(this.items.length==1){
          this.complete();
          return;
        }
        this.count++;
        this.total=res.total<this.total?this.total:this.total;
        this.total=this.total<=this.count?(this.total+1):this.total;
        this._next();      
      }).catch((e)=>{
          this.nativeService.showToast(e);
      });
  }

  tagTapped(item:string){
    let tagIndex=this.subject.scores[this.currentItemIndex].tags.indexOf(item);
    if(tagIndex<0){
      this.subject.scores[this.currentItemIndex].tags.push(item);
    }else{
      this.subject.scores[this.currentItemIndex].tags.splice(tagIndex,1);
    }
    
  }

  openPopoverMarkMenu(myEvent,action?:string) {
    this.optionMax||this.preference.scopes
    .forEach((item)=>{this.optionMax<item.full&&(this.optionMax=item.full)});

    let popover = this.popoverCtrl.create(PropoverMarkMenu,
      {task:this.task,
      regionGuid:this.items[0].guid,
      examName:this.navParams.get("examName"),
      optionMax:this.optionMax,
      next:(()=>this._next()).bind(this),
      //settings:this.configuration,
      //callback:action,
      config:{exception:this.preference.exception,entirety:this.preference.entirety}},
      {cssClass:"menu-popover"});

    popover.onDidDismiss((data:any={}) => {
      data.exit&&this.dismiss();
      data.refreshOptions&&this.optionsUpdate();
      //this.configuration=data.configuration||this.configuration;
    });

    myEvent.target.getBoundingClientRect=()=>{
      return {
        top:0,
        left:1000,
      }
    }
    popover.present({
      ev: myEvent
    });
  }

  private _next(){
      //this.items[2]&&(this.items[1]=new Subject(this.items[2],this.preference.scopes));
      this.virtualSlides.next().then((res)=>{
          if(!res){
            this.complete();
            return;
          }
          //this.subject=res;
          this.buttonState=null;
          this.preference.update();
          this.remindTime=0;
          this.itemTapped(0);
          !this.end&&res<3&&this.source();
      });
  }

  complete(){
    this.nativeService.showAlert("任务已经完成")
    .then((button)=>{
      this.dismiss();
    })
  }

  dismiss(){
    this.navCtrl.pop().then(()=>{
      this.pop();
    });
  }

  ionViewDidLeave(){
    this.nativeService.showStatusBar();
    this.nativeService.portrait();
    //(<any>window).MobclickAgent.onPageEnd('marking');
  }

  timeEnd(){
    //this.preference.;
    this.buttonState=this.buttonState=="disabled"?"tapable":this.buttonState;
  }
  ionViewDidLoad(){
    this.nativeService.pageEnter();
  }
}
