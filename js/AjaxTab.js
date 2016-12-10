var tabSelezionato = "";
var divAperto = "";
var loadstatustext = "<img src='../img/loading.gif' /> Caricamento...";

AjaxTab = Class.create();
AjaxTab.prototype = {
	objAjaxSearch: '',
	idTab: '',
	metodo: '',
	inSearch: '',
	relativeUrl: '',
	divDestinazione: '',
	giaCaricata: 0,
	 
	initialize: function(idTab, objAjaxSearch, metodo, inSearch, relativeUrl, divDestinazione) {
		this.idTab = idTab;
   		inSearch["tab"] = divDestinazione;

		this.divDestinazione = divDestinazione;
		if(objAjaxSearch == null) {
			tabSelezionato = this.idTab;
			divAperto = this.divDestinazione;
			this.giaCaricata = 1;
   		}
   		else {
   			this.objAjaxSearch = objAjaxSearch;
   			this.metodo = metodo;
   			this.inSearch = inSearch;
			this.relativeUrl = relativeUrl;
   		}
	},

	overTab: function(){
		if(tabSelezionato == this.idTab) {
			document.getElementById(tabSelezionato).style.cursor = "default";
		}
		else {
			document.getElementById(this.idTab).style.cursor = "pointer";
			document.getElementById(this.idTab).className = "tab_over";
		}
	},
	
	outTab: function(){
		if(tabSelezionato == this.idTab) {}
		else {
			document.getElementById(this.idTab).className = "tab_nascosto";
		}
	},
		
	load: function(){
		if(tabSelezionato == this.idTab) {}
		else {
			if(!this.giaCaricata) {
	      		if(document.getElementById(divAperto)){
	      			document.getElementById(divAperto).style.display = "none";
	      		}	

				divAperto = this.divDestinazione;
	    		this.loadstatus();
	    		if(document.getElementById(tabSelezionato)){
	    			document.getElementById(tabSelezionato).className = "tab_nascosto";
	    		}
	    		this.objAjaxSearch.doRequest(this.inSearch, this.relativeUrl, this.metodo, this.divDestinazione);
	    		tabSelezionato = this.idTab;
	    		document.getElementById(tabSelezionato).className = "tab_attivo";
	    		this.giaCaricata = 1;
	    	}
			else {
		  		document.getElementById(divAperto).style.display = "none";
		  		divAperto = this.divDestinazione;
		  		document.getElementById(tabSelezionato).className = "tab_nascosto";
		  		tabSelezionato = this.idTab;
	    		document.getElementById(tabSelezionato).className = "tab_attivo";
		  		document.getElementById(divAperto).style.display = "inline";
			}
	  }
	},
	
	loadFunction: function(funzione){	
		if(tabSelezionato == this.idTab) {}
		else {
			if(!this.giaCaricata) {
	      		document.getElementById(divAperto).style.display = "none";
				divAperto = this.divDestinazione;
	    		this.loadstatus();
	    		document.getElementById(tabSelezionato).className = "tab_nascosto";
	    		funzione;
	    		tabSelezionato = this.idTab;
	    		document.getElementById(tabSelezionato).className = "tab_attivo";
	    		this.giaCaricata = 1;
	    	}
			else {
		  		document.getElementById(divAperto).style.display = "none";
		  		divAperto = this.divDestinazione;
		  		document.getElementById(tabSelezionato).className = "tab_nascosto";
		  		tabSelezionato = this.idTab;
	    		document.getElementById(tabSelezionato).className = "tab_attivo";
		  		document.getElementById(divAperto).style.display = "inline";
			}
	  	}
	},

	reload: function(in_search){
		this.objAjaxSearch.doRequest(in_search, this.relativeUrl, this.metodo, this.divDestinazione);
	},
	
	loadstatus: function(){
	  document.getElementById(divAperto).innerHTML = loadstatustext;
	}
	
};
