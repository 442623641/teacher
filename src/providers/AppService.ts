import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { BaseService } from "./BaseService";
import { HttpService } from "./HttpService";
@Injectable()
export class AppService extends BaseService{
    constructor(private storage :Storage,private httpService: HttpService) {
        super();
    }
    //获取APP最新版本号
    public getAppversion(){
        var url = this.API_URL + "index/getAppinfo";

        return this.httpService.httpGetNoAuth(url).then((value) => {
                return value;
        }).catch(e=>{console.log(e)});
    }

    //用户反馈
    public sendFeed(feed:string){
        var url = this.API_URL + "UserCentre/feedBack";
        var data={feedContent:feed};
        return this.httpService.httpPostWithAuth(url,data).then((value) => {
            return value;
        }).catch(e=>{console.log(e)});
    }

    //修改密码获取验证码
    public getVcode(userCode:string){
        var url = this.API_URL + "UserCentre/getVcode";
        var data={userCode:userCode}
        return this.httpService.httpGetWithAuth(url,data).then(value=>{
            return value;
        }).catch(e=>{console.log(e)});
    }

    //检查验证码
    public checkVcode(vcode:string){
        var url = this.API_URL + "UserCentre/checkVcode";
        var data={vCode:vcode}
        return this.httpService.httpGetWithAuth(url,data).then(value=>{
            return value;
        }).catch(e=>{console.log(e)});
    }

    //修改密码
    public changePassWord(data:any){
        var url = this.API_URL + "UserCentre/changePassWord";
        return this.httpService.httpPostWithAuth(url,data).then(value=>{
            return value;
        }).catch(e=>{console.log(e)});
    }

    //找回密码获取验证码
    public getBackVcode(userCode:string){
        var url = this.API_URL + "index/getBackVcode";
        var data={userCode:userCode}
        return this.httpService.httpGetNoAuth(url,data).then(value=>{

            this.httpService.localUpdate(value);
            return value;
        }).catch(e=>{console.log(e)});
    }

    //找回密码检查验证码
    public checkBackVcode(vcode:string){
        var url = this.API_URL + "index/checkBackVcode";
        var data={vCode:vcode}
        return this.httpService.httpGetWithAuth(url,data).then(value=>{
            return value;
        }).catch(e=>{console.log(e)});
    }

    //找回密码修改密码
    public changeBackPassWord(data:any){
        var url = this.API_URL + "index/changeBackPassWord";
        return this.httpService.httpPostWithAuth(url,data).then(value=>{
            return value;
        }).catch(e=>{console.log(e)});
    }

    //修改头像
    public uploadHeadInfo(data:any){
        var url = this.API_URL + "UserCentre/uploadHeadInfo";
        return this.httpService.httpPostWithAuth(url,data).then(value=>{
            return value;
        }).catch(e=>{console.log(e)});
    }

    //获取客服电话
    public getservicTel(){
        var url = this.API_URL + "UserCentre/tel";
        return this.httpService.httpGetWithAuth(url).then(value=>{
            return value;
        }).catch(e=>{console.log(e)});
    }

    //获取公司简介
    public getIntroduction(){
        var url = this.API_URL + "UserCentre/introduction";
        return this.httpService.httpGetWithAuth(url).then(value=>{
            return value;
        }).catch(e=>{console.log(e)});
    }
    public setConfiguration(config:any){
       this.storage.set(this.TABLES.configuration,config);
    }
    public getConfiguration(){
        return this.storage.get(this.TABLES.configuration).then(value=>{
            console.log('configuration',value);
            return value;
        });
    }

}
