var debug = 0;
var xmlhttp = false;
var webServer = false;
var connectMethod = false;
var page = false;
var _varSend = false;
var _responseType = false;

function Ajax(wServer, cMethod, dPage, rType){

  this.webServer = wServer;
  this.connectMethod = cMethod;
  this.page = dPage;
  this._varSend = "";
  this._responseType = rType;
  
  if(this.connectMethod != "GET" && this.connectMethod != "POST" ){
  	alert("Connect method: " + this.connectMethod + " - method not allowed") ;
  	return false;
  }
  
  // branch for native XMLHttpRequest object
  if(window.XMLHttpRequest) {
	try {
		this.xmlhttp = new XMLHttpRequest();
	} catch(e) {
		this.xmlhttp = false;
	}
  // branch for IE/Windows ActiveX version
  } else if(window.ActiveXObject) {
	try {
		this.xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
	} catch(e) {
		try {
	  		this.xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		} catch(e) {
	  		this.xmlhttp = false;
		}
	}
  }else{
	alert("This browser not support AJAX");
	return false;
  }

  return this;
  
}

Ajax.prototype.Connect=function(){
  
  if(!this.xmlhttp){
  	alert("Ajax init error");
  	return false;
  }


  switch(this.connectMethod){
  	case 'POST' :	
  	          this.xmlhttp.open(this.connectMethod, "http://" + this.webServer + "/" + this.page, true);
		  // serve per il passaggio delle variabili	
		  this.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		  break;
  	case 'GET' :	
		  this.xmlhttp.open(this.connectMethod, "http://" + this.webServer + "/" + this.page + "?" + this.varSend, true);
		  // serve per il passaggio delle variabili	
		  this.xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
		  break;
	default:
		return false;
  }

  return this.xmlhttp;
}

Ajax.prototype.send=function(){
  switch(this.connectMethod){
  	case 'POST' :	
		  this.xmlhttp.send(this._varSend);	
		  break;
  	case 'GET' :	
		  this.xmlhttp.send();	
		  break;
	default:
		return false;
  }
}

Ajax.prototype.AddVarSend=function(vName, vValue){
  if(this._varSend.lenght == 0){
	this._varSend = vName + "=" + vValue + "&";	
  }else{
	this._varSend = this._varSend + vName + "=" + vValue + "&";	
  }
}


function getVarSend(){
  return this._varSend;
}

function getResponseType(){
  return this._responseType;
}

function SetDebug(dValue){
  this.debug=dValue;
}

function aDebug(){
  alert("webServer: " + this.webServer + "\ncMethod: " + this.connectMethod + "\nPage: " + this.page + "\nVar: " + this.varSend);
  
  return true;
}

Ajax.prototype.aDebug = aDebug;
Ajax.prototype.SetDebug = SetDebug;
Ajax.prototype.getVarSend = getVarSend;
Ajax.prototype.getResponseType = getResponseType;

//function MathConvertUnitKilometersMilesC() {
// //
// // --- Method Pointers: public methods --- //
// //
// // this.<your public function> = <your private nested function>
// //
// this.FNMathGetConversionUnitMilesToKilometerD = FN_MathGetConversionUnitMilesToKilometerD;
// this.FNMathGetConversionUnitKilometerToMilesD = FN_MathGetConversionUnitKilometerToMilesD;
// //
// // --- Methods: Private: do something --- //
// //
// function FN_MathGetConversionUnitMilesToKilometerD( milesD ) {
//  return( 1.609 * milesD );
// }
// //
// function FN_MathGetConversionUnitKilometerToMilesD( kilometersD ) {
//  return( kilometersD / 1.609 );
// }
//}