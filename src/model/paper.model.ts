export interface Ikv {name:string;code:string;}
export class KV { 
		constructor(public kv?:Ikv) { 
			if(kv){
				this.name=this.kv.name;
				this.code=this.kv.code;
			}
		}
		name:string;
		code:string;
		  clone() {
		  	return new KV({name:this.kv.name,code:this.kv.code});
		  }
}
export class PageInfo {
	constructor(public index:number=1,public length:number=20){
	}

}

export class Options{
	multiple:boolean;
	more:boolean;
	title:string;
	school:Ikv;
	constructor(public exams:any [],
		public _classes:any [],
		public subjects:any [],
		public total:number){
			this.classes=_classes;
		}
	set classes(classes:any []){
		this.multiple=classes.length>1;
		let len=0,_index=0;
	    this.multiple||classes.forEach((items,index)=>{
	      if(len<items.list.length){
	        len=items.list.length;
	        _index=index;
	      }
		});
		this.more=this.multiple?this.multiple:classes[_index].list.length>6;
	    this._classes=classes[_index].list?classes[_index].list.filter((item, index) => index < 6):[];
	    this.school={name:classes[_index].name,code:classes[_index].code};
	}
	get classes(){
		return this._classes;
	}
}

//export class ISelected { exam: KV=new KV(); class:KV= new KV(),subject:string=''}
export class Selected{
		constructor(public exam: Ikv,
					private _class:Ikv,
					public subject:string,
					public schoolGuid:string){}
		get class()  { return this._class;};
		set class(kv:Ikv) {
		  	this._class.name=kv.name;
		  	this._class.code=kv.code;
		}

	  clone() {
	    return new Selected(
	    	{name:this.exam.name,code:this.exam.code},
		    {name:this._class.name,code:this._class.code},
		    this.subject,
		    this.schoolGuid);
		}
	
}

export interface IAnswerContent {
	list:Array<any>;
	value:string;
	rate:number;
	color?:string;
}