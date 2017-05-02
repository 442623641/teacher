import { Component, OnInit,ViewChild } from '@angular/core';
import {  NavParams ,ViewController,NavController} from 'ionic-angular';
import {FormGroup, FormControl} from '@angular/forms';
import { MarkCheakService } from "../../providers/MarkCheakService";
import { MultiPicker } from 'ion-multi-picker';
import { MarkbackPage } from '../markback/markback';
import { NativeService } from "../../providers/NativeService";
import { MyResponse } from "../../model/page.model";

@Component({
  selector: 'page-markcheak',
  templateUrl: 'markcheak.html'
})
export class MarkcheakPage implements OnInit {
  @ViewChild(MultiPicker) multiPicker:MultiPicker;
  request:MyResponse=new MyResponse();
  //列表显示样式
  markType:number=0;
  _display:string="none"; selectItem:number = 0; _selectItem:number=0;
  //Tab内容
  selectItemArr:Array<string>=["答卷","标签","题组","范围","排序"];
  //选项内容
  itemArr:Array<Array<string>>=[["答卷","得分"],[],[],[],["时间降序","时间升序","评分降序","评分升序"]];
  _itemArr:Array<string>=this.itemArr[0];
  langForm;
  relationship:string="答卷";
  //接口参数
  paramsData:any;
  //接口返回的数据
  reviewList:any; fruit;
  //选择分数区间数据
  simpleColumns: any[];
  _optionsObj:{text:string,value:string}; _optionsArr:Array<Object>=[]; markPages:number=0;
  //题号
  _thList:Array<string>=[];
  //最大评分值
  maxScore:number=0;
  private isstart:boolean=false;
  items = [];
  //分页
  _index:number=1;
  _length:number=20;
  //infiniteShow:boolean=false;
  infiniteLock:boolean=true;

  _selectMenutop:string="53px";

  constructor( public navParams: NavParams,
               public viewCtrl: ViewController,
               public markCheakService:MarkCheakService,
               private navCtrl: NavController,
               public nativeService:NativeService
  ) {
    //获取上一个页面传递的参数
    this.paramsData=navParams.get("task");
    this.langForm = new FormGroup({
      "langs": new FormControl({value: 'rust', disabled: false})
    });

    this.simpleColumns = [
      {
        name: 'col1',
        columnWidth:"40%",
        options: this._optionsArr
      },{
        name: 'col2',
        columnWidth:"40%",
        options:this._optionsArr
      }
    ];
  }

  // ionViewWillEnter() {
  //   if (this.firstInto){
  //     console.log('ionViewWillEnter');
  //   this._index = 1;
  //   this.paramsData.index = this._index;
  //   this.markCheakService.markcheak(this.paramsData).then(_res=> {
  //     this.reviewList.splice(0, this.reviewList.length);
  //     this.reviewList = JSON.parse(JSON.stringify(_res.reviewData.list));
  //     this.markPages = _res.reviewData.all;
  //     this._thList = _res.thlist.join("-").split("-");
  //     if (this.reviewList.length > 0)
  //       this.request.status = 200;
  //     else
  //       this.request.status = 701;
  //
  //   }).catch(e=> {
  //     this.request = e;
  //   });
  // }
  // }

  doRefresh(refresher) {
  console.log('Begin async operation', refresher);
    this._index=1;
    this.paramsData.index = this._index;
    this.markCheakService.markcheak(this.paramsData).then(_res=>{
      this.reviewList.splice(0, this.reviewList.length);
      // this.itemArr[1].splice(0, this.itemArr[1].length);
      // this.itemArr[2].splice(0, this.itemArr[2].length);

      // this.maxScore=eval(_res.fullScores.join('+'));
      // for (let i=0;i<eval(_res.fullScores.join('+'))+1;i++)
      // {
      //   this._optionsObj={text:i.toString(),value:i.toString()};
      //   this._optionsArr.push(this._optionsObj);
      // }
      // if(_res.tags.length>0) {
      //   this.itemArr[1] = _res.tags.join("-").split("-");
      // }
      // this.itemArr[1].unshift("全部");
      // this.itemArr[2]=_res.thlist.join("-").split("-");
      // this.itemArr[2].unshift("题组");
      this.reviewList=JSON.parse(JSON.stringify(_res.reviewData.list));
      this.markPages=_res.reviewData.all;
      this._thList=_res.thlist.join("-").split("-");
      if(this.reviewList.length>0)
        this.request.status=200;
      else
        this.request.status=701;

      refresher.complete();
    }).catch(e=>{this.request=e;
      refresher.complete();
    });
    }

  doInfinite(_infiniteScroll){
    let cutPgaes=0;
    this.paramsData.max=this.selectItemArr[3].toString()=="范围"?this.maxScore:this.selectItemArr[3].toString().split("-")[1];
    this.paramsData.min=this.selectItemArr[3].toString()=="范围"?0:this.selectItemArr[3].toString().split("-")[0];
    cutPgaes=Math.floor(this.markPages/this._length);
    if (this.markPages%this._length>0){
      cutPgaes=cutPgaes+1;
    }
    if(this._index++ < cutPgaes){
      this.paramsData.index = this._index;
      this.markCheakService.markcheakMore(this.paramsData).then(rsd=> {
        if (rsd.list.length > 0) {
          Array.prototype.push.apply(this.reviewList, rsd.list);
        }
        _infiniteScroll.complete();
      });
    }else {
      _infiniteScroll.complete();
      this.infiniteLock=false;
    }
  }

  openMultiPicker(){
    this.multiPicker.open();
  }

  selectpicker(e){
    //this.nativeService.showLoading();
    if(parseInt(this.fruit.split("-")[0])>parseInt(this.fruit.split("-")[1])) {
      this.nativeService.showToast("分值范围选择错误，请重新选择！");
      return;
    }
    this.resetScore();
    this.getMarkCheakData();
  }

  resetScore(){

    this.selectItemArr[3]=this.fruit;
    this.paramsData.max=this.selectItemArr[3].toString().split("-")[1];
    this.paramsData.min=this.selectItemArr[3].toString().split("-")[0];
    // this.selectItemArr[3]=this.fruit=="0-0"?"范围":this.fruit;
    // this.paramsData.max=this.selectItemArr[3].toString()=="范围"?this.maxScore:this.selectItemArr[3].toString().split("-")[1];
    // this.paramsData.min=this.selectItemArr[3].toString()=="范围"?0:this.selectItemArr[3].toString().split("-")[0];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad');
    /*
    if(this.nativeService.isMobile()) {
      this._selectMenutop="72px";
    }else {
      this._selectMenutop="53px";
    }*/
    this.markCheakService.markcheak(this.paramsData).then(res=>{
      //this.firstInto=true;
      // if (res.reviewData.all>this._length) {
      // }
      this.maxScore=eval(res.fullScores.join('+'));
      for (let i=0;i<eval(res.fullScores.join('+'))+1;i++)
      {
        this._optionsObj={text:i.toString(),value:i.toString()};
        this._optionsArr.push(this._optionsObj);
      }
      if(res.tags.length>0) {
        this.itemArr[1] = res.tags.join("-").split("-");
      }
      this.itemArr[1].unshift("全部");
      this.itemArr[2]=res.thlist.join("-").split("-");
      this.itemArr[2].unshift("题组");
      this.reviewList=JSON.parse(JSON.stringify(res.reviewData.list));
      this.markPages=res.reviewData.all;
      this._thList=res.thlist.join("-").split("-");
      if(this.reviewList.length>0)
        this.request.status=200;
      else
        this.request.status=701;
    }).catch(e=>this.request=e);
  }

  getMarkCheakData(){
    this.request.status=0;
    this.paramsData.index=1;
    this.paramsData.length=this._length;
    this.infiniteLock=false;
    this.reviewList.splice(0,this.reviewList.length);
    this.markPages=0;
    this.markCheakService.markcheakMore(this.paramsData).then(rs=>{
      this.markPages=rs.all;
      this.reviewList=JSON.parse(JSON.stringify(rs.list));
      this.infiniteLock=true;
      if(this.reviewList.length>0)
        this.request.status=200;
      else
        this.request.status=701;
    }).catch(e=>this.request=e);
  }

  onSelect(){
    if (this.selectItem==3){
      this.openMultiPicker();
      this._display="none";
    }
    else
      {
        if (this.selectItem === this._selectItem) {
          this._display = this._display == "none" ? "block" : "none";
        }
        else {
          this._itemArr = this.itemArr[this.selectItem];
          this._display = "block";
          this._selectItem = this.selectItem;
        }
    }
  }

  hitRadio(e){
    this._index=1;
    this.selectItemArr[this.selectItem]=this.relationship.toString();
    this._display="none";
    if(this.selectItem==0){
      this.markType=this.itemArr[0].indexOf(this.relationship.toString());
    }
    if(this.selectItemArr[1].toString()=="全部" || this.selectItemArr[1].toString()=="标签"){
    this.paramsData.tag="";
    }else{
      this.paramsData.tag=this.selectItemArr[1].toString();
    }
    this.paramsData.selth=this.selectItemArr[2].toString()=="题组"?"":this.selectItemArr[2].toString();
    this.paramsData.max=this.selectItemArr[3].toString()=="范围"?this.maxScore:this.selectItemArr[3].toString().split("-")[1];
    this.paramsData.min=this.selectItemArr[3].toString()=="范围"?0:this.selectItemArr[3].toString().split("-")[0];
    this.paramsData.sort=this.selectItemArr[4].toString()=="排序"?"0":this.itemArr[4].indexOf(this.selectItemArr[4].toString());

    if(this.isstart) {
      this.getMarkCheakData();
    }
    this.isstart=true;
  }

  doSubmit(event) {
    event.preventDefault();
  }

  closeMeun(){
    this._display="none";
  }
  ionViewWillLeave(){
    this.closeMeun();
  }

  ngOnInit() {}

  private gomarkBack(item,index){
    this.paramsData.regionGuid=item;
    this.paramsData.index=index;
      this.navCtrl.push(MarkbackPage,{
        task:this.paramsData,
        callback:this.getData,
      });

  }
  getData=(data)=>{
    return new Promise((resolve)=>{
        setTimeout(
            ()=>{if(data.callbackType=="extremely"){
            this.reviewList.splice(data.index,1);
            this.markPages=this.markPages-1;
            if (this.markPages<=0)
                this.request.status=701;
            data.callbackType="";
        }else{
            this.reviewList[data.index].scores=JSON.parse(data.scores);
        }},700);
      resolve();
    })
  };
}
