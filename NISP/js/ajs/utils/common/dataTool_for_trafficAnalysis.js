

function dateFormat(time,template){
	var current = time;
	var year = current.getFullYear();
	var month = current.getMonth()+1;
	if (month < 10) {
		month = "0"+month;
	}
	var date = current.getDate();
	if (date < 10) {
		date = "0"+date;
	}
	var hour = current.getHours();
	if (hour < 10) {
		hour = "0"+hour;
	}
	var minute = current.getMinutes();
	if (minute < 10) {
		minute = "0" +minute;
	}
	var second = current.getSeconds();
	if (second < 10) {
		second = "0" + second
	}
	var millsecond = current.getMilliseconds();
	
	return template.replace("yyyy",year)
	.replace("MM",month).replace("dd",date).replace("HH",hour)
	.replace("mm", minute).replace("ss",second).replace("SSS", millsecond);

}



function translateDataForActiveUserChart(mydata){
	var data_time = 0;     //时间格子的位数
	var data_user = 1;    //协议名的位数
	var chartdata = [];
	
	var data = mydata.split("\n");
	data.sort();
	for(var i = 0;i<data.length; i++){
		if(data[i]!=""){
			data[i] = data[i].split(",");
			chartdata.push(parseInt(data[i][data_user]));
		}
	}
	
	var seriesOptions_area = [{
			name: "活跃用户数",
			pointInterval: 5 * 60 * 1000,
            pointStart: timeBlockToUTC(data[1][data_time]),
			data: chartdata
	}];
	
	return seriesOptions_area;
}



function translateDataForLinkNumChart(mydata){
	var arr = {};
	var chartdata_area = {};
	var tabledata = [];
	var optdata = {};
	var index = 0;
	var lastTime ='';
	
	var data_time = 0;     //时间格子的位数
	var data_totalLink = 1;    //总
	var data_udpLink = 3;      //udp
	var data_tcpLink = 2;       //tcp
	var tcpArray = [];
	var udpArray = [];

	
	
	var data = mydata.split("\n");
	data.sort();
	//console.log(data)
	for(var i = 0;i<data.length; i++){
		if(data[i]!=""){
			data[i] = data[i].split(",");
			
			//console.log(data[i][data_time]);
			var _newdateUTC = timeBlockToUTC(data[i][data_time]);
			if((data[i][data_tcpLink])*1!=0||(data[i][data_udpLink])*1!=0){
				lastTime = _newdateUTC;
			}
			if(lastTime==''){lastTime = _newdateUTC}
			//lastTime = _newdateUTC;
			data[i][data_time] = _newdateUTC;
			tcpArray.push(parseInt(data[i][data_tcpLink]));
			udpArray.push(parseInt(data[i][data_udpLink]));
			
			optdata[_newdateUTC] = data[i];
		}
	}

	var seriesOptions_area = [{
		name: "UDP连接数",
		pointInterval: 5 * 60 * 1000,
		pointStart: data[1][data_time],
		data: udpArray
	},{
		name: "TCP连接数",
		pointInterval: 5 * 60 * 1000,
		pointStart: data[1][data_time],
		data: tcpArray	
	}];
	
	for(var i in optdata){
		optdata[i][data_time] = funConvertUTCToNormalDateTime(optdata[i][data_time]);
	}
	
	tabledata.push(optdata[lastTime]);
	
	arr = {
		optdata : optdata,
		chart : seriesOptions_area,
		table : tabledata,
	};
	
	return arr;
}


function translateDataForChart(mydata){
	var arr = {};
	var chartdata = {};
	var chartdata_area = {};
	var tabledata = [];
	var optdata = {};
	var totle_flow_avg = 0;   //算流量平均值
	var index = 0;
	var lastTime ='';
	
	var data_protoid = 0;  //协议ID的位数
	var data_proto = 0;    //协议名的位数
	var data_time = 1;     //时间格子的位数
	var data_totalPacket = 2;    //总包数的位数
	var data_outPacket = 3;      //上行包数
	var data_inPacket = 4;       //下行包数
	var data_totalFlow = 5;    //总流量的位数
	var data_outFlow = 6;      //上行流量
	var data_inFlow = 7;       //下行流量
	
	
	var data = mydata.split("\n");
	data.sort();
	//console.log(data)
	for(var i = 0;i<data.length; i++){
		if(data[i]!=""){
			data[i] = data[i].split(",");
		
			
			data[i][data_totalPacket] = parseInt(data[i][data_totalPacket]/300);
			data[i][data_outPacket] = parseInt(data[i][data_outPacket]/300);
			data[i][data_inPacket] = parseInt(data[i][data_inPacket]/300);
	
			data[i][data_totalFlow] = data[i][data_totalFlow]/300*8;
			data[i][data_outFlow] = data[i][data_outFlow]/300*8;
			data[i][data_inFlow] = data[i][data_inFlow]/300*8;
			
			var _newdateUTC = timeBlockToUTC(data[i][data_time]);
			data[i][data_time] = _newdateUTC;
			if((data[i][data_totalFlow])*1!=0){
				lastTime = _newdateUTC;
			}
			//var _newdateFormate = year+"/"+month+"/"+day+" "+hour+":"+minute+":"+second;
			if(lastTime==''){lastTime = _newdateUTC}
			totle_flow_avg = totle_flow_avg + (data[i][data_totalFlow])*1;
			
			
			if(data[i][data_proto] in chartdata){
				chartdata[data[i][data_proto]].push([_newdateUTC,data[i][data_totalFlow]*1]);
				chartdata_area[(data[i][data_proto])].push(data[i][data_totalFlow]*1);
			}else{
				chartdata[(data[i][data_proto])] = [[_newdateUTC,data[i][data_totalFlow]*1]];
				chartdata_area[(data[i][data_proto])] = [data[i][data_totalFlow]*1];
			}
			
			if(_newdateUTC in optdata){
				optdata[_newdateUTC].push(data[i]);
			}else{
				optdata[_newdateUTC] = [data[i]];
			}
			
			//tabledata[index] = data[i];
			index++;
		}
	}
	
	totle_flow_avg = Math.round(totle_flow_avg/index);
	
	
	var _unit = autoFlowUnit(totle_flow_avg);            //数据的单位
	var seriesOptions = [];
	var seriesOptions_area = [];
	var tt = 0;
	for(var i in chartdata){
		
/*		for(var k in chartdata[i]){
			chartdata[i][k][1] = Math.round(formateFlow_withouttype(chartdata[i][k][1],_unit)*1);
			//chartdata[i][k][1] = formateFlow(chartdata[i][k][1]);
			
			chartdata_area[i][k] = Math.round(formateFlow_withouttype(chartdata_area[i][k],_unit)*1);
			//chartdata_area[i][k] = formateFlow(chartdata_area[i][k]);
		}*/
		
		seriesOptions[tt] = {
			name: i,
			data: chartdata[i]
		};
		
		seriesOptions_area[tt] = {
			name: i,
			pointInterval: 5 * 60 * 1000,
            pointStart: data[1][data_time],
			data: chartdata_area[i]
		};
		tt++;
	}
	
	
	for(var i in optdata){
		for(var j=0;j<optdata[i].length;j++){
			optdata[i][j][data_time] = funConvertUTCToNormalDateTime(optdata[i][j][data_time]);
			optdata[i][j][data_totalFlow] = formateFlow(optdata[i][j][data_totalFlow]);
			optdata[i][j][data_outFlow] = formateFlow(optdata[i][j][data_outFlow]);
			optdata[i][j][data_inFlow] = formateFlow(optdata[i][j][data_inFlow]);
		}
	}

	tabledata = optdata[lastTime];
	
/*	for(var i=0; i<tabledata.length; i++){
		tabledata[i][data_totalFlow] = formateFlow(tabledata[i][data_totalFlow]);
		tabledata[i][data_outFlow] = formateFlow(tabledata[i][data_outFlow]);
		tabledata[i][data_inFlow] = formateFlow(tabledata[i][data_inFlow]);
	}
	*/
	
	arr = {
		optdata : optdata,
		chart : seriesOptions,
		chart1 : seriesOptions_area,
		dataunit : _unit,
		table : tabledata,
		totle_flow_avg : totle_flow_avg
	};
	
	return arr;
}


function MillisecondToDate(msd) {
		var hour = 0;
		var minute = 0;
		var second = 0;
		if (null!= msd &&""!= msd) {
				 hour = parseInt(msd /3600.0);
				 //console.log("hour:"+hour);
				 msd = msd - hour*60*60;
				 minute = parseInt(msd/60);
				// console.log("minute:"+minute);
				 second = msd - minute*60;
				 //console.log("second:"+second);
				 
				 msd = hour+","+minute+","+second;
		}else{
			msd = "00,00,00";	
		}
		//console.log(msd);
		return msd;
}

function autoFlowUnit(data){
	var count = 0;
	var _data = "";
	
	function _loop(data){
		if(data>1000){
			data = data/1000;
			count++;
			return _loop(data);
		}else{
			return data;	
		}
	}
	_loop(data)
	
	switch(count){
		case 0:
			_data = _data+"bps";
			break;
		case 1: 
			_data = _data+"Kbps";
			break;
		case 2: 
			_data = _data+"Mbps";
			break;
		case 3:
                        _data = _data+"Gbps";
                        break;
                case 4:
                        _data = _data+"Tbps";
                        break;
                case 5:
                        _data = _data+"Pbps";
                        break;
                case 6:
                        _data = _data+"Ebps";
                        break;
                case 7:
                        _data = _data+"Zbps";
                        break;
	}
	return _data;	
}


function formateFlow(data){
		var count = 0;
		var _data = 0;
		
		function _loop(data){
			if(data>1000){
				data = data/1000;
				count++;
				return _loop(data);
			}else{
				return data;	
			}
		}
		_data = _loop(data*1).toFixed(2);
	
		switch(count){
			case 0:
				 _data = Math.round(_data)+"bps";
				 break;
			case 1: 
				_data = _data+"Kbps";
				break;
			case 2: 
				_data = _data+"Mbps";
				break;
			case 3:
				_data = _data+"Gbps";
				break;
			case 4: 
				_data = _data+"Tbps";
				break;
			case 5: 
				_data = _data+"Pbps";
				break;
			case 6: 
				_data = _data+"Ebps";
				break;
			case 7: 
				_data = _data+"Zbps";
				break;
		}	
		return _data;	
		
}

function formateFlow_withouttype(data, _unit){
		var newdata = 0;
		
		switch(_unit){
			case 'Kbps':
				newdata = data/1000;
				newdata = Math.round(newdata*100)/100;
			break;
			case 'Mbps':
				newdata = data/1000/1000;
				newdata = Math.round(newdata*100)/100;
			break;
			case 'Gbps':
				newdata = data/1000/1000/1000;
				newdata = Math.round(newdata*100)/100;
			break;
			case 'Tbps':
				newdata = data/1000/1000/1000/1000;
				newdata = Math.round(newdata*100)/100;
			break;
			case 'Pbps':
				newdata = data/1000/1000/1000/1000/1000;
				newdata = Math.round(newdata*100)/100;
			break;
			case 'Ebps':
				newdata = data/1000/1000/1000/1000/1000/1000;
				newdata = Math.round(newdata*100)/100;
			break;
			case 'Zbps':
				newdata = data/1000/1000/1000/1000/1000/1000/1000;
				newdata = Math.round(newdata*100)/100;
			break;
			default:
			newdata = data;
			break;
		}
		
		return newdata;
}

function timeBlockToUTC(timeblock){
	var year = 0,      //一下用来算UTC时间
		mouth = 0,
		day = 0,
		time1 = 0,
		timechage = 300,
		time2 = "",
		timearr = [],
		hour = 0,
		minute = 0,
		second =0;
		
	year = timeblock.slice(0,4);
	month = timeblock.slice(4,6)-1;
	day = timeblock.slice(6,8);
	time1 = timeblock.slice(8)*1;
	msd = time1*timechage;
	time2 = MillisecondToDate(msd);
	timearr = time2.split(",");
	hour = timearr[0];
	minute = timearr[1];
	second = timearr[2];
	//console.log(year+"/"+month+"/"+day+" "+hour+":"+minute+":"+second);
	//console.log(Date.UTC(year,month,day,hour,minute,second));
	return Date.UTC(year,month,day,hour,minute,second);
}


function funConvertUTCToNormalDateTime(utc){
	var date = new Date(utc);
	var ndt;
	ndt = date.getUTCFullYear()+"/"+(date.getUTCMonth()+1)+"/"+date.getUTCDate()+" "+date.getUTCHours()+":"+date.getUTCMinutes()+":"+date.getUTCSeconds();
	return ndt;
}


function getArrayWithMatchStr(str,data){
	
	var newdata = new Array();		
	function over(data){
		for(var i = 0;i<data.length;i++){

			if(data[i].length>0&&typeof(data[i])!='string'){
				over(data[i]);				
				}else{
					
					var reg = new RegExp(str);
					var state = reg.exec(data[i]);
					if(state != null){
						newdata[newdata.length]=data[i];
						}			
					}
			}

	}
	over(data);		
	return newdata;
}


function isNull(str){
	return str == null || str.value == "";
}

/**
 * java String hashCode 的实现
 * @param strKey
 * @return intValue
 */
function hashCode(strKey)
{
	var hash = 0;
	if(!isNull(strKey))
	{
		for (var i = 0; i < strKey.length; i++)
		{
			hash = hash * 31 + strKey.charCodeAt(i);
			hash = intValue(hash);
		}
	}
	return hash;
}

/**
 * 将js页面的number类型转换为java的int类型
 * @param num
 * @return intValue
 */
function intValue(num)
{
	var MAX_VALUE = 0x7fffffff;
	var MIN_VALUE = -0x80000000;
	if(num > MAX_VALUE || num < MIN_VALUE)
	{
		return num &= 0xFFFFFFFF;
	}
	return num;
}

