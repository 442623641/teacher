/*
成绩列表
*/
import { Component, ViewChild } from '@angular/core';
import { NavParams,NavController,Slides,Content } from 'ionic-angular';
import { PaperService } from "../../providers/PaperService";
import { MyResponse } from "../../model/page.model";
import { NativeService } from '../../providers/NativeService';

@Component({
  selector: 'page-scorentity',
  templateUrl: 'scorentity.html'
})
export class ScorentityPage {
  @ViewChild('headerSlide') headerSlide: Slides;
  @ViewChild('contentSlide') contentSlide: Slides;
  @ViewChild(Content) content: Content;
  request:MyResponse=new MyResponse();
  params:any;
  items:Array<{name:string,scores:Array<number>}>=[];
  all:number=0;
  index:number=1;
  rows:number=80;
  order:boolean=true;
  sliding:boolean=false;
  subjects:Array<string>=[];
  height:string='90%';
  viewLength:number=1;
  colStyles:any={'max-width':'20%',
        '-webkit-flex':'0 0 20%',
        'flex':'0 0 20%'}
  constructor(
    public navCtrl:NavController,
    public navParams: NavParams,
    public paperService:PaperService,
    public nativeService:NativeService) {
      this.params=this.navParams.get('params');
  }
  ngAfterViewInit() {
    this.refresh();
  }
  setColStyles(){
    let width='20%';
    if(this.subjects.length<1){
      width=(80/this.subjects.length).toFixed(1)+'%';
      
    }
    return {'max-width':width,
        '-webkit-flex':'0 0 '+width,
        'flex':'0 0 '+width};
  }
  dismiss() {
    this.navCtrl.pop();
  }
  refresh(e?:any){
    //刷新
    if(this.items.length){
      //如果已经加载全部，不再请求
      if(this.all<=this.items.length){
        this.items.reverse();
        this.content.scrollToTop();
        return;
      }
      this.index=1;
      this.nativeService.showLoading();
    }
    this.order=!this.order;
    this.params.order=this.order?1:0;
    return this.paperService.scorentity(this.params,this.index,this.rows)
      .then(re=>{
        if(this.items.length){//刷新
          this.nativeService.hideLoading();
        }else{//初次加载
          setTimeout(()=>{ 
            this.headerSlide.control=this.contentSlide;
            this.contentSlide.control=this.headerSlide;
            this.contentSlide.freeMode=this.headerSlide.freeMode=true;
          },500);
        }
        re.subjects=re.subjects||[];
        //this.pageState=re.subjects.length;
        this.subjects=re.subjects;
        this.viewLength=this.subjects.length>4?4:this.subjects.length;
        this.items=re.list;
        this.height=2.75*(this.items.length)+'em';
        this.colStyles=this.setColStyles();
        this.all=re.all;
        this.request.status=200;
        //this.content.scrollToTop();
        return true;
      }).catch(res=>this.request=res);
  }
  doInfinite(infiniteScroll?:any) {
    //this.params.index++;
    this.index++;
    //console.log('doInfinite, start is currently '+this.index);  
    this.params.order=this.order;
    this.paperService.scorentity(this.params,this.index,this.rows)
      .then(re=>{
        infiniteScroll.complete();
        this.items=this.items.concat(re.list);
        this.height=2.75*(this.items.length)+'em';
      }).catch(()=>{
        infiniteScroll&&(infiniteScroll.complete(),infiniteScroll.enable(false));
      });
  } 
  ionSlideNextStart(e){
    this.sliding=true;
  }
  ionSlidePrevEnd(e){
    if(!e.getActiveIndex()){
      this.sliding=false;
    }
  }
}