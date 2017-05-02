import { ErrorHandler } from '@angular/core';
import {IonicErrorHandler} from 'ionic-angular';

export class MyErrorHandler extends IonicErrorHandler implements ErrorHandler {

constructor() { 
	super();
}
handleError(err: any): void {
	console.log('Error: ' + err);
	super.handleError(err);
	}
}