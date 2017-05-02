import {Directive,ElementRef,Input,Renderer,Output,EventEmitter}from '@angular/core';

@Directive({
  selector: '[tappress]',
})
export class TapPressDirective {
  @Input() tabs:number [];
  @Output('tappress') refresh = new EventEmitter<number>();
  listenTouchstarts:Function []=[];
  listenTouchend:Function=(e)=>{};
  progress:HTMLElement;
  constructor(private el: ElementRef, private renderer: Renderer) {}
  ngAfterViewInit(){
		//console.log(this.el);
		this.el.nativeElement.firstElementChild.insertAdjacentHTML('beforebegin', 
			`<a class="press-progress">
			<ion-icon name="ios-refresh-outline" role="img" class="icon icon-ios icon-ios-red ion-ios-refresh-outline" aria-label="refresh outline"></ion-icon>
			<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40" enable-background="new 0 0 40 40">
				    <path d="M20 1c10.45 0 19 8.55 19 19s-8.55 19-19 19-19-8.55-19-19 8.55-19 19-19z" 
				    class="progress" stroke="#ff7d2d" stroke-width="2.5" stroke-linecap="round" stroke-miterlimit="10"></path>
			</svg></a>`);
		setTimeout(()=>{
			this.progress=this.el.nativeElement.firstElementChild;
			this.addTouchEvent();
		},500);
  }
  ngOnDestroy(){
  	//release
  	this.listenTouchend();
  	this.listenTouchstarts.forEach(item=>item());
  }
  addTouchEvent(){

	let holdTimeout=null,emitTimeout=null,removeTimeout=null;
	let touchRelease=()=>{
		this.listenTouchend();
		clearTimeout(holdTimeout);
		clearTimeout(emitTimeout);
		clearTimeout(removeTimeout);
		this.renderer.setElementClass(this.progress, 'activated', false);
	};
	let tabsElement=this.el.nativeElement.querySelectorAll('.tabbar .tab-button');
	this.tabs.forEach((item)=>{
		if(!tabsElement||!tabsElement[item]) return;
		this.listenTouchstarts[item]=this.renderer.listen(tabsElement[item],'touchstart', event=> {
			touchRelease();
			if(tabsElement[item].getAttribute("aria-selected")!='true') return;
			this.listenTouchend=this.renderer.listen(tabsElement[item], 'touchend', event=>touchRelease());
			this.renderer.setElementStyle(this.progress, 'left',event.targetTouches[0].pageX+'px');
			holdTimeout=setTimeout(()=>{
	  			this.renderer.setElementClass(this.progress, 'activated', true);
	  		},255);
	  		emitTimeout=setTimeout(()=>{
	  			this.refresh.emit(item);
	  			removeTimeout=setTimeout(()=>this.renderer.setElementClass(this.progress, 'activated', false),1100);
	  		},2550);
		});
	});
  }
}