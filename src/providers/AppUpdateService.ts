import { Injectable, } from '@angular/core';//import { LoadingController } from 'ionic-angular';
//import { Storage } from '@ionic/storage';
//import { HttpService } from "./HttpService";
//import { Transfer, TransferObject } from '@ionic-native/transfer';
//import { FileOpener } from '@ionic-native/file-opener';
//import { File } from '@ionic-native/file';
import { AppUpdate } from '@ionic-native/app-update';
import { NativeService } from "../providers/NativeService";

//declare var cordova: any;

@Injectable()
export class AppUpdateService {
    constructor(//public storage:Storage,
                //private httpService:HttpService,
                public nativeService:NativeService,
                public appUpdate:AppUpdate
                //public transfer: Transfer,
                //public file: File,
                //public loadingCtrl: LoadingController,
                //public fileOpener:FileOpener
    ) {}

    upgradeAppService(downLoadURL:string,appStoreURL:string) {
        console.log(downLoadURL);
        if (this.nativeService.isIos()) {
            console.log("is ios");
            //window.location.href = "itms-apps://itunes.apple.com/cn/app/qq/id451108668?mt=12";
            window.location.href = appStoreURL;
            return;
        }else if (this.nativeService.isAndroid()) {
            const updateUrl = downLoadURL;
            this.appUpdate.checkAppUpdate(updateUrl).catch(e=>{this.nativeService.showAlert(JSON.stringify(e))});
        }else {
            console.log("is other")
            return new Promise((resolve, reject) => {
                resolve(null);
            });
        }

        // if (this.nativeService.isIos()) {
        //     console.log("is ios");
        //     //window.location.href = "itms-apps://itunes.apple.com/us/app/xxxx
        //     window.open(appStoreURL);
        //     return;
        // }
        // else if (this.nativeService.isAndroid()) {
        //     console.log("is Android")
        //     const fileTransfer: TransferObject = this.transfer.create();
        //     let uploading = this.loadingCtrl.create({
        //         content: "安装包正在下载...",
        //         dismissOnPageChange: false
        //     });
        //
        //     let url = downLoadURL; //可以从服务端获取更新APP的路径
        //     let targetPath = this.file.dataDirectory+"www-7net-cc.apk"
        //     //let targetPath = "/sdcard/Download/www-7net-cc.apk"; //APP下载存放的路径，可以使用cordova file插件进行相关配置
        //     // var options = {};
        //     uploading.present();
        //
        //     fileTransfer.onProgress((event) => {
        //         //进度，这里使用文字显示下载百分比
        //         //  setTimeout(function () {
        //         var downloadProgress = (event.loaded / event.total) * 100;
        //         uploading.setContent("已经下载：" + Math.floor(downloadProgress) + "%");
        //
        //         if (downloadProgress > 99) {
        //             uploading.dismissAll();
        //         }
        //         // },10000);
        //
        //         /* setTimeout(() => {
        //          uploading.dismiss();
        //          }, 10000);*/
        //
        //     });
        //
        //     //url为服务端地址
        //     //targetPath为设备上的地址
        //     fileTransfer.download(url, targetPath, true).then(
        //         (result) => {
        //             uploading.dismissAll();
        //             this.fileOpener.open(targetPath, 'application/vnd.android.package-archive').then(
        //                 (entry)=> {
        //                     console.log('download complete: ' + entry.toURL());
        //                 });
        //         }
        //     );
        //
        //  }else{
        //     console.log("is other")
        //     return new Promise((resolve, reject) => {
        //         resolve(null);
        //     });
        // }
     }

}