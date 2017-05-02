import { Component,Input} from '@angular/core';

@Component({
  selector: 'ripple-button',
  template: `<a class="button ripple" #ripple [class.active]="active">{{text}}</a>`,
  styles:[`
    :host{
      display: inline-block;
      height: 100%;
      width: 100%;
    }
    a.button.ripple {
      display:inline-block;
      overflow: hidden;
      position: relative;
      height: 100%;
      width: 100%;
      color:white;
      transition: background-color 0.3s linear, border 0.3s linear;
      vertical-align: middle;
    }
    a.button.ripple:after {
      content: "";
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 2px;
      pointer-events: none;
      background-image: radial-gradient(circle, #fff 10%, rgba(0, 0, 0, 0) 10.01%);
      background-repeat: no-repeat;
      background-position: 50%;
      transform: scale(10);
      opacity: 0;
      transition: transform .7s, opacity 1s;
    }
    a.button.ripple:active:after, a.button.ripple.active:after{
      transform: scale(0);
      opacity: .8;
      transition: 0s;
    }
  `]
})

export class RippleButton {
  //@ViewChild('ripple') elRef:ElementRef;
  //private renderer:Renderer
	@Input() text:any;
  active:boolean=false;
  constructor(){
    //this.el=el.nativeElement;
  }
  ngOnChanges(changes:any) {
    //this.renderer.setElementClass(this.elRef.nativeElement,"active",true);
    if(changes.text.currentValue>=0){
      this.active=true;
      setTimeout(()=>this.active=false,150);
    }
    //setTimeout(()=>this.renderer.setElementClass(this.elRef.nativeElement,"active",false),800);
    //this.renderer.invokeElementMethod(this.el, 
    //    'dispatchEvent', 
    //    [new MouseEvent('click', { bubbles: false, cancelable: true })]);
  }

}