/*
用户
*/
import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { HttpService } from "./HttpService";
import { BaseService } from "./BaseService";

@Injectable()
export class UserService extends BaseService{
    userInfo:any={};
    constructor(
        private httpService: HttpService,
        private storage:Storage) { 
        super('login');   
    }

    login(user) {
        var url = this.API_URL + "login";
        return this.httpService.httpPostNoAuth(url,user);
        //return this.local.get('login').then((value) => {return {status:200,data:{},message:""}});
    }
    //初始数据
    initialize(userInfo){
        userInfo.timestamp=new Date().getTime();
        this.storage.set(this.TABLES.userInfo,userInfo);
        this.httpService.localUpdate(userInfo);
        //this.storage.set(this.TABLES.login,login);
        //this.exams(userInfo);
    }

    logout(){
        this.storage.remove(this.TABLES.userInfo);
        //(<any>window).MobclickAgent.profileSignOff();
    }
    setUserInfo(userInfo){
        userInfo.timestamp=new Date().getTime();
        this.storage.set(this.TABLES.userInfo,userInfo);
        this.httpService.localUpdate(userInfo);
        //return this.storage.get(this.KEY).then((val) => {
        //    this.userInfo=val;         
        //});
    }
    setLogin(login){
        this.storage.set(this.TABLES.login,login);
    }
    getLogin(){
        return this.storage.get(this.TABLES.login);
    }
    setLocalAppVersion(version){
        this.storage.set(this.TABLES.appVersion,version);
    }
    getLocalVersion(){
        return this.storage.get(this.TABLES.appVersion);
    }
    getUserInfo(){
        return this.storage.get(this.TABLES.userInfo);
    }
}