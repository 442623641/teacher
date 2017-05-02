import { Component, ViewChild, ViewEncapsulation, ElementRef } from '@angular/core';
import { ViewController, NavParams, Slides, Content, Platform } from 'ionic-angular';
import { Subject }    from 'rxjs/Subject';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'photos-viewer',
  templateUrl: 'photos-viewer.html',
})
export class PhotosViewer {
  @ViewChild('slider') slider: Slides;
  @ViewChild('content') content: Content;

  public photos: string [];
  private sliderDisabled: boolean = false;
  private initialSlide: number = 0;
  private currentSlide: number = 0;
  private sliderLoaded: boolean = false;
  private title: string;
  private parentSubject: Subject<any> = new Subject();

  constructor(private viewCtrl: ViewController, params: NavParams, private element: ElementRef, private platform: Platform) {
    this.photos = params.get('photos') || [];
    this.title = params.get('title');
    this.initialSlide = params.get('initialSlide') || 0;
  }

  public dismiss() {
    this.viewCtrl.dismiss();
  }

  private resize(event) {
    this.slider.update();

    let width = this.element['nativeElement'].offsetWidth;
    let height = this.element['nativeElement'].offsetHeight;

    this.parentSubject.next({
      width: width,
      height: height,
    });
  }

  private orientationChange(event) {
    // TODO: See if you can remove timeout
    window.setTimeout(() => {
      this.resize(event);
    }, 150);
  }

  //When the modal has entered into view
  private ionViewDidEnter() {
    this.resize(false);
    this.sliderLoaded = true;
  }

  //Disables the scroll through the slider
  private disableScroll(event) {
    if (!this.sliderDisabled) {
      this.currentSlide = this.slider.getActiveIndex();
      this.sliderDisabled = true;
    }
  }

  //Enables the scroll through the slider
  private enableScroll(event) {
    if (this.sliderDisabled) {
      this.slider.slideTo(this.currentSlide, 0, false);
      this.sliderDisabled = false;
    }
  }
}
