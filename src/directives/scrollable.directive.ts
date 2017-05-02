import {  Directive, ElementRef,Output,Input, EventEmitter} from '@angular/core';
@Directive({
  selector: '[ionscroll]',
})
export class ScrollableDirective {

  @Output() onscrollTop = new EventEmitter<any>();
  @Input() ratio:number=60;
  //private touch:boolean=false;
  private scrollableElement: any;
  //private diY:number=0;

  constructor(private el: ElementRef) {}
  ngAfterViewInit(){
    //console.log('el',this.el);
    this.scrollableElement=this.el.nativeElement;//.firstElementChild;
    let scrollListen=(e)=>{
      //if(this.scrollableElement.scrollTop-this.diY>this.ratio){
      //  this.onscrollTop.emit('top');
      //}else if(this.diY-this.scrollableElement.scrollTop>this.ratio){
      //  this.onscrollTop.emit('bottom');
      //}
      //console.log(this.scrollableElement.scrollTop);
      this.scrollableElement.scrollTop<this.ratio&&this.onscrollTop.emit(this.scrollableElement.scrollTop);
      //if(this.scrollableElement.scrollTop<)
    }
    this.scrollableElement.onscroll=scrollListen;
    /*
    this.scrollableElement.addEventListener('touchstart', e=>{
      this.scrollableElement.onscroll=scrollListen;
      this.diY=this.scrollableElement.scrollTop;
    });
    this.scrollableElement.addEventListener('touchend', e=>{
      this.scrollableElement.onscroll=null;
      this.diY=this.scrollableElement.scrollTop;
    });*/
  }
  
      
  
}