/*
图片预览
*/
import { Component,ViewChild} from '@angular/core';
import { NavParams, ViewController,Slides } from 'ionic-angular';
@Component({
  template: `<ion-header no-shadow no-border>
                  <ion-navbar color="black">
                  <ion-buttons start>
                      <button ion-button (click)="dismiss()" icon-only clear>
                        <ion-icon name="arrow-back"></ion-icon>
                      </button>
                  </ion-buttons>
                  <ion-title>
                    {{title}}
                  </ion-title>
                </ion-navbar>
              </ion-header>
              <ion-content style="background-color: black">

                <ion-scroll (click)="tapped()" style="height:100%" scrollX="true" scrollY="true" *ngIf="urls.length==1" zoom="true">
                  <ion-row style="min-height:-webkit-calc(100vh - 45px);height:calc(100vh - 45px)" align-items-center justify-content-center>
                    <img  src={{urls[0]}} [ngStyle]="styles[0]" style="-webkit-transition: -webkit-transform 200ms ease;transition: transform 200ms ease;">
                  </ion-row>
                </ion-scroll>

                <ion-slides *ngIf="urls.length>1" zoom="false" (ionSlideWillChange)="onSlideChanged($event)">
                  <ion-slide *ngFor="let item of urls;let i=index;" (tap)="tapped()">
                    <img src={{item}} [ngStyle]="styles[i]" 
                    style="-webkit-transition: -webkit-transform 200ms ease;transition: transform 200ms ease;">
                  </ion-slide>
                </ion-slides>

              </ion-content>`,
})

export class PhotoView {
  activeIndex:number=0;
   @ViewChild(Slides) slides: Slides;
  styles:any []=[{
    'transform':'scale(1)',
    '-webkit-transform':'scale(1)'
  },{
    'transform':'scale(1)',
    '-webkit-transform':'scale(1)'
  }];
  title:string='';
  tappedNum:number=0;
  isEnlarge:boolean=false;
  urls:string []=[];
  constructor(
    public navParams: NavParams,
    public viewCtrl: ViewController) {}
  ngOnInit() {
    this.title=this.navParams.get('title');
    this.urls=this.navParams.get('urls');
  }
  onSlideChanged(e){
    this.isEnlarge=false;
    this.styles=[{
      'transform':'scale(1)',
      '-webkit-transform':'scale(1)'
    },{
      'transform':'scale(1)',
      '-webkit-transform':'scale(1)'
    }];
    this.activeIndex=e.getActiveIndex();
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  tapped(){
    //单击
    if(!this.tappedNum){
      this.tappedNum=1;
      setTimeout(()=>{
        if(this.tappedNum===1){
          this.tappedNum=0;
          this.dismiss();
          return;
        }
        this.tappedNum=0;
      },500);
      //双击
    }else{
      this.tappedNum=2;
      //放大
      this.styles[this.activeIndex]=this.isEnlarge?{
          'transform':'scale(1)',
          '-webkit-transform':'scale(1)'
        }:{
          'transform':'scale(2.5)',
          '-webkit-transform':'scale(2.5)'
        }
      let reverse= this.activeIndex==0?1:0;
      this.styles[reverse]={
          'transform':'scale(0)',
          '-webkit-transform':'scale(0)'
      }
      this.isEnlarge=!this.isEnlarge; 
      setTimeout(()=>{
          this.tappedNum===2&&(this.tappedNum=0);
        },600);
    }
    setTimeout(()=>this.slides&&this.slides.update(),500);
  }    
}