export class Score {
	public th:string;//题号
	public siblings:Array<number>=[];//其他评曰
	public tags:Array<string>=[];//标签
	public self:number;//我的评阅
	constructor(private obj:any={siblings:[],tags:[],th:'',self:undefined}) {	
		obj.siblings=obj.siblings||[];
		obj.tags=obj.tags||[];
		this.tags=obj.tags
		this.th=obj.th;
		this.siblings=obj.siblings;
		this.self=obj.self;
		
	}
	get selftion():any{
		if(!this.siblings.length){
			return this.self==undefined?"未评阅":this.self;
		}
		else {
			return (this.siblings.length+1)+" 评："+(this.self==undefined?'?':this.self);
		}
	}

}
export class Subject {
	public guid:string;
	public image:string;
	public scores:Score [];
	public mess:string;
	constructor(private obj:any,private scopes:any [])//给分信息
	{
		this.guid=obj.guid;
		this.image=obj.image;
		obj.scores=obj.scores||[];
		this.mess=obj.mess;
		let _scores=[];
		scopes.forEach((item,index)=>_scores.push(new Score(obj.scores[index]||{th:item.th,siblings:[],self:undefined})));
		this.scores=_scores;
		//obj=undefined;

	}
	createScores(scopes:any){
		this.scores=[];
		scopes.forEach(item=>this.scores.push(new Score(item.th)));
		//for(let i=0;i<len;i++) this.scores.push(new Score());
	}
	get selies():number []{
		let array=[];
		this.scores.forEach(score=>{
			array.push(score.self);
		});
		return array;
	}
	get nextIndex():number{
		let nextIndex=-1;
		for(let i=0;i<this.scores.length;i++){ 
			if(this.scores[i].self==undefined){
			   nextIndex=i;
			   break;
			}
		}
		return nextIndex;
		
	}

	get tags():Array<string []>{
		let array=[];
		this.scores.forEach(score=>{
			array.push({tag:score.tags,th:score.th});
		});
		return array;
	}

	clone():Subject{
	  	return new Subject(
	  		this.obj,
	  		JSON.parse(JSON.stringify(this.scores))
	  	);
	}
}

export class Scope {
	full:number;//满分
	step:number;//分数步长
	tags:Array<number>;//标签
	th:string;//题号
	range:number []=[0,1000];
	constructor(private obj:any={full:0,step:1,tags:[],th:'',options:[],range:[]}){
		this.full=obj.full;
		this.step=obj.step;
		this.tags=obj.tags;
		if(!obj.range.length){
			this.range=[0,this.full];
		}
		this.th=obj.th;
		this.options=obj.options;
	}
	//分数选择项
	get options(){
		return this.obj.options;
	}
	set options(opt:Array<number>){
		if(opt.length){
			this.obj.options=opt;
		}else{
	        for(let i=0;i<=this.obj.full;i+=this.obj.step) this.obj.options.push(i);
		}

	}
}
export class Preference{
	private createTime:number=0 
	entirety:boolean=true; //是否可以查看整卷
	exception:boolean=false; //是否可以提交异常卷
	limitTime:number=0;//最低评曰时间
	constructor(
		private obj:any={
			scopes:[new Scope()],
			entirety:true,
			exception:false,
			limitTime:0}){
		this.entirety=obj.entirety;
		this.exception=obj.exception
		this.limitTime=obj.limitTime;
		this.scopes=obj.scopes;
		this.limitTime&&(this.createTime=Math.floor(Date.now() / 1000));
	}

	update(){
		this.createTime=Math.floor(Date.now() / 1000);
	}

	remindTime(){
		if(!this.createTime){
			return 0;
		}else{
			let s=this.limitTime-Math.floor(Date.now() / 1000)+this.createTime;
			return s>0?s:0;
		}
	}
	get scopes(){
		return this.obj.scopes;
	}
	set scopes(scopes:Array<Scope>){
		this.obj.scopes.map(item=>{item=new Scope(item)});
		//scopes.forEach(x=>{
			//this._scopes.push(sc);
		//	this._scopes[]=new Scope(x);
		//});

	}
}
