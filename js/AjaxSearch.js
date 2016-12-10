/*
*	AjaxSearch.js - libreria per chiamate a pagine ajax
*/

AjaxSearch = Class.create();
AjaxSearch.prototype = {
	webServer:null,
	page:'',
	port:false,
	https: false,
	dom_id:'',

   initialize: function(webServer, login, cookie) {
   	  this.webServer = webServer;
      this.login = login;
      this.cookie = cookie;
	  if(window.location.protocol == 'https:')
	  {
		this.setHttps();
	  }
	},

	setHttps: function(){
		this.https = true;
	},

	addVarSend: function(in_search){

	  	var pars = $H(in_search);
		return pars.toQueryString();
	},


	// N.B. Se il Server è stato passato, per le chiamate ajax bisogna riferirsi alle
	// posizione relative a partire dall'indirizzo del server.
	// Viceversa se non viene passato per le chiamate ajax bisogna riferire il path a partire
	// dalla posizione corrente
	doRequest: function (in_search, relative_url, c_method, dom_id_object) {
	    this.dom_id = dom_id_object;

		var connectMethod = c_method.toLowerCase();
	  	if(connectMethod != 'get' && connectMethod != 'post' ){
	  		alert("Connect method: " + connectMethod + " - method not allowed") ;
	  	}

		var pars = 'login='+this.login+'&'+'cookie='+this.cookie+'&';

		pars = pars + this.addVarSend(in_search);

		var preString = "http";
		if(this.https == true){
			preString = "https";
		}

		// costruisco l'indirizzo destinazione
		if(this.webServer == null){
		  		this.addrBuild(relative_url);
				var url = preString + "://" + this.webServer;
				if(this.port > 0)
					url = url + ":" + this._port;
				url = url + "/" + this.page;
				this.webServer = null;
		}else{
			var url = preString + '://' + this.webServer + '/' + relative_url;
		}

// alert(url);

		var showResponse = this.showResponse.bind(this);
		var onLoadDefault = this.onLoadDefault.bind(this);
		var myAjax = new Ajax.Request( url,
											{ method: c_method,
											  parameters: pars,
											  onComplete: showResponse,
											  onLoading: onLoadDefault,
											  onFailure: function(){ alert('configuration error'); }
											}
							);

	},

	// costruisco this.webServer e this._page dal riferimento aPage
	// aPage e' un link alla pagina dello stesso webserver
	addrBuild: function(aPage){
		var questionC = '?';
		var slashC = '/';
		var twodotC = ':';
		var httpsStr = 'https';

		var urlDomain = document.domain;
		var urlPage = document.URL;

		var urlPath = urlPage.substr(urlPage.search(urlDomain) + urlDomain.length, urlPage.length - urlPage.search(urlDomain) - urlDomain.length);

		if(urlPage.search(httpsStr) != -1){
			this.https = true;
		}else{
			this.https = false;
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
	},

	showResponse: function (originalRequest) {
		var responseType=originalRequest.getResponseHeader("Content-Type");

		if (responseType=="text/xml"){
			var response=originalRequest.responseXML;
			window.location='../error/error.php?code='+ response.getElementsByTagName('cError')[0].childNodes[0].nodeValue+'&error=' + response.getElementsByTagName('dError')[0].childNodes[0].nodeValue;
		}else{
			var response=originalRequest.responseText;
			$(this.dom_id).innerHTML = response;
		}
	},

	onLoadDefault: function(){}
};
