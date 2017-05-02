
/*
将卷内容
*/

import { Injectable } from '@angular/core';
import { BaseService } from "./BaseService";
import { HttpService } from "./HttpService";
import { Storage } from '@ionic/storage';
@Injectable()
export class PaperService extends BaseService{
    public doRefresh:any;
    constructor(private httpService: HttpService,private storage:Storage) {
        super('mpaper');
        
    }
     //班级科目列表
    public classes(data?:any) {
        var url = this.API_URL + "classes";
        return this.httpService.httpGetWithAuth(url,data);
    }
    setLocalClasses(items){
        return this.storage.set(this.TABLES.classes,items);
    }
    getLocalClasses(){
        return this.storage.get(this.TABLES.classes);
    }
    //考试列表
    public exams(data?:any){
        var url = this.API_URL + "exams";
        return this.httpService.httpGetWithAuth(url,data);
    }

    //讲卷
    public scenes(data:any) {
        var url = this.API_URL + "scenes";
        //data.schoolGuid=this.schoolGuid;
        return this.httpService.httpGetWithAuth(url,data);
    }
  
    //成绩分布
    public scoresScene(data:any) {
        var url = this.API_URL + "scoresScene";
        //data.schoolGuid=this.schoolGuid;
        return this.httpService.httpGetWithAuth(url,data);
    }
    //小题得分
    public itemScene(data:any) {
        var url = this.API_URL + "itemScene";
        //data.schoolGuid=this.schoolGuid;
        return this.httpService.httpGetWithAuth(url,data);
    }
    //答案详情
    public answerScene(data:any) {
        var url = this.API_URL + "answerScene";
        //data.schoolGuid=this.schoolGuid;
        return this.httpService.httpGetWithAuth(url,data);
    }
  
    //成绩单
    public scorentity(data:any,index:number,rows:number) {
        data.index=index;
        data.length=rows
        var url = this.API_URL + "scoreEntity";
        //data.schoolGuid=this.schoolGuid;
        return this.httpService.httpGetWithAuth(url,data);
    }

    //答案详情
    public answerEntity(data:any) {
        var url = this.API_URL + "answerEntity";
        //data.schoolGuid=this.schoolGuid;
        return this.httpService.httpGetWithAuth(url,data);
    }
    //答卷
    public answerPaper(data?:any){
        var url = this.API_URL + "answerPaper";
        //data.schoolGuid=this.schoolGuid;
        return this.httpService.httpGetWithAuth(url,data);
    }
     //最近考试班级科目列表
    public options(data?:any){
        var url = this.API_URL + "options";
        return this.httpService.httpGetWithAuth(url,data);
    }
    public getLocalOptions(){
        return this.storage.get('options');
    }
    public setLocalOptions(options){
        return this.storage.set('options',options);
    }

    
}