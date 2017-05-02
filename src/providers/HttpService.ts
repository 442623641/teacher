import { Injectable } from '@angular/core';
import { Platform} from 'ionic-angular';
import { Http,Headers, RequestOptions } from '@angular/http';
import { HTTP } from '@ionic-native/http';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
import { HttpHandler } from "./HttpHandler";
/*
*本项目中用到API访问控制，思路是除了公开API，其他的都需要用token去访问，而这个token是和用户挂钩的，
*在登陆成功就生成了，调用系统功能时每个人必须带上自己的token，否则API返回401.
*实现思路是：登录时返回用户信息，其中包含token存储在本地，以后调用时从本地取出，
*连同请求一起发给服务器。要实现4种请求
*httpGetWithAuth、httpGetNoAuth、httpPostNoAuth、httpPostWithAuth
*/
@Injectable()
export class HttpService{
	//http:any;
	isNative:boolean;
    local:any={token:''};
    constructor(
        private http: Http,
        private nativeHttp: HTTP,
        private handleService:HttpHandler,
        private platform:Platform,
        private storage:Storage) {
			this.isNative=platform.is('mobile') && !platform.is('mobileweb');
			/*
			storage.get('userInfo').then(val =>
				this.local=val
			);*/
	    }
	getLocalInfo(){
		return this.storage.get('userInfo');

	}
    /*auto url for develop*/
    private url(url:string){
        //http://localhost:8100/
        //return url.replace('114.55.103.8:9090', (this.isNative?"114.55.103.8:9090":'localhost:8100'));
        return url.replace('116.62.25.178:9090', (this.isNative?"116.62.25.178:9090":'localhost:8100'));
        //return url;
    }

    public authenticate():boolean{
	    if(!this.local||!this.local.timestamp){
	        return false;
	    }
	    return (new Date().getTime()-this.local.timestamp)<82800000//23h;
	}
	get token():string{
       return this.local&&this.local.token?this.local.token:'';
  	}
    public localUpdate(val:any){
    	//this.requestOptions.localUpdate(val);
        this.local=val;
        //this.setHeader();
    }

    private json(res:any){
    	let data={};
        try{
        	if(res.status>=400){
        		//return this.handleService.handleMessage('请查看网络是否已经链接');
        		throw {status:600,message:'请查看网络是否已经链接'}
        	}
    		if(res.data){
    			data= JSON.parse(res.data);
    		}else{
    			data= res.json();
    		}
        }catch(ex){
            return this.handleService.handleError(res);
            
        }
        return this.handleService.extractData(data);
        
    }

    public httpGetWithAuth(url: string,body?:any) {
        body=body||{};
        url=this.url(url);
        //body.token=this.getToken();
        //body.token=this.token;
		var headers = new Headers();
	    headers.append('Token',this.token);
        return this.httpGetNoAuth(url,body,headers);
    }

    public httpGetNoAuth(url: string,body?:any,headers?:Headers) {
        body=body||{};
        url=this.url(url);
        let options=null;
        if(!this.isNative){
        	headers=headers||(new Headers());
        	headers.append('Content-Type', 'application/json');
		    options = new RequestOptions({ headers: headers });
	        return this.http.get(url+'?'+this.toParams(body),options).toPromise()
	            .then(res=>this.json(res))
	            .catch(err => {
	                this.handleService.handleError(err);
	            });
	    }else{
	    	//url=url+"?token="+this.getToken();
	    	options=headers?{Token:this.token}:{};
        	return this.nativeHttp.get(url, body,options)
			 .then(res=>this.json(res))
			  .catch(err => {
	                this.handleService.handleError(err);
	            });

	    }
    }

    public httpPostNoAuth(url: string, body?: any,headers?:Headers) {
        body=body||{};  
        url=this.url(url);
        let options=null;
        if(!this.isNative){
        	headers=headers||(new Headers());
	        headers.append('Content-Type', 'application/x-www-form-urlencoded');
	        options = new RequestOptions({ headers: headers });
	        return this.http.post(url, this.toParams(body),options).toPromise()
	            .then(res=>this.json(res))
	            .catch(err => {
	                this.handleService.handleError(err);
	            });
	    }else{
	    	options=headers?{Token:this.token}:{};
	    	return this.nativeHttp.post(url, body, options)
			  .then(res=>this.json(res))
			  .catch(err => {
	                this.handleService.handleError(err);
	            });
	    }
    }

    public httpPostWithAuth(url: string,body?: any) {
        //let user = this.local.get('UserInfo');
        body=body||{};
        url=this.url(url);
        //body.token=this.getToken();
        //body.token=this.token;
        var headers = new Headers();
	    headers.append('Token',this.token);
        return this.httpPostNoAuth(url,body,headers)
    }

    private toQueryPair(key, value) { 
        if (typeof value == 'undefined'){ 
            return key; 
        } 
        return key + '=' + encodeURIComponent(value === null ? '' : String(value));
    } 

    private toParams(obj?: any) { 

        if(typeof obj == 'undefined'){
            return '';
        }
        var ret = []; 
        for(var key in obj){ 
            key = encodeURIComponent(key); 
            var values = obj[key]; 
            if(values && values.constructor == Array){//数组 
                var queryValues = []; 
                for (var i = 0, len = values.length, value; i < len; i++) { 
                    value = values[i]; 
                    queryValues.push(this.toQueryPair(key, value)); 
                } 
                ret = ret.concat(queryValues); 
            }
            else{ //字符串 
                ret.push(this.toQueryPair(key, values)); 
            } 
        }
        return ret.join('&'); 
    } 
}