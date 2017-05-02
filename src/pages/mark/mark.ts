import { Component,ViewChild } from '@angular/core';
import { MarkService } from "../../providers/MarkService";
import { NativeService } from "../../providers/NativeService";
import { ITasksModel } from "../../model/tasks.model";
import { MyResponse } from "../../model/page.model";
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Slides,Refresher,NavController } from 'ionic-angular';
import { MarkProgressPage } from '../markprogress/mark-progress';
import { MarkingPage } from '../marking/marking';
import { MarkcheakPage } from '../markcheak/markcheak';

@Component({
  selector: 'page-mark',
  templateUrl: 'mark.html'
})
export class MarkPage {
  private scrollListener: any;
  private scrollableElement: any;
  scrollTop:boolean=false;
  requests:MyResponse []=[new MyResponse(),new MyResponse(),new MyResponse(),new MyResponse()];
  @ViewChild(Slides) slides: Slides;
  @ViewChild(Refresher) refresh: Refresher;
  markingIndex:number=0;
  //slidesQueue:Array<number>=[0,1];
  selectedSegment: any=0;
  pages:Array<string>=["阅卷","仲裁","异常","重评"];
  tasks:Array<Array<ITasksModel>>=[[],[],[],[]];
  //scrolls:HTMLElement [];
  //childScroll:HTMLElement;
  refreshing:boolean=false;
  constructor(
    private navCtrl: NavController,
    private markService:MarkService,
    private nativeService:NativeService,
    private screenOrientation: ScreenOrientation
  ) {}

  ngAfterViewInit() {
    this.source(Number(this.selectedSegment));
  }

  onSegmentChanged(segmentButton,_index?:number) {
 	  let index=Number(segmentButton.value);

   	//滑动队列管理
    this.slides.slideTo(index);
    if(!this.tasks[index].length){
      this.source(index);
    }
  }

  onSlideChanged(slider) {
  	//重置滑动队列
    if(slider._activeIndex>3||slider._activeIndex<0){
      return;
    }
    this.selectedSegment = slider._activeIndex.toString();
    this.tasks[slider._activeIndex].length||(this.source(slider._activeIndex));
  }

  //callback on marking page pop
  private onMarkingPagePop(data?:any){
    this.refreshing=true;
    this.requests[this.selectedSegment].status=-1;
    this.nativeService.showLoading();
    this.source(Number(this.selectedSegment)).then(()=>{
      this.nativeService.hideLoading();
      this.refreshing=false;
    });
  }
  private source(type:number){
    if(this.requests[type].status>0){
      return new Promise(resolve=>resolve());
    }
    ///this.nativeService.showLoading();
  	return this.markService.tasks({yjType:type})
		.then(res=>{
        if(!res.length){
          this.requests[type].status=701;
          return;
        }
        //res.length=res.length>30?30:res.length;
  			this.tasks[type]=res;
        this.requests[type].status=200;
  	}).catch(e=>this.requests[type]=e);
  }
  private goProgressPage(item){
  	this.navCtrl.push(MarkProgressPage,{
  		task:{
  			ru:item.ru, examGuid:item.examGuid,
  			km:item.km,th:item.th,yjType:Number(this.selectedSegment)},
      });
  }
  private goMarkingPage(item,index){
    if(item.count>=item.total){
      return ;
    }
    this.markingIndex=index;
    this.navCtrl.push(MarkingPage,{
          examName:item.examName,
          task:{
            teacherGuid:item.teacherGuid,
            ru:item.ru, examGuid:item.examGuid,
            km:item.km,th:item.th,
            yjType:Number(this.selectedSegment)
          },total:item.total,count:item.count,
          onPop:this.onMarkingPagePop.bind(this)
        },{animate:!this.nativeService.native});
  }
  doRefresh(refresher){
    //this.scrollY=false;
    this.refreshing=true;
    let type=Number(this.selectedSegment);
    return this.markService.tasks({yjType:type})
    .then(res=>{
        this.tasks[type]=res;
        refresher.complete();
        this.refresh._isReady=true;
        this.refreshing=false;
        if(res.length){
          this.requests[type].status=200
        }else{
          this.requests[type].status=701;
        }
    }).catch(e=>{
      refresher.complete();
      this.refresh._isReady=true;
      this.refreshing=false;
      this.requests[type]=e;
    });
  }
  //查看答案
  checkAnswer(item:any){
    this.markService.answerUrl({ru:item.ru,examGuid:item.examGuid,km:item.km}).then((res)=>{
        if(res&&res.length){
          this.nativeService.showImage(res,item.examName+item.km);
        }else{
          this.nativeService.showToast("答案不存在");
        }
      }).catch(e=>{console.log(e)});
  }

  private goMarkcheakPage(item){
      this.navCtrl.push(MarkcheakPage,{
          task:{
              ru:item.ru,
              examGuid:item.examGuid,
              km:item.km,
              th:item.th,
              yjType:Number(this.selectedSegment),
              teacherGuid:item.teacherGuid
          }
      });
  }
  get multiple(){
    return this.selectedSegment<2;
  }
  enableRefresh(e){
    this.refresh._isReady=e<5;
  }

}
