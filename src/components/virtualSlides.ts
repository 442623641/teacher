import { Component,Input} from '@angular/core';

@Component({
  selector: 'virtual-slides',
  template: `<ion-row no-padding wrap justify-content-start>
	  			<div [style.width]="count/total*100+'%'" class="progress"></div>
	  			<ion-col no-padding>
		  			<ion-chip color="primary" [class.active]="labelShow">
		  				<ion-icon name="i7"></ion-icon>
					  <ion-label color="white"> {{count+'/'+total}} </ion-label>
					</ion-chip>
				</ion-col>
	  		</ion-row>

  			<ion-scroll maxZoom="5" scrollY="true" scrollX="true" zoomable class="image-content" zoom="true" [class.active]="active">
  				<ion-row nowrap align-items-center *ngIf="items&&items.length" align-items-center justify-content-center [class.transform]="transform">
  					<ion-col col-12  *ngIf="items[0]" class="first" no-padding align-self-center text-center>
						<img src="{{items[0].image}}">
					</ion-col>
					<ion-col col-12 *ngIf="items[1]" class="second" no-padding align-self-center text-center>
						<img src="{{items[1].image}}">
					</ion-col>
				</ion-row>
			</ion-scroll>`,
	styles:[`
		.first img{
			max-width:initial;
		}
		.chip{
		    height: 26px;
		    font-size: 12px;
		    font-weight: bold;
		    line-height: 26px;
		    z-index: 70;
		    position: absolute;
		    transform: scale(0);
			-webkit-transform: scale(0);
			opacity:0;
			-webkit-opacity:0;
			-webkit-transition: opacity .8s ease .2s,-webkit-transform .8s ease .5s;
			transition:  opacity .8s ease .2s,transform .8s ease .5s;
		}
		.chip .label{
			margin: 0 10px 0 0;
		}
		.chip ion-icon{
		    height: auto;
		    line-height: 18px;
		    padding: 4px;
		}

		.chip.active{
			transform: scale(1);
			-webkit-transform: scale(1);
			opacity:1;
			-webkit-opacity:1;
		}

		.progress{
			height:4px;
			background:#69F;
			border-radius:0 2px 2px 0;
			-webkit-transition: width 1s ease;
			-moz-transition: width 1s ease;
			transition: width 1s ease;
		}
		ion-scroll.image-content{
			height:calc(100vh - 4px);
			height:-webkit-calc(100vh - 4px);
			//overflow:hidden;
		}
		.image-content ion-row{
			min-height:calc(100vh - 4px);
			min-height:-webkit-calc(100vh - 4px);
		}
		.image-content ion-col{
			//max-width:100%;
			//max-width:100%;
		}
		.image-content ion-col img{
			margin-bottom: 90px;
		}
		    
		.active ion-col{
			will-change: max-width;
			will-change: opacity;  
		}
		
		.transform ion-col{
			margin-bottom: 40px;
			-webkit-transition: all .5s ease-in;
			-moz-transition: all .5s ease-in;
			transition:  all .5s ease-in;
		}
		.image-content .second{
			max-width:0;
		}
		.image-content .transform .first{
			max-width:0;
			opacity: 0;
            -webkit-opacity: 0;
		}
		.image-content .transform .second{
			max-width:100%;
			max-width:100%;
		}
	`]
}) 

export class VirtualSlides {
	active:boolean=false;
	transform:boolean=false;
	labelShow:boolean=false;
	@Input()items:any=[];
	@Input() total:number=1;
	@Input() count:number=0;
	constructor() {
		//this.virtualList=
	}

	next():Promise<any>{
		return new Promise(resolve=>{
			if(this.items.length>1){
				this.active=true;
				setTimeout(()=>{this.transform=true;},60);
				setTimeout(()=>{
					this.transform=false;
					this.active=false;
					//let item=this.items[0];
					this.items.splice(0,1);
					this.labelShow=true;
					resolve(this.items.length);
					setTimeout(()=>{this.labelShow=false},2500);
				},500);
			}else{
				resolve(this.items.length); 
				return;
			}
			//setTimeout(()=>{this.labelShow=false},2000);
		});
	}
}