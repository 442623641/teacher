/*
*阅卷
*add by leo 201703131129001
*/
import { Injectable } from '@angular/core';
import { BaseService } from "./BaseService";
import { HttpService } from "./HttpService";
import 'rxjs/add/operator/map';

/*
  Generated class for the MarkService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class MarkService extends BaseService{

	  constructor(private httpService: HttpService) {
	  	super('mark');

	  }
     
    //最近考试班级科目列表
    public tasks(data?:any){
        var url = this.API_URL + "tasks";
        return this.httpService.httpGetWithAuth(url,data);
    }
    //阅卷进度
    public progress(data?:any){
        var url = this.API_URL + "progress";
        return this.httpService.httpGetWithAuth(url,data);
    }
    //阅卷进度
    public markScene(data?:any){
        var url = this.API_URL + "markScene";
        return this.httpService.httpGetWithAuth(url,data);
    }
    //查看答案
    public answerUrl(data?:any){
      var url = this.API_URL + "answerUrl";
      return this.httpService.httpGetWithAuth(url,data);
    }

}
