/*
异常处理
*/
import { Subject }    from 'rxjs/Subject';
import { Injectable } from '@angular/core';

@Injectable()
export class HttpHandler{
    private handleAuthSource=new Subject<string>();
    private handleMessageSource = new Subject<string>();
    private handleErrorSource = new Subject<string>();
    constructor() {}
  handleMessage$ = this.handleMessageSource.asObservable();
  handleAuth$= this.handleAuthSource.asObservable();
  handleError$= this.handleErrorSource.asObservable();
  // Service message commands
  handleMessage(message:string) {
     //this.handleMessageSource.next(message);
     throw {status:403,message:message};
  }
  handleAuth(message:string) {
    this.handleAuthSource.next(message);
  }
  handleError(error: any) {
    //
    console.log(error);
    if(!error.status){
      throw {status:600};
    }else{
      throw error;
    }
  }
 extractData(res){
    if(!res||!res.status){
      res={status:500,message:res}
      this.handleError(res);
    }
    else if(res.status ==200)//成功
    {
        return res.data;
    }
    else if(res.status==401){
       this.handleAuth(res.message);
       throw res;
        
    }
    else if(res.status==403){
       this.handleMessage(res.message);
       throw res;
        
    }else{
      this.handleError(res);
      throw res;
    }
  }

}