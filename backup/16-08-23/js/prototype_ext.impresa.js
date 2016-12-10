/*
* Cattura gli inputs da un elemento e restituisce un array con chiave -> valore
* Inputs:
* ElementFrom: Elemento da cui prendere gli inputs. Es: un oggetto di una form.
*               Se non specificato di default prende document.body
* checked: (opzionale) Se true, cattura solo gli elementi validi. Esempio per gli input di type checkbox cattura solo quelli flaggati        
*/
getInputsFromElement = function(ElementFrom, checked){
    
    var checked = (arguments[1] || 0);
    
    var arr = {};
    var objFrom = document.body;
    if(arguments[0] && $(ElementFrom))
        objFrom = ElementFrom;
    
    var arrInputs = "";
    var key = "";
    var value = "";
    
    arrInputs = objFrom.getElementsByTagName("input");
    var lungh = arrInputs.length;
    for (i=0; i < lungh; i++ ) {
        if(checked && (arrInputs[i].type == "checkbox" || arrInputs[i].type == "radio" ) && arrInputs[i].checked == false )
            continue;
        key = arrInputs[i].name;
        value = arrInputs[i].value
        arr[key] = value;
	}

    arrInputs = objFrom.getElementsByTagName("textarea");
    var lungh = arrInputs.length;
    for (i=0; i < lungh; i++ ) {
        key = arrInputs[i].name;
        value = arrInputs[i].value
        arr[key] = value;
	}

    arrInputs = objFrom.getElementsByTagName("select");
    var lungh = arrInputs.length;
    for (i=0; i < lungh; i++ ) {
        key = arrInputs[i].name;
        value = arrInputs[i].options[arrInputs[i].selectedIndex].value
        arr[key] = value;
	}
    
    return arr;
}

// crea menu a tendina (es. trouble_ticket/ticket/button_bar). Richiede prototype.js
var OpenMenu = Class.create();
OpenMenu.prototype = {
  initialize: function(element_button, element_click, element_menu) {
	this.element_button = element_button;
	this.element_click = element_click;
	this.element_menu = element_menu;
  $$(this.element_button).each(function(div){
		var abuttonBar = div.down(element_click);
		var div_inbuttonBar = div.down(element_menu);
		if (div_inbuttonBar != undefined && abuttonBar != undefined) {
			div_inbuttonBar.hide();
			
			abuttonBar.observe('click', function(event) {
				var element = Event.element(event);
				div_menu = element.next(element_menu);
				div_menu.show();
			});

			abuttonBar.observe('mouseout', function(event) {
				var element = Event.element(event);
				div_menu = element.next(element_menu);
				div_menu.hide();
			});

      div_inbuttonBar.observe('mouseout', function() {
				div_inbuttonBar = div.down(element_menu);
				div_inbuttonBar.hide();
			});

      div_inbuttonBar.observe('mouseover', function() {
				div_inbuttonBar = div.down(element_menu);
				div_inbuttonBar.show();
			});
		}
	});
	}
};