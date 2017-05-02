import { Component,Input } from '@angular/core';
import { NativeService } from "../../providers/NativeService";
@Component({
  selector: 'loading',
  
template: `<div text-center class="nodata" *ngIf="res?.status>399" [class.inactive]="inactive">
				<p><ion-icon [name]="icon"></ion-icon></p>
				<ion-note (click)="func()">{{mess}}</ion-note>
			</div>
			<div class="iloading-spinner" *ngIf="!res?.status" [class.inactive]="inactive">
				<ion-icon name="i7"></ion-icon><i></i>
			</div>`,

	//template:`<div class='loading-circle' *ngIf="!res?.status" [class.inactive]="inactive">
	//		    <svg>
	//		    <circle class="preLoader" cx="35" cy="35" r="30"></circle>
	//		   </svg>
	//		  </div>
	//		  <div class="loading-feather" *ngIf="res?.status!=200" [class.inactive]="inactive"><ion-icon name="i7"></ion-icon></div>
	//		  <div class="loading-note" (click)="func()" *ngIf="res?.status>399" [class.inactive]="inactive">{{mess}}</div>`
})

export class Loading {
	inactive:boolean=false;
	icon:string;
	res:{status,message}={status:0,message:''};
	@Input() func:Function=()=>{};
	//@Input() state:any;
	@Input() mess:string="暂无记录";
	@Input() error:any;
	
	constructor(private nativeService:NativeService){}
	ngOnChanges(changes:any){
		if(!this.error){
			return;
		}
		this.nativeService.hideLoading();
		this.inactive=true;
		setTimeout(()=>{this.res=this.error;this.inactive=false},200);
		switch(this.error.status){
			case 200:
				this.icon='';
				this.mess='';
				break;
			case 600:
				this.icon="inetwork";
				if(this.nativeService.isConnecting()){
					this.mess="网络异常，请稍后再试";
				}else{
					this.mess="请检查网络是否连接";
				}
				break;
			case 401:
			case 402:
				this.icon="i7";
				this.mess=this.error.message;
				break;
			default:
				this.icon="i7";
				this.mess="暂无记录";
				break;
		}

	}
	
}