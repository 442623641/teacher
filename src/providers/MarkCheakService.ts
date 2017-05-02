/*
*阅卷
*add by leo 201703131129001
*/
import { Injectable } from '@angular/core';
import { BaseService } from "./BaseService";
import { HttpService } from "./HttpService";
import 'rxjs/add/operator/map';

@Injectable()
export class MarkCheakService extends BaseService{

	  constructor(private httpService: HttpService) {
          super();
	  }

    //回评检查列表
    public markcheak(data?:any){
        var url = this.API_URL + "review";
        return this.httpService.httpGetWithAuth(url,data);
    }

    public markcheakMore(data?:any){
        var url = this.API_URL + "review/moreDatas";
        return this.httpService.httpGetWithAuth(url,data);
    }

    public markback(data?:any){
        var url = this.API_URL + "review/reviewmarking";
        return this.httpService.httpGetWithAuth(url,data);
    }

    public markbackSubmit(data?:any){
        var url = this.API_URL + "mark";
        return this.httpService.httpPostWithAuth(url,data);
    }

    public markbackExceptionSubmit(data?:any){
        var url = this.API_URL + "mark/exception";
        return this.httpService.httpPostWithAuth(url,data);
    }

}
