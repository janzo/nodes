/*
TABS
Oggetto per la creazione dei tab con chiamata ajax

Richiede la libreria prototype.js e inserire la seguente parte di codice javascript. Esempio:
window.onload = function()
{
 	var tabs = new Array();
    tabs.push(new Array("Angelo", {page: "pippo.php", params: {testo: "cane"}, reload:true, onComplete: function}));
 	var my_Tabs = new Tabs("containerTabs", tabs, {radius: 0, onStart: 1});
}


Variabili da passare all'oggetto sono:
    ElementTabsContainer: id in cui inserire l'intera struttura tabs
    arrayTab: array con titolo da visualizzare nel tab, altro array contenente la pagina da chiamare, i parametri da passare.
            altre opzioni sono:
              reload: true o false che indica se ricaricare il tab sul click
              onComplete: ulteriore funzione da eseguire sul click del tab. 
    option: altre possibili opzioni, ovvero:
    radius: da sistemare
    onStart: numero ordinario del tab da aprire. (Inizio da 1)
  
  Vedere l'esempio.

N.B. Ogni tab deve avere almeno il testo da visualizzare e la pagina da chiamare

Possibile utilizzo dei css come nel seguente caso:

	.tabmenu span {
		background: url(../img/tab_hidden.png) repeat-x bottom;
		background-color:#999999;
		border: 1px solid #ACA899;
		padding: 4px;
		font: bold 10px Verdana, sans-serif;
	}	
	
	.tabmenu span:hover {
		background: url(../img/tab_active.png) repeat-x bottom;
		background-color:#FF0000;
	}
	
	.tabmenu span.active:hover,
	.tabmenu span.active {
		background: url(../img/tab_active.png) repeat-x bottom;
		background-color:#FFFFFF;
		color:#000000;
	}

    .tabmenu span.disabled:hover,
    .tabmenu span.disabled {
    	background: none;
    	background-color:#DDDDDD;
    	color:#8e8e8e;
    }
	
	.ContentTabs {
		background-color:#FFFFFF;
		border: 1px solid #ACA899;
		padding: 2px;
	}
	
	Importante per il corretto funzionamento! Non specificare nel caso di span active font o parametri differenti dallo span normale.

*/

Tabs = Class.create();
Tabs.prototype = {
        
    version: "0.1",

	initialize: function(ElementTabsContainer, arrayTab, option) {
    	
        this.tabs = new Array(); //array degli oggetti tabs, ovvero i bottoni
    	this.tabs_option = new Array(); //array per le opzioni di ogni tab
    	this.tabs_width = new Array(); // array contenente la larghezza iniziale di ogni tab
    	this.tabs_label = new Array(); //array che associa un index ad un label
    	this.tabs_loading_img = new Array(); //array degli oggetti img con funzione di loading
    	this.Container = null; // contenitore generale
    	this.openedTabs = new Array(); // array indicante quali tabs sono stati aperti
    	this.lastIndex = null; //indice dell'ultimo elemento aperto
    	this.TabsContentContainer = null; //elemento contenente tutti i contenuti dei tab
    	this.tabContent = new Array(); //array dei contenuti dei tab
        this.tabContentIFrame = new Array(); //array degli iFrame contenuti nei tabContent
    	this.buttonsContainer = null; //elemento contenente i bottoni (utilizzato come contenitore temporaneo)
    	this.tabmenu = new Array();
    	this.tabs_in_menu = new Array();
    	this.radius = 0;
    	this.paddingL = null;
    	this.paddingB = null;
    	this.border = null;
    	this.height = null;
    	this.container_width = null;
    	this.ajax_complete = new Array();
        this.name = new Array();
        
		if(document.getElementById(arguments[0]) == undefined || document.getElementById(arguments[0]) == null){
			alert("Errore in input. Contenitore Tabs mancante");
			return;
		}		

		this.Container = $(ElementTabsContainer);

		if(arguments[1] == undefined || arguments[1] == "" || arguments[1].lenght == 0){
			alert("Errore in input. Array mancante o vuoto");
			return;
		}
		
		if(arguments[2] == undefined || arguments[2] == "" || typeof arguments[2] !== 'object')
            option = new Array();
		
		if(option["radius"]) {
			this.radius = option["radius"];
		}
		
		this.TabsContentContainer = document.createElement("div");
		this.Container.appendChild(this.TabsContentContainer);
		this.TabsContentContainer.className = "ContentTabs";
		this.TabsContentContainer.style.position = "relative";
		//this.TabsContentContainer.style.border = "1px solid #000000";
		this.TabsContentContainer.style.overflow = "auto";
		
//         var a = document.createElement("a");
// 		a.name = "to_container";
// 		this.TabsContentContainer.appendChild(a);		

		//Creo un div temporaneo in cui appendere i tab
		this.buttonsContainer = document.createElement("div");
		this.Container.appendChild(this.buttonsContainer);
		this.buttonsContainer.className = "tabmenu";
		this.buttonsContainer.style.position = "absolute";
		this.buttonsContainer.style.overflow = "auto";

        //this.tabs_label = new Array();
        
//         alert(arrayTab.length);

		for (var i = 0; i < arrayTab.length; i++) {
			
			if(arrayTab[i][1]) {
				this.tabs_option[i] = new Array();
				
				if(arrayTab[i][1]["page"] && arrayTab[i][1]["page"].length > 0){
					this.tabs_option[i]["page"] = arrayTab[i][1]["page"];
				}
				this.tabs_option[i]["params"] = null;
				if(arrayTab[i][1]["params"]){
					this.tabs_option[i]["params"] = arrayTab[i][1]["params"];
				}
				if(arrayTab[i][1]["reload"]){
					this.tabs_option[i]["reload"] = true;
				}
				if(arrayTab[i][1]["disabled"]){
					this.tabs_option[i]["disabled"] = true;
				}
				if(arrayTab[i][1]["label"]){
					this.tabs_option[i]["label"] = arrayTab[i][1]["label"];
				}
				if(arrayTab[i][1]["loading"]){
					this.tabs_option[i]["loading"] = true;
				}
				if(arrayTab[i][1]["onComplete"]){
					this.tabs_option[i]["onComplete"] = arrayTab[i][1]["onComplete"];
				}
				if(arrayTab[i][1]["json"]){
					this.tabs_option[i]["json"] = arrayTab[i][1]["json"];
				}
				if(arrayTab[i][1]["link"]){
					this.tabs_option[i]["link"] = arrayTab[i][1]["link"];
				}
			}
			
			this.tabs[i] = document.createElement("span");
			
			//regole css
			this.tabs[i].style.cursor = "pointer";
			this.tabs[i].style.position = "relative";
			this.tabs[i].style.whiteSpace = "nowrap";
			
			this.tabs[i].innerHTML = arrayTab[i][0];

            this.tabs_loading_img[i] = document.createElement("div");
            this.tabs_loading_img[i].style.position = "absolute";
			this.tabs_loading_img[i].style.top = "1px";
			this.tabs_loading_img[i].style.left = "1px";
			this.tabs_loading_img[i].style.display = "none";
            if(this.tabs_option[i]["loading"])
                this.tabs_loading_img[i].style.display = "";
			this.tabs[i].appendChild(this.tabs_loading_img[i]);

			var tmpImg = document.createElement("img");
			tmpImg.src = "../img/ajax-loader-background.png";
			tmpImg.style.position = "absolute";
			tmpImg.style.top = "0px";
			tmpImg.style.left = "0px";
			var opacity = 8;
			tmpImg.style.opacity = opacity/10;
			tmpImg.style.filter = "alpha(opacity = " + opacity*10 + ")";
            this.tabs_loading_img[i].appendChild(tmpImg);

			tmpImg = document.createElement("img");
			tmpImg.src = "../img/ajax-loader.gif";
			tmpImg.style.position = "absolute";
			tmpImg.style.top = "1px";
			tmpImg.style.left = "1px";
            this.tabs_loading_img[i].appendChild(tmpImg);

			//this.tabs[i].id = "tab_"+i;
			this.buttonsContainer.appendChild(this.tabs[i]);
			this.tabs_width[i] = $(this.tabs[i]).getWidth();
			
			if(i==0){
				if(Prototype.Browser.IE){
					this.paddingB = parseInt($(this.tabs[i]).getStyle("padding-bottom").split("px")[0]);
					this.paddingL = parseInt($(this.tabs[i]).getStyle("padding-left").split("px")[0]);
					this.border = Math.floor($(this.tabs[i]).getStyle("border-left-width").split("px")[0]);
				} else {
					this.paddingB = parseInt(this.tabs[i].getStyle("padding-bottom").split("px")[0]);
					this.paddingL = parseInt(this.tabs[i].getStyle("padding-left").split("px")[0]);
					this.border = Math.floor(this.tabs[i].getStyle("border-left-width").split("px")[0]);
				}
				this.height = this.tabs[i].getHeight();
				this.buttonsContainer.paddingLeft = this.paddingL + "px";
				//alert(this.tabs[i].getHeight());
			}
			this.tabs[i].style.top = (this.paddingB + this.border)+"px";
			this.tabs[i].style.paddingBottom = ( this.paddingB + this.radius)+"px" ;
			this.tabs[i].style.marginLeft = "-" + this.border + "px"; 
			
			this.tabContent[i] = document.createElement("div");
			this.tabContent[i].style.display = "none";
			this.TabsContentContainer.appendChild(this.tabContent[i]);
            
            this.tabContentIFrame[i] = document.createElement("iframe");
            this.tabContentIFrame[i].width="100%";
            this.tabContentIFrame[i].frameBorder = "0";
            this.tabContent[i].appendChild(this.tabContentIFrame[i]);
			
            Event.observe(this.tabs[i], 'click', this._load.bindAsEventListener(this, i));

            if(this.tabs_option[i]["disabled"]){
                this.tabs[i].className = "disabled";
                this.tabs[i].style.cursor = "default";
            }
            
            if(this.tabs_option[i]["label"] && this.tabs_option[i]["label"].length > 0 && !this.tabs_label[this.tabs_option[i]["label"]]){
                this.tabs_label[this.tabs_option[i]["label"]] = i;
            }
            
		}
		
		this.container_width = this.Container.getWidth();
		this.positioningTab(arrayTab.length);

		if(option["onStart"])
		{
            var li = 0;
			if(typeof(option["onStart"]) == 'string')
                li = this.label2index(option["onStart"]);
			else
				li = option["onStart"]-1;
			this._load(null, li);
		}
		
		Event.observe(window, 'resize', this.resizeTabs.bindAsEventListener(this));
	},
		
	_load: function(event, obj_index, noComplete){
//         alert(this.name);
//         return true;
		
        if (obj_index != this.lastIndex && !this.tabs_option[obj_index]["disabled"]){
			noC = (arguments[2] || 0);
			
			if(!this.openedTabs[obj_index] || (this.tabs_option[obj_index] && this.tabs_option[obj_index]["reload"] && noC==0)) { //Se non Ë stato ancora aperto
				if(this.tabs_option[obj_index] && this.tabs_option[obj_index]["page"] && this.tabs_option[obj_index]["page"].length > 0) {
					
                    if(this.tabs_option[obj_index]["link"]){
                        var link = this.tabs_option[obj_index]["page"];
						if(this.tabs_option[obj_index]["params"]){
							link = link+"?"+($H(this.tabs_option[obj_index]["params"]).toQueryString());
						}
						this.tabContentIFrame[obj_index].src = link;
                    }else{
                        var loading = this.ajaxLoading.bind(this, obj_index);
    					var complete = this.ajaxComplete.bind(this, obj_index);
                        var success = this.ajaxSuccess.bind(this, obj_index);
                        this.ajax_complete[obj_index] = false;
    					new Ajax.Updater(this.tabContent[obj_index], this.tabs_option[obj_index]["page"], {parameters: this.tabs_option[obj_index]["params"], onSuccess: success, onComplete: complete, onLoading: loading, evalScripts:true});
                    }
				} else {
					this.tabContent[obj_index].innerHTML = "Errore in input. Valori di page e params mancanti.";
				}
			}
			this.tabContent[obj_index].style.display = "block";
			this.tabs[obj_index].className = "active";
			this.tabs[obj_index].style.cursor = "default";
			
			this.openedTabs[obj_index] = true;

			if (this.lastIndex != null) {
				this.tabContent[this.lastIndex].style.display = "none";
				this.tabs[this.lastIndex].className = "";
				this.tabs[this.lastIndex].style.cursor = "pointer";
			}

			var row = null;
			if ((this.lastIndex != null && this.tabs[obj_index].parentNode != this.tabs[this.lastIndex].parentNode) || (this.lastIndex == null && this.parentIndex(obj_index) != 0)) {
				var tmp = new Array();
				row = this.parentIndex(obj_index);
				
				for (var i = 0; i < this.tabs_in_menu[row]["indexes"].length; i++) {
					this.tabmenu[row].removeChild(this.tabs[this.tabs_in_menu[row]["indexes"][i]]);
					this.tabmenu[0].appendChild(this.tabs[this.tabs_in_menu[row]["indexes"][i]]);
				}
				for (var j = 0; j < this.tabs_in_menu[0]["indexes"].length; j++) {
					this.tabmenu[0].removeChild(this.tabs[this.tabs_in_menu[0]["indexes"][j]]);
					this.tabmenu[row].appendChild(this.tabs[this.tabs_in_menu[0]["indexes"][j]]);
				}
				tmp = this.tabs_in_menu[0];
				this.tabs_in_menu[0] = this.tabs_in_menu[row];
				this.tabs_in_menu[row] = tmp;
			}
			
			this.lastIndex = obj_index;
			this.resizeTabs();
			
//       if (!Prototype.Browser.IE)
// 			 location.href = "#to_container";
		}
	},
	
    reloadTab: function(tab, params){

        var obj_index = this.lastIndex;
        if(arguments[0]){
            if(typeof(tab) == 'string'){
                obj_index = this.label2index(tab);
            } else {
                if(!isNaN(tab))
                    obj_index = parseInt(tab-1);
                else
                    obj_index = -1;
            }
        }

        if(obj_index >= 0){
            if(obj_index == this.lastIndex){
                this.lastIndex = null;
            }
            this.openedTabs[obj_index] = false;

            if(arguments[1] != undefined && typeof arguments[1] === 'object'){
                Object.extend(this.tabs_option[obj_index]["params"],params);
    		}
            this._load(null, obj_index);
        }
    },

    // Abilita un tab.
    // Riceve l'indice a partire da 1 o anche un label, se definito
    enableTab: function(tab){//alert(index);
        
        if(!arguments[0])
            alert("Error in enableTab function: no input.");
        
        var obj_index = -1;
        if(typeof(tab) == 'string')
            obj_index = this.label2index(tab);
        else 
            obj_index = parseInt(tab-1);

        if(obj_index >= 0 && this.tabs_option[obj_index] && this.tabs_option[obj_index]["disabled"]){
            this.tabs_option[obj_index]["disabled"] = false;
			this.tabs[obj_index].className = "";
			this.tabs[obj_index].style.cursor = "pointer";            
        }
    },

//     disableTab: function(index){//alert(index);
//         var obj_index = parseInt(index-1);
//         if(obj_index > 0 && this.tabs_option[obj_index] && this.tabs_option[obj_index]["disabled"]){
//             this.tabs_option[obj_index]["disabled"] = false;
// 			this.tabs[obj_index].className = "";
// 			this.tabs[obj_index].style.cursor = "pointer";            
//         }
//     },

    label2index: function(label){
        if(this.tabs_label[label]>=0)
            return this.tabs_label[label];
        return -1;
    },
	
	positioningTab: function (tabs_number) {

        var maxWidth = this.container_width;
		
		//Calcolo in quante righe si collocano i tab
		var row = this.createTabMenu();
		var tmp_width = 0;
		for (var i = 0; i < this.tabs.length; i++) {
			tmp_width = tmp_width + this.tabs_width[i];
			
			if (tmp_width > maxWidth && i != 0) {
				
				row = this.createTabMenu();
				tmp_width = this.tabs_width[i];
				/*if (tmp_width >= maxWidth){
					tmp_width = 0;
					if (i != tabs_number-1) {
						// aggiungo una riga solo se non sono all'ultimo elemento.
						row = this.createTabMenu();
					}
				}*/
			}
			
			if(!this.tabs_in_menu[row]) {
				this.tabs_in_menu[row] = new Array(); 
				this.tabs_in_menu[row]["indexes"] = new Array();
				this.tabs_in_menu[row]["totWidth"] = new Array();
			}
			this.tabs_in_menu[row]["indexes"].push(i);
			this.tabs_in_menu[row]["totWidth"] = tmp_width;
			//alert(tmp_width);
			
			// Posiziono i tab nelle rispettive righe
			this.buttonsContainer.removeChild(this.tabs[i]);		
			this.tabmenu[row].appendChild(this.tabs[i]);
		}
		this.buttonsContainer.style.display = "";

		for(var zIn = j = this.tabmenu.length; j > 0; j--) {
			this.tabmenu[j-1].style.top = "-"+(this.border * (zIn - j))+"px";
		}

		this.TabsContentContainer.style.top = "-"+(this.border *(zIn))+"px";
		
		if (row > 0) this.normalizeTabs(row);
		
	},
	
	createTabMenu: function(){
		//creo i div contenitori dove collocare i tab
		var index = this.tabmenu.length;
//         alert(this.tabmenu);
		this.tabmenu[index] = document.createElement("div");
		this.tabmenu[index].style.height = this.height + "px";
		this.tabmenu[index].className = "tabmenu";
		this.tabmenu[index].style.paddingLeft = this.border + "px";
		this.tabmenu[index].style.position = "relative";
		this.Container.insert({top: this.tabmenu[index]});
		return index;
	},
	
	normalizeTabs: function(rows){
		
		var maxWidth = this.container_width;
		var spazio_rimanente = 0;
		var pad = padl = padr = 0;
		
		for(var i = 0; i < rows+1; i++) {
			var span = null;
			
			spazio_rimanente = maxWidth - this.tabs_in_menu[i]["totWidth"];
			
			if (this.tabs_in_menu[i]["indexes"].length > 1) {
				spazio_rimanente = spazio_rimanente + (this.border*(this.tabs_in_menu[i]["indexes"].length-1))
			}
			pad = Math.floor(spazio_rimanente/this.tabs_in_menu[i]["indexes"].length);
			
			for (var j = 0; j < this.tabs_in_menu[i]["indexes"].length; j++){
				
				if (j == (this.tabs_in_menu[i]["indexes"].length - 1) && j != 0) {
					pad = spazio_rimanente;
				}
				
				if (j == 0 || j == this.tabs_in_menu[i]["indexes"].length - 1) {
					if (pad%2 == 0) { //numero pari
						padl = padr = pad/2;
					} else {
						padl = Math.floor(pad/2);
						padr = padl + 1;
					}
				}

				spazio_rimanente = spazio_rimanente - pad;
				this.tabs[this.tabs_in_menu[i]["indexes"][j]].style.paddingLeft = (this.paddingL + padl) + "px";
				this.tabs[this.tabs_in_menu[i]["indexes"][j]].style.paddingRight = (this.paddingL + padr) + "px";

			}
		}

	},
	
	resizeTabs: function(event){
		
		var	tmp_body_width = this.Container.getWidth();
		
		if (tmp_body_width != this.container_width) {

			this.container_width = tmp_body_width;
			
			for(var i = 0; i < this.tabs_in_menu.length; i++) {
				for (var j = 0; j < this.tabs_in_menu[i]["indexes"].length; j++){
					this.tabmenu[i].removeChild(this.tabs[this.tabs_in_menu[i]["indexes"][j]]);
					this.buttonsContainer.appendChild(this.tabs[this.tabs_in_menu[i]["indexes"][j]]);
				}
				this.Container.removeChild(this.tabmenu[i]);
				//this.tabmenu[i].remove();
			}
			this.tabmenu = new Array();
			this.tabs_in_menu = new Array();
			this.buttonsContainer.style.display = "block";
			this.positioningTab();
			if(this.tabs_in_menu.length == 1)
				this.resetTabs();
			var li = this.lastIndex;
			this.lastIndex = null;
			this._load(null, li, 1);
		}
	},
	
	resetTabs: function(){
		for(var i = 0; i < this.tabs.length; i++){
			this.tabs[i].style.paddingLeft = this.paddingL + "px";
			this.tabs[i].style.paddingRight = this.paddingL + "px";
		}
	},
	
	parentIndex: function(index) {
		for(var i = 0; i < this.tabs_in_menu.length; i++) {
			for (var j = 0; j < this.tabs_in_menu[i]["indexes"].length; j++){
				if(this.tabs_in_menu[i]["indexes"][j] == index)
					return i;
			}
		}
		return false;
	},

	ajaxSuccess: function(index, transport){

//         if (!Prototype.Browser.IE)
//             this.resizeTabs();
        
//         this.ajax_complete[index] = true;
//         this.hideLoading(index+1);


	},
	
	ajaxComplete: function(index, transport){

        if (!Prototype.Browser.IE)
            this.resizeTabs();
        
        this.ajax_complete[index] = true;
        this.hideLoading(index+1);
        if(this.tabs_option[index] && this.tabs_option[index]["onComplete"]){
            if(transport && transport.responseJSON)
                this.tabs_option[index]["onComplete"](transport.responseJSON, this.tabContent[index]);            
            else
                this.tabs_option[index]["onComplete"]();
        }

	},

    //Mostra l'immagine dell loading
    //tab label o index+1
    showLoading: function(tab){//alert(index);
        
        var obj_index = -1;
        if(typeof(tab) == 'string')
            obj_index = this.label2index(tab);
        else 
            obj_index = parseInt(tab-1);

        if(obj_index > 0)
            this.tabs_loading_img[obj_index].style.display = "";
    },

    //Nasconde l'immagine dell loading
    //tab label o index+1
    hideLoading: function(tab){//alert(index);
        
        var obj_index = -1;
        if(typeof(tab) == 'string')
            obj_index = this.label2index(tab);
        else 
            obj_index = parseInt(tab-1);

        if(obj_index > 0)
            this.tabs_loading_img[obj_index].style.display = "none";
    },
	
    ajaxLoading: function(index){
    if(!this.ajax_complete[index]) {
        this.showLoading(index+1);
        this.tabContent[index].innerHTML = "<strong>Caricamento ...</strong>";
    }
}
	
};
