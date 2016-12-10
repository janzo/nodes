var debug = 0;
var xmlhttp = false;
var webServer = false;
var connectMethod = false;
var webPort = false;
var _varSend = false;
var _responseType = false;
var _https = false;
var _port = false;

function AjaxPrototype(wServer, cMethod, dPage, rFunction, lFunction){

  this.webServer = wServer;
  this.connectMethod = cMethod.toLowerCase();
  this.page = dPage;
  this._varSend = "";
  this.idTimeout = 0;
  this.status = 0;
  
  this._responseFunction = rFunction;
  this._loadingFunction = lFunction;
  
  if(this.connectMethod != 'get' && this.connectMethod != 'post' ){
  	alert("Connect method: " + this.connectMethod + " - method not allowed") ;
  	return false;
  }

  return this;
}

AjaxPrototype.prototype.SetHttps=function(){
	this._https = true;
}

AjaxPrototype.prototype.SetPort=function(dPort){
	if(dPort)
		this._port = dPort;
}

// effettua la richiesta ajax
AjaxPrototype.prototype.request=function(inList){
	var preString = "http";  
	if(this._https == true){
		preString = "https";
	}

  if(inList && inList.length){
    // aggiungo gli elementi di una lista con name, value in send
    for(i=0; i < inList.length; i++){
      if(inList[i].name){
        var sendV = ""; // no value
        if(inList[i].value){
          sendV = inList[i].value
        }
        this.AddVarSend(inList[i].name, sendV);
      }
    }
  }

	// costruisco l'indirizzo destinazione
	var dAddress = preString + "://" + this.webServer
	if(this._port > 0)
		dAddress = dAddress + ":" + this._port;
	dAddress = dAddress + "/" + this.page;

  var onCompleteAjax = this.onCompleteAjax.bind(this);
  var onLoadingAjax = this.onLoadingAjax.bind(this);

  this.status = 0;
	this.xmlhttp = new Ajax.Request(
				dAddress,
				{	method: this.connectMethod
					, parameters: this._varSend
					, onComplete: onCompleteAjax
					, onLoading: onLoadingAjax
					, onFailure: function(){ alert('configuration error'); }
		 		});
		 		
		 		//alert(preString + "://" + this.webServer + "/" + this.page);
}

AjaxPrototype.prototype.onCompleteAjax = function(risposta){
  this.status = 1;
  this._responseFunction(risposta);
}

AjaxPrototype.prototype.onLoadingAjax = function(){
  if (this.status == 0 && this._loadingFunction != null) {
    this._loadingFunction();
  }
}

// costruisco this.webServer e this._page dal riferimento aPage
// aPage e' un link alla pagina dello stesso webserver
AjaxPrototype.prototype.ajaxAddrBuild=function(aPage){
	var questionC = '?';
	var slashC = '/';
	var twodotC = ':';
	var httpsStr = 'https';
	
	var urlDomain = document.domain;
	var urlPage = document.URL;
	// alert(urlPage);	
	var urlPath = urlPage.substr(urlPage.search(urlDomain) + urlDomain.length, urlPage.length - urlPage.search(urlDomain) - urlDomain.length);
	
	if(urlPage.search(httpsStr) != -1){
		this._https = true;
	}else{
		this._https = false;
	}

	if(urlPath.indexOf(questionC) > 0){
		// elimino i parametri in GET
		urlPath = urlPath.substr(0, urlPath.indexOf(questionC) - 1);
	}

	var portDomain = false;
	if(urlPath.indexOf(twodotC) == 0){
		// estropolo la porta
		if(urlPath.indexOf(slashC) > 0){
			portDomain = urlPath.substr(1, urlPath.indexOf(slashC) - 1);
			urlPath = urlPath.substr(urlPath.indexOf(slashC), urlPath.length - urlPath.indexOf(slashC));	
		}else{
			portDomain = urlPath.substr(1, urlPath.length - 1);
			urlPath = "";	
		}
	}		

	if(portDomain)
		urlDomain = urlDomain + ":" + portDomain;

	if(urlPath.indexOf(slashC) == 0)		
		urlPath = urlPath.substr(1, urlPath.length - 1);

	// inizializzo la pagina di ritorno a quella sorgente
	this.webServer = urlDomain;
	var retPath = '';
	if(aPage){
		if(aPage.indexOf(slashC) == 0){
			// il path comincia con slash quindi prendo dalla root
			retPath = aPage;	
		}else{
			tokenD = Array();
			if(aPage.indexOf(slashC) > 0){
				tokenD = aPage.split(slashC);
			}else{
				tokenD = Array(aPage);
			}

			tokenS = Array();
			if(urlPath.indexOf(slashC) > 0){
				tokenS = urlPath.split(slashC);
			}else{
				tokenS = Array(urlPath);
			}
			
			dTocken = Array();
			dIndex = 0;
			lTokenS = tokenS.length - 1; // elimino l'ultimo token che e' la pagina sorgente
			for(i=0; i < tokenD.length; i++){
				if(tokenD[i] == '..' ){
					if(lTokenS > 0)
						lTokenS--;	

				}else if(tokenD[i] != '.'){
					dTocken[dIndex++] = tokenD[i];
				}
			}
			
			// costruisco il path di ritorno
			for(i=0; i < lTokenS; i++){
				retPath = retPath + slashC + tokenS[i];
			}

			for(i=0; i < dTocken.length ; i++){
				retPath = retPath + slashC + dTocken[i];
			}
			
		}
	}
	this.page = retPath.substr(1, retPath.length -1);
}

// aggiunge variabili da inviare al server
AjaxPrototype.prototype.AddVarSend=function(vName, vValue){
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
  alert("webServer: " + this.webServer + "\nhttps: " + this._https + "\ncMethod: " + this.connectMethod + "\nPage: " + this.page + "\nVar: " + this._varSend);
  
  return true;
}

AjaxPrototype.prototype.aDebug = aDebug;
AjaxPrototype.prototype.SetDebug = SetDebug;
AjaxPrototype.prototype.getVarSend = getVarSend;
AjaxPrototype.prototype.getResponseType = getResponseType;
