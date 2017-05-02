import {Directive,HostListener,Input}from '@angular/core';
import { NativeAudio } from '@ionic-native/native-audio';

@Directive({
  selector: '[soundable]',
})
export class SoundableDirective {
  @Input() soundable:string='keyboard';
  constructor(private nativeAudio: NativeAudio) {}

  @HostListener('click',['$event']) onClick(e) {
  	console.log('soundable');
    this.nativeAudio.play(this.soundable).then((s)=>setTimeout(()=>this.nativeAudio.stop(this.soundable),800), (e)=>console.log(e));
  }  
}