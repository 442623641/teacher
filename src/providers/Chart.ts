import { Injectable } from '@angular/core';

@Injectable()
export class Chart{
	constructor(){}
	//图表常用色值
	colors:any={'blue':'rgba(82, 167, 255,.7)','green':'rgba(82, 183, 134,.7)','red':'rgba(255, 82, 93,.7)',gray:'#f5f5f5','grayer':'#bfbfbf'}
	//柱状图
	column(data:Array<any>,categories:Array<any>,color: string='green',options:any={animation:true}): any{
		return {
				credits: {//版权信息
					enabled: false
				},
				plotOptions: {
		        	series: {
		                animation: !!options.animation
		           }
		        },
				title:false,
				series: [{
					data: data,
					color: this.colors[color],
					enableMouseTracking: false,
				}],
				chart:{
					type:'column',
					spacingBottom:20,
					lang: {
			            noData: '暂无数据'
			        }
				},
				yAxis:{//y轴
					allowDecimals: false,
					title:{text:null},
					gridLineColor:this.colors['gray'],
					gridLineWidth:1,
					labels:{
						style:{"color": this.colors['grayer']}
				    },
				    lineColor: this.colors['gray'],
            		lineWidth: 0
			    },
			    xAxis:{//x轴
			    	categories:categories,
			        labels:{
			        	style:{"color": this.colors['grayer']}
			        },
			        lineColor: this.colors['gray'],
            		lineWidth: 0
			    },
			    legend:{//标签提示符
			    	enabled:false
			    }
		}
	}
	//包含负值柱状图
	tree(data:Array<any>,options:any={animation:true}): any{

		return {
				credits: {//版权信息
					enabled: false
				},
				plotOptions: {
		        	series: {
		                animation: !!options.animation,
		                colorByPoint: true,
		                pointWidth: 30
		           }
		        },
		        colors: ['rgba(187, 187, 187, .7)','rgba(255, 82, 93, .7)'],
				title:false,
				series: [{
					type: "bar",
					data:data,
					enableMouseTracking: false,
					
					dataLabels: {
		                enabled: true,
		                //rotation: -90,,
		                //align: 'left',
		                verticalAlign:'middle',
		                //crop:false,
		                align: 'center',
		                format: '{point.name}', // one decimal
		                //y: 10, // 10 pixels down from the top
		                //x:2,
		                style:{
	                    	"color": '#333',//this.colors['grayer'], 
	                    	"fontSize": "13px", 
	                    	"fontWeight": "500",
	                    	"textOutline":"none"
		                }
		            }
				}],
				chart:{
					//backgroundColor:'#11a8ab',
					type:'column',
					inverted:true,
					spacingBottom:20,
					lang: {
			            noData: '暂无数据'
			        }
				},
				yAxis:{//y轴
					//allowDecimals: false,
					title:{text:null},
					gridLineColor:this.colors['gray'],
					gridLineWidth:1,
					labels:{
						style:{"color": this.colors['grayer']}
				    },
				    lineColor: this.colors['gray'],
            		lineWidth: 0
			    },
			    xAxis:{//x轴
			    	visible:false,
			    },
			    legend:{//标签提示符
			    	enabled:false
			    }
		}
	}


	//饼图
	//rgb(255, 127, 14),rgb(255, 187, 120),rgb(44, 160, 44),rgb(152, 223, 138),rgb(31, 119, 180),rgb(174, 199, 232)
	pie(data:Array<any>,options:any={animation:true}): any{
		return {
				//colors:['#32DBFF' ,'#2CD664','#00B2BE' ,'#FE5C3F','#E4E230'],
				//colors:['rgba(255, 127, 14,.6)','rgba(255, 187, 120,.6)','rgba(31, 119, 180,.6)','rgba(174, 199, 232,.6)','rgba(44, 160, 44,.6)','rgba(152, 223, 138,.6)'],
				colors: [
					  'rgba(220, 73, 238,1)',
					  'rgba(182, 77, 238,1)',
					  'rgba(121, 70, 232,1)',
					  'rgba(97, 90, 255,1)',
					  'rgba(70, 106, 232,1)',
					  '#4da3ff',
					  '#4ed6ff',
					  '#47e8e3',
					  '#5bffcb'],
				credits: {//版权信息
					enabled: false
				},
				title:false,
				/*
				series: [{
					data: data,
					color: '#75c59e',
					enableMouseTracking: false,
				}],*/
				chart:{
					//spacingBottom:20,
					lang: {
			            noData: '暂无数据'
			        },
			        spacing:[0,0,10,0]
				},
				/*
			    legend:{//标签提示符
			    	enabled:false
			    }*/
			    tooltip: {
		            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
		        },
		        plotOptions: {
		        	series: {
		                animation: !!options.animation
		            },

		            pie: {
		                dataLabels: {
		                    distance: 8,
		                    style:{
		                    	"color": this.colors['grayer'], 
		                    	"fontSize": "11px", 
		                    	"fontWeight": "500",
		                    	"textOutline":"none"
		                    }
		                }
		                //colors:['#8085e9','#434348','#f7a35c','#7cb5ec']
		            },
		        },
		        series: [{
		            type: 'pie',
		            name: '',
		            data: data,
		            enableMouseTracking: false,
		        }]
		}
	}


	//多边形
	polygon(data:Array<any>,categories:Array<any>,options:any={animation:true}): any{
		return {
		        credits: {//版权信息
					enabled: false
				},
		        chart: {
		        	animation:false,
		            polar: true,
		            type: 'line',
		            spacingBottom:30,
		            lang: {
			            noData: '暂无数据'
			        }
		        },
		        title:false,
		        pane: {
		            size: '80%'
		        },
		        xAxis: {
		            categories: categories,
		            tickmarkPlacement: 'on',
		            gridLineColor:this.colors['gray'],
					gridLineWidth:1,		            
					labels:{
						style:{"color": this.colors['grayer']}
				    },
				    lineColor: '#f5f5f5',
            		lineWidth: 0
		        },
		        yAxis: {
		            //gridLineInterpolation: 'polygon',
		            //min: 0,
		            labels:{
			        	style:{"color": this.colors['grayer']}
			        },
			        lineColor: this.colors['gray'],
            		lineWidth: 0
		        },
		        legend: {
		            enabled:false
		        },
		        plotOptions: {
		        	series: {
		                animation: !!options.animation
		           }
		        },
		        series: [{
				    marker: {
		                radius: 2,
		            },
		        	lineWidth: 1,
		            name: '',
		            data: data,
		            pointPlacement: 'on',
		            color:this.colors['blue'],
		            enableMouseTracking: false,
		        }]
			}
	}
}
