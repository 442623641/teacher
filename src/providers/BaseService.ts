//import { NativeService } from '../../providers/NativeService';
/*
base Service
*/
export class BaseService{
    TABLES:any={
    	userInfo:"userInfo",
    	exams:"paper_exams",
    	login:"login",
        scoreEntity:'scoreEntity',
        classes:"classes",
        appVersion:"appVersion",
        configuration:"configuration",
    };
    //domin:string='http://localhost:8100/';
    //domin:string='http://114.55.103.8:9090/';
    domin:string='http://116.62.25.178:9090/';
    URLS:any;
    API_URL:string;
    constructor(private api?:string) {    
    	this.URLS={
	    	login:this.domin,
	    	mpaper:this.domin+"mpaper/",
            mark:this.domin+"mark/",
	    }
	    if(api){
	    	this.API_URL=this.URLS[api];
	    }else{
	    	this.API_URL=this.domin;
	    }
	}

  }