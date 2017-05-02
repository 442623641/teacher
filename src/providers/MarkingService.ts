/*
*阅卷ing
*add by leo 201703161629001
*/
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BaseService } from "./BaseService";
import { HttpService } from "./HttpService";
import 'rxjs/add/operator/map';
/*
  Generated class for the Marking provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MarkingService extends BaseService{
	pool:Array<any>=[];
    constructor(private httpService: HttpService,private storage:Storage) {
     	super('mark');
    }

  //阅卷偏好设置
    preference(data?:any){
        var url = this.API_URL + "preference";
        return this.httpService.httpGetWithAuth(url,data);
    }

    //抽题
    subjects(data?:any,index?:number,length?:number){
        var url = this.API_URL;
        data.length=length;
        data.index=index;
        return this.httpService.httpGetWithAuth(url,data);
    }
    //提交
 	submit(data?:any){
 		var url = this.API_URL;
 		console.log(data);
    return this.httpService.httpPostWithAuth(url,data);
 	}
 	setLocalOptions(key:string,data:any []){
		this.storage.set(key,data);
 	}
 	getLocalOptions(key:string){
		return this.storage.get(key);
 	}
 	exception(data:any){
 		var url = this.API_URL + "exception";
		return this.httpService.httpPostWithAuth(url,data);
 	}
 	//查看整卷
 	get entirePaper(){
 		var url = this.API_URL + "entirePaper";
		return this.API_URL+'entirePaper?token='+this.httpService.token;
 	}
}
