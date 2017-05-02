import { Component,ViewChild } from '@angular/core';
import { MarkService } from "../../providers/MarkService";
import { NavController,NavParams} from 'ionic-angular';
import { Chart } from "../../providers/Chart";
import { MyResponse } from "../../model/page.model";
import { Slides } from 'ionic-angular';
@Component({
  selector: 'mark-progress',
  templateUrl: 'mark-progress.html'
})
export class MarkProgressPage {
  @ViewChild(Slides) slides: Slides;
  requests:MyResponse []=[new MyResponse(),new MyResponse()];
  scene:any []=[];
  ratio:number=0.5;
  selectedSegment: string="0";
  private progresses:Array<any>=[];
  private average:number;
  private markScores:{options:any}={options:null};
  private params:any;

  constructor(private navCtrl: NavController,private markService:MarkService,
  	private navParams:NavParams,
  	private chart:Chart) {}
  ngAfterViewInit() {
    this.params=this.navParams.get('task');
    this.sourceProgresses(this.params);
  }
	//评分曲线
  markScene() {
    //console.log("Segment changed to", segmentButton);a
    this.slides.slideTo(1);
    this.sourceMarkScene(this.params);
  }
  //阅卷进度
  progress() {
    //console.log("Segment changed to", segmentButton);a
    this.slides.slideTo(0);
    this.sourceProgresses(this.params);
  }

  onSlideChanged(slider) {
    if(slider._activeIndex>1){
      return ;
    }
    this.selectedSegment = slider._activeIndex.toString();
    if(!slider._activeIndex){
    	this.progress();
    }else{
    	this.markScene();
    }
  }

  
  private sourceProgresses(task:any):void{
  	this.requests[this.selectedSegment].status||
  	this.markService.progress(task)
		.then(res=>{
			this.progresses=res;
      this.requests[this.selectedSegment].status=200;
		}).catch(e=>this.requests[this.selectedSegment]=e);
  }

  private sourceMarkScene(task:any):void{
    this.requests[this.selectedSegment].status||
  	this.markService.markScene(task)
		.then(res=>{
			//this.markScores=res;
      this.scene=res.values;
			this.markScores.options=this.chart.tree(this.scene);
      this.average=res.aveScore;
      this.requests[this.selectedSegment].status=200;
		}).catch(e=>this.requests[this.selectedSegment]=e);
  }

  reverse(e){
    if(this.slides._activeIndex)
      this.markScores.options=this.chart.tree(this.scene.reverse());
    else
      this.progresses.reverse();
  }

}
