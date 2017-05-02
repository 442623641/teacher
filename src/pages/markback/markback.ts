import { Component } from '@angular/core';
import { NavParams ,ViewController,Platform, ActionSheetController,AlertController,NavController,PopoverController} from 'ionic-angular';
import { MarkCheakService } from "../../providers/MarkCheakService";
import { NativeService } from "../../providers/NativeService";
import { PropoverMarkBackMenu } from '../propovers/markbackmenu/markbackmenu';
import { UserService } from "../../providers/UserService";

@Component({
  selector: 'page-markback',
  templateUrl: 'markback.html'
})
export class MarkbackPage {
  iloading:boolean=false;
  //接口参数
  paramsData:any;
  //得分
  score:string="";
  oldSccore:string="";
  topicName:string="";
  _imgUrl:string="";
  scoresIndex:number=0;
  newScores:any;
  tagList:Array<string>;
  tagChip:boolean=false;
  toggleShow:boolean=false;
  myTags:Array<string>=[];
  myTagsArray:Array<Array<string>>=[];
  _exception:boolean=false;  //提交异常卷
  _entirety:boolean=false;  //查看整卷
  buttonState:string="提交";
  //private tagListlength:number=0;
  private tagsObj: {th?: string, tag?: string} = {th:'',tag:''};
  private submitTags:Array<Object>=[];
  private submitScores:Array<number>=[];
  private scoresEnd:boolean=false;
  private scoresItem:any;
  private _options:Array<string>=[];
  private buttonsSheet:Array<Object>=[];
  private _buttonsSheet:Array<Object>=[];
  private  _token='';

  myevent:any;
  callback:any;

  constructor( public navParams: NavParams,
               public viewCtrl: ViewController,
               public markCheakService:MarkCheakService,
               public platform: Platform,
               public actionsheetCtrl: ActionSheetController,
               public alertCtrl: AlertController,
               private navCtrl: NavController,
               public nativeService:NativeService,
               private popoverCtrl: PopoverController,
               private userService:UserService
  ) {
    //获取上一个页面传递的参数
    this.paramsData=navParams.get("task");
    this.callback=this.navParams.get('callback');
  }

  sendData():void{
    this.callback((this).paramsData).then(()=>{
      this.navCtrl.pop();
    });
  }

  openMenu($event) {
    this.myevent=$event;
    this.buttonsSheet=[
      {
        text: '异常试卷',
        handler: () => {

          if(!this._exception){
            this.presentAlert("您没有权限提交异常卷！");
            return;
          }else{
            this.openPopoverMarkBackMenu(this.myevent)
          }
          console.log('Exception clicked');
        }
      },
      {
        text: '查看整卷',
        //icon: !this.platform.is('ios') ? 'share' : null,
        handler: () => {
          if(!this._entirety){
            this.presentAlert("您没有权限查看整卷！");
            return;
          }else {
            this.showAllPaper();
          }
          console.log('Entirety clicked');
        }
      },
      {
        text: '取消',
        role: 'cancel',
        //icon: !this.platform.is('ios') ? 'close' : null,
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
    this._buttonsSheet.splice(0,this._buttonsSheet.length);
    if(this._exception)
      this._buttonsSheet[this._buttonsSheet.length]=this.buttonsSheet[0];
    if(this._entirety)
      this._buttonsSheet[this._buttonsSheet.length]=this.buttonsSheet[1];
    this._buttonsSheet[this._buttonsSheet.length]=this.buttonsSheet[2];
    this.buttonsSheet.splice(0,this.buttonsSheet.length);
    let actionSheet = this.actionsheetCtrl.create({
      cssClass: 'action-sheets-basic-page',
      buttons:this._buttonsSheet
    });
    actionSheet.present();
  }
  openPopoverMarkBackMenu(myEvent){

    let popover = this.popoverCtrl.create(PropoverMarkBackMenu,
        {task:this.paramsData,
          callbackyc:this.popMy,
        });

    popover.onDidDismiss((data:any={}) => {
    });
    myEvent.target.getBoundingClientRect=()=>{
      return {
        top:0,
        left:12,
      }
    }
    popover.present({
      ev: myEvent
    });
  }
  popMy=(data)=>{
    this.paramsData.callbackType="extremely";
    return new Promise((resolve)=>{
      this.callback(this.paramsData).then(()=>{
        this.navCtrl.pop();
      });
      console.log(data)
      resolve();
    })
  };

  onkeyboard(_score:string){
    if(this.score.length==0&&_score=='.'){
      this.score='';
      return;
    }else {
      this.score = this.score + _score;
      if(this.score.substr(0,2)=="00")
        this.score="0";
      if(this.score.substr(0,3)=="0.0")
        this.score="0";
      if(this.score.substr(0,1)=="0"&&this.score.substr(1,1)!=".")
        this.score=_score;

      let strIndex=this.score.indexOf('.');

      if(strIndex>0){
        if(_score=='.'){
          this.score=this.score.substr(0,strIndex+1)
        }
        else{
          this.score=this.score.substr(0,strIndex+2)
        }
      }
        this.cheakScore();
    }
  }

  cheakScore(){
    let arrIndex=this._options.indexOf(this.score);
    if(arrIndex<=-1&&this.score.substr(this.score.length-1,1)!='.') {
      if(this.newScores[this.scoresIndex].options.length<=0) {
        this.presentAlert("您输入的分值为："+this.score+"分，但该题您只能提交0~" + this.newScores[this.scoresIndex].full + "步长为" + this.newScores[this.scoresIndex].step + "的分值。")
        this.score="";
        this.newScores[this.scoresIndex].self=this.oldSccore;
        return false;
      }
      else {
        this.presentAlert("您输入的分值为："+this.score+"分，但该题您只能提交以下分值："+this.newScores[this.scoresIndex].options+"");

        this.score="";
        this.newScores[this.scoresIndex].self=this.oldSccore;
        return false;
      }
    }
    else {
      //高低分检查
      if (this.newScores[this.scoresIndex].range.length>0){
        if(parseFloat(this.score)<this.newScores[this.scoresIndex].range[0])
          this.presentAlert("该题您的评分过低！");
        if(parseFloat(this.score)>this.newScores[this.scoresIndex].range[1])
          this.presentAlert("该题您的评分过高！");
      }
      this.newScores[this.scoresIndex].self=this.score;
      return true;
    }
  }

  onDelkeyboard(){
    this.score=this.score.substr(0, this.score.length - 1);
    this.newScores[this.scoresIndex].self=this.score;
  }

  onSubmitkeyboard(){
    this.buttonState="";
    if(this.score=="")
      this.score=this.oldSccore;

    if(this.cheakScore()) {
      this.submitScores.splice(0, this.submitScores.length);
      this.submitTags.splice(0, this.submitTags.length);
       this.newScores.map((item,index) => {
        this.submitScores.push(item.self.substr(item.self.length-1,1)=='.'?item.self.substr(0,item.self.length-1):item.self);
        this.tagsObj.th = item.th;
        //this.tagsObj.tag = item.tags;
          this.tagsObj.tag = JSON.parse(JSON.stringify(this.myTagsArray[index]));

        this.submitTags.push(JSON.parse(JSON.stringify(this.tagsObj)));
      });
      console.log(this.submitTags);
      this.paramsData.scores = JSON.stringify(this.submitScores);
      this.paramsData.tags = JSON.stringify(this.submitTags);
      this.markCheakService.markbackSubmit(this.paramsData).then(rs=> {
        this.sendData();
        this.score = "";
      })
    }
  }

  selectScoreItem(scoritem){
    this.scoresIndex=scoritem;
    this.score="";
    this.oldSccore=this.newScores[this.scoresIndex].self;
    this.tagList=this.newScores[this.scoresIndex].taglist;
    console.log(this.tagList);
    this.getOptions();
  }

  getOptions(){

    this.scoresItem=JSON.parse(JSON.stringify(this.newScores[this.scoresIndex]));
    this._options.splice(0,this._options.length);
    this.topicName=this.newScores[this.scoresIndex].th;
    if(this.scoresItem.options.length>0) {
      this._options=this.scoresItem.options.join("-").split("-")
    }
    else {
      for(let i=0;i<Math.ceil(this.scoresItem.full/this.scoresItem.step);i++) {
        this._options.push((i*this.scoresItem.step).toString());
      }
      this._options.push(this.scoresItem.full.toString());
    }
    console.log(this._options);
  }

  presentAlert(msg){
    let confirm = this.alertCtrl.create({
      title: '温馨提示',
      message: msg,
      buttons: [
        {
          text: '确定',
          handler: () => {
            //this.score="";
            if(this.scoresEnd){
              this.navCtrl.pop();
            }
          }
        }
      ]
    });
    confirm.present();
  }

  showAllPaper(){
    this.nativeService.showImage([this.markCheakService.domin+'mark/entirePaper?ru='
    +this.paramsData.ru+'&examGuid='+
    this.paramsData.examGuid+'&regionGuid='+
    this.paramsData.regionGuid+'&token='+
    this._token],"查看整卷");
  }

  chipClick(tagItem:number){
    if(this.myTags.indexOf(this.tagList[tagItem])>-1){
      this.myTags.splice(this.myTags.indexOf(this.tagList[tagItem]),1);
    }
    else{
      this.myTags.push(this.tagList[tagItem]);
    }

    //
    if(this.myTagsArray[this.scoresIndex].indexOf(this.tagList[tagItem])>-1){
      this.myTagsArray[this.scoresIndex].splice(this.myTagsArray[this.scoresIndex].indexOf(this.tagList[tagItem]),1);
    }
    else {
      this.myTagsArray[this.scoresIndex].push(this.tagList[tagItem].toString());
    }
    console.log(this.myTagsArray);
  }

  ionViewDidLoad() {
    this.iloading=true;
    this.userService.getUserInfo().then(userinfo=>{
      this._token = userinfo.token;
    }).catch(err=>{
      console.log("_token用户验证信息获取出错:"+err);
    })
    this.markCheakService.markback(this.paramsData).then(res=>{
      this._imgUrl=res.image;
      this.newScores=JSON.parse(JSON.stringify(res.scores));
      this.tagList=this.newScores[this.scoresIndex].taglist;
      this.topicName=this.newScores[this.scoresIndex].th;
      //this.myTags=this.newScores[this.scoresIndex].tags;
      this.newScores.map((itemTags,_index) => {
        this.myTagsArray.push(JSON.parse(JSON.stringify(itemTags.tags)));
        this.myTags=this.myTags.concat(this.newScores[_index].tags);
      });
      console.log(this.myTags);
      //this.score=this.newScores[this.scoresIndex].self;
      this.oldSccore=this.newScores[this.scoresIndex].self;
      this.getOptions();
      this._exception=res.exception;
      this._entirety=res.entirety;
      if (this.tagList.length>0){
        this.tagChip=true;
        this.toggleShow=true;
      }
      this.iloading=false;
    });
  }
}
