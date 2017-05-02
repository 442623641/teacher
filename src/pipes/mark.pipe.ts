import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'progress'
})
export class Progress implements PipeTransform {
    transform(value:number,count:number): string{ 
    	if(value<1) {
    		return '0%'; 
    	}
    	return count*100/value+'%';
    	  
    }
    ////"proxyUrl": "http://114.55.103.8:9090/mark"
}