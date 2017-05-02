/*
答题列表
*/
import { Component } from '@angular/core';
import { NavParams,NavController } from 'ionic-angular';
import { PaperService } from "../../providers/PaperService";
import { NativeService } from "../../providers/NativeService";
import { IAnswerContent } from "../../model/paper.model";
import { MyResponse } from "../../model/page.model";

@Component({
  selector: 'page-answerentity',
  templateUrl: 'answerentity.html'
})
export class AnswerentityPage {
  answer:string;
  request:MyResponse=new MyResponse();
  _params:any;
  titleUrls:Array<string>=[];
  contents:Array<IAnswerContent>;
  title:string='';

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public paperService:PaperService ,
    private nativeService:NativeService) { }
  ngAfterViewInit() {
    this._params=this.navParams.get('params');
    this.title='第'+this._params.th+'题';
    this.paperService.answerEntity(this._params)
    .then(re=>{
      this.titleUrls=re.titleUrl;
      this.contents=re.details;
      this.answer=re.answer;
      this.request.status=200;
    }).catch(res=>this.request=res);
  }

  openModalAlbum(item) {

    this.paperService.answerPaper(this.getParams(item.code)).then(res=>{
      res&&this.showImage(res.url,this.title+item.name)

    });
  }
  showImage(url:any,title:string){
    let array=Array.isArray(url)?url:[url];
    this.nativeService.showImage(array,title);
  }
  dismiss() {
    this.navCtrl.pop();
  }

  getParams(code:number){
    return {
        examGuid:this._params.examGuid,
        studentCode:code,
        subject:this._params.subject,
        th:this._params.th
      }
  }
    
}