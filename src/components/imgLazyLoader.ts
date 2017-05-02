import { Component,Input } from '@angular/core';

@Component({
  selector: 'img-lazy',
  template: ` <img src="{{src}}" 
			  (load)="loaded = true"
			  [hidden]="!loaded"/>
			  <div *ngIf="!loaded" class="loader"><ion-spinner name="bubbles" color="gray9"></ion-spinner></div>`,
  styles:[`
  	:host{
  		max-width:100%;
  		display: -webkit-box;
  	}
    .loader{
    	width:100%;
    	height:120px;
    	line-height:140px;
    	background:#ebebeb;//url(assets/images/noimg.jpg);
    	background-repeat: no-repeat;
	    background-size: contain;
	    text-align: center;
    }
    img{
    	max-width:100%;
    }
  `]
})

export class ImgLazyLoader {
	loaded:boolean;
	@Input() src:string;
	constructor(){}
  	ngOnInit() {}
}