import { Component, Input,Output,EventEmitter, } from "@angular/core";

@Component({
    selector: 'count-down',
    template: `<span>{{displayString}}</span>`
})

export class Countdown {
    _start:number=0;
    processing:boolean=false;
    @Input() end: number=0;
    @Input() text:string='';
    @Output() onComplete: EventEmitter<any>=new EventEmitter<any>();
    @Input() set start(val:number){
        this._start=val;
        if(!this._start&&!this.end){
            this.displayString=this.text;
            //return;
        }else{
            this.processing||this._displayString();
        }
    };
    displayString:string='';
    constructor() {}
    _displayString() {
        this.processing=true;
        let timer:any=null;
        timer = setInterval(() => {
            this._start--;
            this.displayString= this._start + 's';
            //console.log('counter1',this.counter);
            if(this._start < this.end) {
                this.text&&(this.displayString=this.text);
                this.onComplete.emit();
                this.processing=false;
                clearInterval(timer);
                //console.log(this.displayString);
            }
        }, 1000);
    }
}