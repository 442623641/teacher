import {  Directive, ElementRef,Output, EventEmitter,HostListener} from '@angular/core';
import { Gesture } from 'ionic-angular';
@Directive({
  selector: '[zoomable]',
})
export class ZoomableDirective {

  @Output() disableScroll = new EventEmitter();
  @Output() enableScroll = new EventEmitter();

  private imageElement:any;
  private containerElement:any;

  private scrollableElement: any;

  private gesture: Gesture;
  private scale: number = 1;
  private scaleStart: number = 1;

  private maxScale: number = 3;
  private minScale: number = 1;
  private minScaleBounce: number = 0.2;
  private maxScaleBounce: number = 0.35;

  private imageWidth: number = 0;
  private imageHeight: number = 0;

  private position: any = {
    x: 0,
    y: 0,
  };
  private scroll: any = {
    x: 0,
    y: 0,
  };
  private centerRatio: any = {
    x: 0,
    y: 0,
  };
  private centerStart: any = {
    x: 0,
    y: 0,
  };
  private dimensions: any = {
    width: 0,
    height: 0,
  };
  private panCenterStart = {
    x: 0, y: 0,
  };

  constructor(private el: ElementRef) {
  }
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resize(event);
  }
  public ngAfterViewInit() {
    // Get the scrollable element

    this.scrollableElement = this.el.nativeElement.querySelector('.scroll-content');
    this.containerElement=this.scrollableElement.querySelector('.scroll-zoom-wrapper');
    setTimeout(()=> {
    	this.imageElement=this.containerElement.querySelector('img');
    	//console.log('imageElement',this.imageElement);
    	this.resize(false);
    	this.attachEvents();},
    	3000);

    // Attach events
    

    // Listen to parent resize
    /*
    this.parentSubject.subscribe(event => {
      this.resize(event);
    });*/

    // Resize the zoomable image
    
  }
  /**
   * Attach the events to the items
   */
  private attachEvents() {
    // Gesture events
    this.gesture = new Gesture(this.containerElement);
    this.gesture.listen();
    this.gesture.on('doubletap', e => this.doubleTapEvent(e));
    this.gesture.on('pinch', e => this.pinchEvent(e));
    this.gesture.on('pinchstart', e => this.pinchStartEvent(e));
    this.gesture.on('pinchend', e => this.pinchEndEvent(e));
    this.containerElement.style.touchAction="manipulation";
   // this.gesture.on('pan', e => this.panEvent(e));

    // Scroll event
    //this.scrollListener = this.scrollEvent.bind(this);
    //this.scrollableElement.addEventListener('scroll', this.scrollListener);
  }

  /**
   * Called every time the window gets resized
   */
  public resize(event) {
    // Set the wrapper dimensions first
    this.setWrapperDimensions(event.width, event.height);
    // Get the image dimensions
    this.setImageDimensions();
  }

  /**
   * Set the wrapper dimensions
   *
   * @param  {number} width
   * @param  {number} height
   */
  private setWrapperDimensions(width:number, height:number) {
    this.dimensions.width = width || this.el.nativeElement.offsetWidth;
    this.dimensions.height = height || this.el.nativeElement.offsetHeight;
  }

  /**
   * Get the real image dimensions and other useful stuff
   */
   
  private setImageDimensions() {
    this.saveImageDimensions();
  }

  /**
   * Save the image dimensions (when it has the image)
   */
  private saveImageDimensions() {
    const width = this.imageElement.offsetWidth;//this.imageEntity['width'];
    const height = this.imageElement.offsetHeight; //this.imageEntity['height'];
    this.imageWidth = this.dimensions.width;
    this.imageHeight = height / width * this.dimensions.width;

    //this.maxScale = Math.max(width / this.imageWidth - this.maxScaleBounce, 1.5);
    this.imageElement.style.width = "100%";//`${this.imageWidth}px`;
    //this.imageElement.style.height = `${this.imageHeight}px`;

    this.displayScale();
  }

  /**
   * While the user is pinching
   *
   * @param  {Event} event
   */
  private pinchEvent(event) {
    //console.log('pinchEvent');
    let scale = this.scaleStart * event.scale;

    if (scale > this.maxScale) {
      scale = this.maxScale + (1 - this.maxScale / scale) * this.maxScaleBounce;
    } else if (scale < this.minScale) {
      scale = this.minScale - (1 - scale / this.minScale) * this.minScaleBounce;
    }

    this.scale = scale;
    this.displayScale();

    event.preventDefault();
  }

  /**
   * When the user starts pinching
   *
   * @param  {Event} event
   */
  private pinchStartEvent(event) {
    console.log('pinchStartEvent');
    this.scaleStart = this.scale;
    this.setCenter(event);
  }

  /**
   * When the user stops pinching
   *
   * @param  {Event} event
   */
  private pinchEndEvent(event) {
    console.log('pinchEndEvent');
    this.checkScroll();

    if (this.scale > this.maxScale) {
      this.animateScale(this.maxScale);
    } else if (this.scale < this.minScale) {
      this.animateScale(this.minScale);
    }
  }

  /**
   * When the user double taps on the photo
   *
   * @param  {Event} event
   */
  private doubleTapEvent(event) {
    this.setCenter(event);

    let scale = this.scale > 1 ? 1 : 2.5;
    if (scale > this.maxScale) {
      scale = this.maxScale;
    }

    this.animateScale(scale);
  }

  /**
   * Set the startup center calculated on the image (along with the ratio)
   *
   * @param  {Event} event
   */
  private setCenter(event) {
    const realImageWidth = this.imageWidth * this.scale;
    const realImageHeight = this.imageHeight * this.scale;

    this.centerStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
    this.centerStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);
    this.panCenterStart.x = Math.max(event.center.x - this.position.x * this.scale, 0);
    this.panCenterStart.y = Math.max(event.center.y - this.position.y * this.scale, 0);

    this.centerRatio.x = Math.min((this.centerStart.x + this.scroll.x) / realImageWidth, 1);
    this.centerRatio.y = Math.min((this.centerStart.y + this.scroll.y) / realImageHeight, 1);
  }

  /**
   * Set the scroll of the ion-scroll
   */
  private setScroll() {
    this.scrollableElement.scrollLeft = this.scroll.x;
    this.scrollableElement.scrollTop = this.scroll.y;
  }

  /**
   * Calculate the position and set the proper scale to the element and the
   * container
   */
  private displayScale() {
    const realImageWidth = this.imageWidth * this.scale;
    const realImageHeight = this.imageHeight * this.scale;

    this.position.x =Math.max((this.dimensions.width - realImageWidth) / (2 * this.scale), 0);
    this.position.y =Math.max((this.dimensions.height - realImageHeight) / (2 * this.scale), 0);

    this.imageElement.style.transform = 'scale(${this.scale})';//`scale(${this.scale}) translate(${this.position.x}px, ${this.position.y}px)`;
    this.containerElement.style.width = `${realImageWidth}px`;
    this.containerElement.style.height = `${realImageHeight}px`;

    this.scroll.x = this.centerRatio.x * realImageWidth - this.centerStart.x;
    this.scroll.y = this.centerRatio.y * realImageWidth - this.centerStart.y;
    this.setScroll();
  }

  /**
   * Check wether to disable or enable scroll and then call the events
   */
  private checkScroll() {
    if (this.scale > 1) {
      this.disableScroll.emit({});
    } else {
      this.enableScroll.emit({});
    }
  }

  /**
   * Animates to a certain scale (with ease)
   *
   * @param  {number} scale
   */
  private animateScale(scale:number) {
    this.scale += (scale - this.scale) / 5;

    if (Math.abs(this.scale - scale) <= 0.1) {
      this.scale = scale;
    }

    this.displayScale();

    if (Math.abs(this.scale - scale) > 0.1) {
      window.requestAnimationFrame(this.animateScale.bind(this, scale));
    } 
    //else {
    //  this.checkScroll();
    //}
  }	  
}