import { Component,Input } from '@angular/core';

@Component({
  selector: 'rubber',
  template: `<div class="rubber-band" [class.active]="active">{{text}}</div>`,
  styles:[`
  	.rubber-band.active {

      -webkit-animation-delay: .5s;
      -moz-animation-delay: .5s;
      animation-delay: .5s;
      -webkit-animation-duration: 2s;
      -moz-animation-duration:2s;
      animation-duration: 2s;
      -webkit-animation-iteration-count: infinite;
      -moz-animation-iteration-count: infinite;
      animation-iteration-count: infinite;
    }
    @keyframes rubber-band {
      from {
        transform: scale(1);
      }

      30% {
        transform: scale(1.55);
      }

      40% {
        transform: scale(0.75);
      }

      50% {
        transform: scale(1.45);
      }

      65% {
        transform: scale(.95);
      }

      75% {
        transform: scale(1.25);
      }

      to {
        transform: scale(1);
      }
    }
    @-webkit-keyframes{
      from {
        -webkit-transform: scale(1);
      }

      30% {
        -webkit-transform: scale(1.55);
      }

      40% {
        -webkit-transform: scale(0.75);
      }

      50% {
        -webkit-transform: scale(1.45);
      }

      65% {
        -webkit-transform: scale(.95);
      }

      75% {
        -webkit-transform: scale(1.25);
      }

      to {
        -webkit-transform: scale(1);
      }
    }

    .rubber-band {
      animation-name: rubber-band;
      -webkit-animation-name:rubber-band;
    }
  `]
})

export class Rubber {
  iterationCount:number=1;
	@Input() text:any;
  active:boolean;
	constructor(){}
  ngOnChanges(changes:any) {
    this.active=true;
    //this.iterationCount++;
    setTimeout(()=>this.active=false,1000);
    //let st=
  }

}