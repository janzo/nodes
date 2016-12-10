/*
*	showAlert.js - libreria per la visualizzazione degli alert
*	Richiede la libreria prototype
*/

showAlert = Class.create();
showAlert.prototype = {
	div_alert_container:null,
	div_alert_container_width:0,

  /* costruttore oggetto
    
    L'oggetto deve essere creato sull'onload della pagina web.
  
    alert_container_id: id del div contenitore
    options: array contente le opzioni
  */
  initialize: function(alert_container_id, options) {
    this.div_alert_container = document.createElement("div");
    this.div_alert_container.id = alert_container_id;
    document.body.appendChild(this.div_alert_container);
    this.div_alert_container.style.visibility = "visible";
    this.div_alert_container.style.width = this.div_alert_container_width + "px";
    this.div_alert_container.style.zIndex = 9;
    this.div_alert_container.style.position = "fixed";
    this.div_alert_container.style.bottom = 0;
    this.div_alert_container.style.left = 0;
    if (options != undefined && options != null && options != "") {
      //da gestire
    }
	},
	
	/* Aggiunge un alert
      
      div_id: id dell'alert
      width_div: larghezza
      content: contenuto da visualizzare nell'alert
      class_div: eventuale class dell'alert
      name_object: nome dell'oggetto di tipo showAlert creato. Se non è valorizzato on_close, può essere nullo
      on_click: eventuale funzione da eseguire sull'onclick dell'alert
      on_close: eventuale funzione da eseguire sull'onclose dell'alert. Se nullo viene eseguito closeAlert.
  */
	addAlert: function(div_id, width_div, content, class_div, name_object, on_click, on_close) {
    
    // controllo che non manchino contemporaneamente il nome dell'oggetto e la funzione da eseguire sul pulsante chiudi.
    if ((name_object == undefined || name_object == null || name_object == "") && (on_close == undefined || on_close == null || on_close == "")  ) {
      alert ("Missing arguments in showAlert object");
      return false;
    }
    var onclose_txt = (arguments[6] || name_object+".closeAlert('"+div_id+"')");
    onclose_txt = onclose_txt.replace(/\"/g,"'");

    div_alert = document.createElement("div");
    div_alert.id = div_id;
    this.div_alert_container.appendChild(div_alert);
    if (width_div > this.div_alert_container_width) {
      this.div_alert_container_width = width_div;
      this.div_alert_container.style.width = width_div + "px";
    }
    div_alert.style.zIndex = 10;
    var backgroundColor = "#FF0000";
    div_alert.style.border = "1px solid #FFFFFF";
    div_alert.style.background = backgroundColor;
    div_alert.className = (arguments[3] || "");
    div_alert.innerHTML = '<table width="100%" height="9" valign="center" cellspacing="1" cellpadding="1" style="border:1px solid '+ backgroundColor +'; background-color:white; color:red; font-size: 8px; font-weight: bold;"><tr><td>&nbsp;</td><td width="10"><a title="chiudi" style="cursor:pointer;" onclick="javascript:'+ onclose_txt +';" ><img src="../img/ico-chiudi.gif" alt="[chiudi]" border="0" /></a></td></tr></table>';

    // condizione in cui ho una funzione sull'evento onclick. in tal caso il cursore sul div è pointer
    var onclick_text = "";
    var cursor = false;
    if (on_click == undefined || on_click == null || on_click == "") {      
    } else {
      onclick_text = on_click;
      onclick_text = onclick_text.replace(/'/g,"\"");
      onclick_text = "onclick='javascript:"+onclick_text+"'" ;
      cursor = true;
    }

    div_alert.innerHTML += '<div id="'+div_id+'_interno" '+ onclick_text+ '><table height="30" valign="center" cellspacing="0" cellpadding="1" style="color:white;font-size : 12px; font-weight: bold;" ><tr><td valign="middle">'+ content +'</td></tr></table></div>';
    div_interno = $(div_id+"_interno");
    div_interno.style.paddingLeft = "3px";
    if (cursor) {
      div_interno.style.cursor = "pointer";
    }
    //div_alert.innerHTML += '<div style="clear:both;"></div>';
  },

  /* chiude un alert
      div_id: id dell'alert
  */  
  closeAlert: function(div_id) {
    this.div_alert_container.removeChild($(div_id));
  }
};