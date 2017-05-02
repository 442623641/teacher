import { Component,Input } from '@angular/core';

@Component({
  selector: 'elastic-line',
  template: `<p class="elastic-line" [ngStyle]="styles"></p>`,
  styles:[`
  	.elastic-line{
      height: 3px;
      padding: 0;
      margin: 0;
      background:#ff7d2d;
      -webkit-transition: -webkit-transform .5s ease;
      -moz-transition: -moz-transform .5s ease;
      transition: transform .5s ease;
    }
  `]
})

export class ElasticLine {
  styles:any;
	@Input() ratio:number;
  @Input() set progress(index:any){
    let _index=Number(index);
    this.styles={
      'width':this.transform(1),
      'transform':'translateX('+this.transform(_index)+')',
      '-webkit-transform':'translateX('+this.transform(_index)+')',
    }
  }
  private transform(index:number):string{
    return this.ratio*100*index+'vw';
  }
	constructor(){
    this.styles={
      'width':this.transform(1),
    };
  }
  ngOnInit() {
    this.styles={
      'width':this.transform(1),
    };
  }
}