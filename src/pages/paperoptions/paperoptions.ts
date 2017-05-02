import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PaperService } from "../../providers/PaperService";
import { PageInfo } from "../../model/paper.model";
import { MyResponse } from "../../model/page.model";
import { NativeService } from "../../providers/NativeService";
/*
  Generated class for the Paperoptions page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-paperoptions',
  templateUrl: 'paperoptions.html'
})
export class PaperOptions{
	request:MyResponse=new MyResponse();
	backdrop:number=0;
	onPop:Function;
	key:string;
	selected:string;
	pageInfo:PageInfo;
	items:Array<any>=[];
	total:number=0;
	title={exam:"全部考试",class:"全部班级"};

	constructor(public navCtrl: NavController, 
	  	public navParams: NavParams,
	  	public paperService:PaperService,
	  	public nativeService:NativeService,) {
		this.selected=this.navParams.get('value');
		this.key=this.navParams.get('key');
	}

	ngAfterViewInit(){	
		this.onPop=this.navParams.get('onPop');		
		if(this.key=='exam'){
			this.doRefresh();
		}else{
			this.classes();
		}
	}
	classes(){
		this.items=this.navParams.get('classes');	
		/*
		this.paperService.getLocalClasses().then((res)=>{
			console.log(res);
			this.items=res;//.push({list:res,code:1,name:'合肥市第六中学'});
			//this.items.push({list:res,code:2,name:'合肥市第七中学'});
		});*/
	}
	//刷新
	doRefresh(refresher?:any) {
		this.pageInfo=new PageInfo(1,30);
	    this.paperService.exams(this.pageInfo)
	    .then(re=>{
	      //this.tipShow++;
	      this.total=re.total;
	      this.items=re.exams;
	      refresher && refresher.complete();
	      this.request.status=200;	     
	     //this.presentToast("加载成功");
	    }).catch((res)=>{
	    	refresher && refresher.complete();
	    	this.request=res;
	    });
  	}
  	//加载更多
  	doInfinite(infiniteScroll?:any) {
	    //this.params.index++;
	    this.pageInfo.index++;   
	    console.log('doInfinite, start is currently '+this.pageInfo);  
	    this.paperService.exams(this.pageInfo)
	      .then(re=>{
	        this.items=this.items.concat(re.exams);
	        infiniteScroll.complete();
	      }).catch(()=>{
	        infiniteScroll&&(infiniteScroll.complete(),infiniteScroll.enable(false));
	      });
	}
	dismiss(item?:any,schoolGuid?:string){
	    this.selected=item;
	    this.navCtrl.pop().then(()=>{
	    	item&&this.onPop(item,schoolGuid);
	    });
	}
}
