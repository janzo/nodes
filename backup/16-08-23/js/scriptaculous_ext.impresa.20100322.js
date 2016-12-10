// JavaScript Document

var Accordion = Class.create();

Accordion.prototype = {
	initialize: function(id, tag, name, in_index) {
		this.id = id;
		this.headerTag = tag.toUpperCase();
		this.instance = name;
		this.headingClassName = (arguments[4] || "panel");
		this.contentClassName = (arguments[5] || "panelBody");
    this.in_index = (arguments[3] || 0);
    this.panels = new Array();

		var tags = $(id).getElementsByTagName('*');
    //alert	(tags.length);
		for ( var i = 0; i < tags.length; i++) {
			switch(tags.item(i).tagName) {
				case this.headerTag:
					tags.item(i).style.cursor = "pointer";
					tags.item(i).onclick = this._returnEvalCode(this.instance);
					break;

				default:
					if (tags.item(i).className == this.headingClassName) {
						tags[i]._index = this._returnIndex(this.panels.length);
						this.panels[this.panels.length] = tags.item(i);
						//the line above is same meaning as "this.panels.push(tags.item(i));"
						
						if (this.panels.length == 1) {
							tags.item(i).id = "visible";
						}
					}

					if (tags.item(i).className == this.contentClassName) {
						tags.item(i).style.display = "none";
					}
					break;

			}
		}
		this.length = this.panels.length;
		this.show(this.in_index, true);
	},

	show: function(index, force) {
		if ( (index >= this.length) || (index < 0) ) {
			//alert("index out of range");
			return;
		}

		if ( $('visible') == this.panels[index] ){
			if (force) {
				//alert("force to show the visible element.");
				for(var i = 0; i < this.length; i++) {
					if(this._body(this.panels[i]).style.display != "none") {
						new Effect.SlideUp(this._body(this.panels[i]));
					}
				}
				new Effect.SlideDown(this._body(this.panels[index]));
				return;
			}
			
			//alert("it's already shown now.");
			return;
		}

		//alert("show another element.");
		new Effect.Parallel(
			[
				new Effect.SlideUp( this._body($('visible')) ),
				new Effect.SlideDown( this._body(this.panels[index]) )
			], {
				duration: 0.2
			}
		);
	
		$('visible').id = "";
		this.panels[index].id = "visible";
		return;
	},

	_body: function(e) {
		var tags = e.getElementsByTagName('*');
		for( var i=0; i<tags.length; i++) {
			if (tags.item(i).className == this.contentClassName) {
				return tags.item(i);
			}
		}
	},

	_returnIndex: function(i) {
		return function() {
			return i;
		}
	},

	_returnEvalCode: function(s) {
		return function(){
			eval(s + ".show(" + this.parentNode._index() + ");");
		}
	}
};

/*
*	Windows - classe per creare una window
*	Richiede la libreria prototype e scriptaculous
*/

// opzioni:
// zIndex: valore z-index espresso con un intero. Default = 1;
// width, height: risp. altezza e larghezza del espressi con un intero;
// black_screen: attiva lo sfondo semitrasparente. Boolean (true o false);

var Windows = Class.create();

Windows.prototype = {

	div_black_screen:null,
	z_index:1,
	div_window:null,
	div_window_width_onCreate:0,
	div_window_height_onCreate:0,
	div_window_width:0,
	div_window_height:0,

	initialize: function(div_window_id, opzioni) {
		
		if (opzioni != undefined && opzioni != null && opzioni != "") {

			//zIndex
			if (this.array_key_exists("zIndex", opzioni) !== false && !isNaN(opzioni["zIndex"]) && opzioni["zIndex"] != this.z_index ) {
				this.z_index = opzioni["zIndex"];
			}

			if (this.array_key_exists("width", opzioni) !== false && !isNaN(opzioni["width"]) && opzioni["width"] != this.div_window_width ) {
				this.div_window_width = opzioni["width"];
				//this.div_window_width_onCreate = opzioni["width"];
			}

			if (this.array_key_exists("height", opzioni) !== false && !isNaN(opzioni["height"]) && opzioni["height"] != this.div_window_height ) {
				this.div_window_height = opzioni["height"];
				//this.div_window_height_onCreate = opzioni["height"];
			}

			// black screen
			if (this.array_key_exists("black_screen", opzioni) !== false && opzioni["black_screen"] == true ) {
				this.div_black_screen = document.createElement("div");
				this.div_black_screen.id = "black_screen";
				document.body.appendChild(this.div_black_screen);
				var opacita = 5;
				this.div_black_screen.style.opacity = opacita/10;
				this.div_black_screen.style.filter = 'alpha(opacity=' + opacita*10 + ')';
				this.div_black_screen.style.display = "none";
				this.div_black_screen.style.position = "fixed";
				this.div_black_screen.style.width = "100%";
				this.div_black_screen.style.height = "100%";
				this.div_black_screen.style.margin = "0px";
				this.div_black_screen.style.padding = "0px";
				this.div_black_screen.style.top = "0px";
				this.div_black_screen.style.left = "0px";
				this.div_black_screen.style.zIndex = this.z_index;
				this.div_black_screen.style.backgroundColor = "#000000";
			}			
		}

		this.div_window = document.createElement("div");
		this.div_window.id = div_window_id;
		document.body.appendChild(this.div_window);
		this.div_window.style.display = "none";
		this.div_window.style.width = this.div_window_width + "px";
		this.div_window.style.height = this.div_window_height + "px";
		this.div_window.style.zIndex = this.z_index+1;
		this.div_window.style.position = "absolute";
		this.div_window.style.top = "50%";
		this.div_window.style.left = "50%";
		this.div_window.style.marginTop = "-"+ this.div_window_height/2 + "px";
		this.div_window.style.marginLeft = "-"+ this.div_window_width/2 + "px";
    
    //Necessario per IE5-IE6
    //document.createElement("iframe");
    	
		if (this.array_key_exists("class", opzioni) !== false && opzioni["class"].length > 0 ) {
			this.div_window.className = opzioni["class"];
			//this.div_window_height_onCreate = opzioni["height"];
		} else {
  		this.div_window.style.background = "#FFFFFF";
  		this.div_window.style.border = "#FF0000 solid 4px";    
    }
		this.div_window.style.padding = "4px";
		this.div_window.style.overflow = "auto";
	},
	
	array_key_exists: function(key, array_search) {
		if( !array_search || (array_search.constructor !== Array && array_search.constructor !== Object) ){
			return false;
		}

		return key in array_search;	
	},

	upContent: function(content) {
		this.div_window.innerHTML = content;
	},

	Show: function() {
		if(this.div_black_screen != null){
			this.div_black_screen.style.display = "block";
		}
		this.div_window.style.display = "block";
	},

	Hide: function() {
		if(this.div_black_screen != null){
			this.div_black_screen.style.display = "none";
		}
		this.div_window.style.display = "none";
	},

	Close: function() {
		this.Hide();
		this.upContent("");
		this.div_window.style.overflow = "auto";
		this.div_window.style.width = this.div_window_width + "px";
		this.div_window.style.height = this.div_window_height + "px";
		this.div_window.style.marginTop = "-"+ this.div_window_height/2 + "px";
		this.div_window.style.marginLeft = "-"+ this.div_window_width/2 + "px";
	},

	Clear: function() {
        this.div_window.innerHTML = "";
	},

	// Funzione utilizzata per effettuare il morphing del div in oggetto.
	// Richiede scriptaculous
	Morphing: function(funzione, option) {

		this._funzione = funzione;

		var larg = (option["width"]);
		var alt = option["height"];
		var dur = option["duration"];

        // temporaneamente lo imposto a hidden
        this.div_window.style.overflow = "hidden";

		var afFin = this.afFin.bind(this);
		new Effect.Morph(this.div_window, { 
		  style: 'width: '+ larg + 'px; height: ' + alt + 'px; margin-left: -'+larg/2+'px; margin-top: -'+alt/2+'px;',
		  duration: dur,
		  afterFinish: afFin
		});
	},
	
	getBrowserHeight: function (){
    if (window.innerHeight)
      return window.innerHeight;
    else
      if (document.documentElement && document.documentElement.clientHeight!=0)
        return document.documentElement.clientHeight;
      else
        if (document.body)
          return document.body.clientHeight;
    return 0;
	},
	
	afFin: function() {
		this.div_window.style.overflow = "auto";
		this._funzione();
	}
	
};

//classe che estende Ajax.Autocompleter per modificare il difetto del tasto TAB
Ajax.Autocompleter_ext = Class.create( Ajax.Autocompleter, {

  baseInitialize: function(element, update, options) {
    element          = $(element)
    this.element     = element; 
    this.update      = $(update);  
    this.hasFocus    = false; 
    this.changed     = false; 
    this.active      = false;
    this.onDiv       = false; 
    this.index       = 0;     
    this.entryCount  = 0;
    this.oldElementValue = this.element.value;

    if(this.setOptions)
      this.setOptions(options);
    else
      this.options = options || { };

    this.options.paramName    = this.options.paramName || this.element.name;
    this.options.tokens       = this.options.tokens || [];
    this.options.frequency    = this.options.frequency || 0.4;
    this.options.minChars     = this.options.minChars || 1;
    this.options.onShow       = this.options.onShow || 
      function(element, update){ 
        if(!update.style.position || update.style.position=='absolute') {
          update.style.position = 'absolute';
          Position.clone(element, update, {
            setHeight: false, 
            offsetTop: element.offsetHeight
          });
        }
        Effect.Appear(update,{duration:0.15});
      };
    this.options.onHide = this.options.onHide || 
      function(element, update){ new Effect.Fade(update,{duration:0.15}) };

    if(typeof(this.options.tokens) == 'string') 
      this.options.tokens = new Array(this.options.tokens);
    // Force carriage returns as token delimiters anyway
    if (!this.options.tokens.include('\n'))
      this.options.tokens.push('\n');

    this.observer = null;
    
    this.element.setAttribute('autocomplete','off');

    Element.hide(this.update);
    
    //modifica applicata per gestire il diverso comportamento dell'evento blur
    //alla pressione del tasto TAB con browser diversi
    if ( Prototype.Browser.Gecko ) {
      Event.observe(this.element, 'blur', this.onBlur.bindAsEventListener(this));
    }
    else {
      Event.observe(this.update, 'mouseover', this.setOnDiv.bindAsEventListener(this));
      Event.observe(this.element, 'blur', this.onBlur_iefix.bindAsEventListener(this));
      Event.observe(this.update, 'mouseout', this.unsetOnDiv.bindAsEventListener(this));
      Event.observe(this.update, 'blur', this.onBlur_iefix.bindAsEventListener(this));
    }
    Event.observe(this.element, 'keydown', this.onKeyPress.bindAsEventListener(this));
  },
  
  onKeyPress: function( event) {
    if(this.active)
      switch(event.keyCode) {  
       case Event.KEY_RETURN:
         this.selectEntry();
         Event.stop(event);
         this.hide();
         this.active = false;
         return;
       case Event.KEY_TAB:
         this.nextFocus();
       case Event.KEY_ESC:
         this.hide();
         this.active = false;
         Event.stop(event);
         return;
       case Event.KEY_LEFT:
       case Event.KEY_RIGHT:
         return;
       case Event.KEY_UP:
         this.markPrevious();
         this.render();
         Event.stop(event);
         return;
       case Event.KEY_DOWN:
         this.markNext();
         this.render();
         Event.stop(event);
         return;
      }
     else 
       if(event.keyCode==Event.KEY_TAB || event.keyCode==Event.KEY_RETURN || 
         (Prototype.Browser.WebKit > 0 && event.keyCode == 0)) return;

    this.changed = true;
    this.hasFocus = true;

    if(this.observer) clearTimeout(this.observer);
      this.observer = 
        setTimeout(this.onObserverEvent.bind(this), this.options.frequency*1000);
  },
  
  //trova la form contenente il campo nel quale attivare l'autocomplete
  findForm: function() {
    for ( var i=0; i < document.forms.length; i++ ) {
      for ( var j=0; j < document.forms[i].length; j++) {
        if ( this.element.name == document.forms[i].elements[j].name ) {
          return document.forms[i];
        }
      }
    }
  },
  
  //sposta il focus sull'elemento successivo della form
  nextFocus: function() {
    var form = this.findForm();
    for ( var i=0; i < form.length; i++) {
      if (this.element.name == form.elements[i].name){
        if( !window.opera ) {
          form.elements[++i].focus();
        }
        return;
      }     
    }
  },
  
  setOnDiv: function() {
    this.onDiv = true;
  },

  unsetOnDiv: function() {
    this.onDiv = false;
  },
  
  onBlur_iefix: function(event) {
    
    if (this.onDiv) {
      this.element.focus();
    } else {
      setTimeout(this.hide.bind(this), 250);
      this.active = false;
      this.hasFocus = false;
    }
  }

});

//funzione per l'inserimento dell'autocompletamento di alcuni campi
//campi definiti x le search: ragione_sociale, comune
//campi definiti x le insert: comune, comune_sede_amministrativa

function autocomplete() {

  var url = document.URL;

  var comune = null;
  if( document.getElementsByName("comune") ) { 
    comune = document.getElementsByName("comune")[0]; 
  }

  var comune_sede_amministrativa = null;
  if(document.getElementsByName("comune_sede_amministrativa")[0]){ comune_sede_amministrativa = document.getElementsByName("comune_sede_amministrativa")[0]; }

  var ragione_sociale = null;
  if(document.getElementsByName("ragione_sociale")[0]){ ragione_sociale = document.getElementsByName("ragione_sociale")[0]; }

  var url_page = url;
  if(url.indexOf("?") != -1)
    url_page = url.substring(0, url.indexOf("?"));

  //document.write(url_page);

  //  autocomplete nelle pagine di search
  if ( url_page.indexOf("search") > 0 ) { 
    
    if ( comune ) {      
      div_suggerimenti = createDivAutocomplete(comune);     
      new Ajax.Autocompleter_ext(comune, div_suggerimenti, "../comuni/autocomplete_search_action.php", {minChars: 2});
    }
    
    if ( ragione_sociale ) {      
      div_suggerimenti = createDivAutocomplete(ragione_sociale);
      new Ajax.Autocompleter_ext( ragione_sociale, div_suggerimenti, "../clienti/autocomplete_search_action.php", {minChars: 2});
    }
  }
  
  //autocomplete nelle pagine di insert
  if ( url_page.indexOf("insert") > 0 ) {
    
    if ( comune ) {
      div_suggerimenti = createDivAutocomplete(comune);  
      new Ajax.Autocompleter_ext(comune, div_suggerimenti, "../comuni/autocomplete_search_action.php", {minChars: 2, afterUpdateElement: getDatiSedeLegale});
    }
    
    if ( comune_sede_amministrativa ) {
      div_suggerimenti = createDivAutocomplete(comune_sede_amministrativa);     
      new Ajax.Autocompleter_ext(comune_sede_amministrativa, div_suggerimenti, "../comuni/autocomplete_search_action.php", {minChars: 1, afterUpdateElement: getDatiSedeAmministrativa});
    }
  }
}

//popola i campi cap e provincia della sede legale in una insert
function getDatiSedeLegale (text,li) {
  var info = li.id.split("%");
  if( document.getElementsByName("cap")[0].length < 5 || ( document.getElementsByName("cap")[0].value.length = 5 && (document.getElementsByName("cap")[0].value.substr(0,3)!= info[1].substr(0,3) ) ) )
    document.getElementsByName("cap")[0].value  = info[1];
  document.getElementsByName("provincia")[0].value = info[2];
}

//popola i campi cap e provincia della sede amministrativa in una insert
function getDatiSedeAmministrativa (text,li) {
  var info = li.id.split("%");
  if( document.getElementsByName("cap_sede_amministrativa")[0].value.length < 5 || ( document.getElementsByName("cap_sede_amministrativa")[0].value.length = 5 && (document.getElementsByName("cap_sede_amministrativa")[0].value.substr(0,3)!= info[1].substr(0,3) ) ) )
    document.getElementsByName("cap_sede_amministrativa")[0].value  = info[1];
  document.getElementsByName("provincia_sede_amministrativa")[0].value = info[2];
}

//crea il div necessario per l'autocomplete
//il parametro input è l'oggetto di tipo input nel quale vogliamo inserire l'autocomplete
function createDivAutocomplete (input) {
//   tmpImg = document.createElement("img");
//   tmpImg.src = "../img/ajax-loader.gif";
//   tmpImg.style.position = "relative";
//   tmpImg.style.marginLeft = "-17px";
//   tmpImg.id = "tmpLoading";
//   input.parentNode.appendChild(tmpImg);
  div_suggerimenti = document.createElement("div");
  div_suggerimenti.className = "box_autocomplete";
  input.parentNode.appendChild(div_suggerimenti);
  return div_suggerimenti;
}