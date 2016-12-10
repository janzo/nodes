// <--

String.prototype.trim = function() {
    return (this.ltrim()).rtrim();
}

String.prototype.ltrim = function () {
    chars = "\\s";
    return this.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

String.prototype.rtrim = function () {
    chars = "\\s";
    return this.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

/*
	Controllo dell'indirizzo email
	
	Scarica dalla rete. Versione aggiornata che controlla in maniera corretta l'indirizzo
	email evidenziando incongruenze anche se il dominio in input � di tipo numerico
*/
// -->

function emailCheck (emailStr) {

  	/* 	
	The following variable tells the rest of the function whether or not
	to verify that the address ends in a two-letter country or well-known
	TLD.  1 means check it, 0 means don't. */

	var checkTLD=1;

  	/* 
  	The following is the list of known TLDs that an e-mail address must end with. */

	var knownDomsPat=/^(com|net|org|edu|int|mil|gov|arpa|biz|aero|name|coop|info|pro|museum|biz)$/;

  	/* 
  	The following pattern is used to check if the entered e-mail address
	fits the user@domain format.  It also is used to separate the username
	from the domain. */

	var emailPat=/^(.+)@(.+)$/;

  	/* 
  	The following string represents the pattern for matching all special
	characters.  We don't want to allow special characters in the address. 
	These characters include ( ) < > @ , ; : \ " . [ ] */

	var specialChars="\\(\\)><@,;:\\\\\\\"\\.\\[\\]";

  	/* 
  	The following string represents the range of characters allowed in a 
	username or domainname.  It really states which chars aren't allowed.*/

	var validChars="\[^\\s" + specialChars + "\]";

  	/* 
  	The following pattern applies if the "user" is a quoted string (in
	which case, there are no rules about which characters are allowed
	and which aren't; anything goes).  E.g. "jiminy cricket"@disney.com
	is a legal e-mail address. */

	var quotedUser="(\"[^\"]*\")";

  	/* 
  	The following pattern applies for domains that are IP addresses,
	rather than symbolic names.  E.g. joe@[123.124.233.4] is a legal
	e-mail address. NOTE: The square brackets are required. */

	var ipDomainPat=/^\[(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})\]$/;

  	/* 
  	The following string represents an atom (basically a series of non-special characters.) */

	var atom=validChars + '+';

  	/* 
  	The following string represents one word in the typical username.
	For example, in john.doe@somewhere.com, john and doe are words.
	Basically, a word is either an atom or quoted string. */

	var word="(" + atom + "|" + quotedUser + ")";

	// The following pattern describes the structure of the user

	var userPat=new RegExp("^" + word + "(\\." + word + ")*$");

  	/* 
  	The following pattern describes the structure of a normal symbolic
	domain, as opposed to ipDomainPat, shown above. */

	var domainPat=new RegExp("^" + atom + "(\\." + atom +")*$");

  	/* 
  	Finally, let's start trying to figure out if the supplied address is valid. */

  	/* 
  	Begin with the coarse pattern to simply break up user@domain into
	different pieces that are easy to analyze. */

	var matchArray=emailStr.match(emailPat);

	if (matchArray==null) {

		/* 
	  	Too many/few @'s or something; basically, this address doesn't
		even fit the general mould of a valid e-mail address. */

		alert("Email address seems incorrect (check @ and .'s)");
		return false;
	}
	
	var user=matchArray[1];
	var domain=matchArray[2];

	// Start by checking that only basic ASCII characters are in the strings (0-127).
	for (i=0; i<user.length; i++) {
		if (user.charCodeAt(i)>127) {
			alert("This username contains invalid characters.");
			return false;
   		}
	}
	
	for (i=0; i<domain.length; i++) {
		if (domain.charCodeAt(i)>127) {
			alert("Ths domain name contains invalid characters.");
			return false;
   		}
	}

	// See if "user" is valid 

	if (user.match(userPat)==null) {

		// user is not valid

		alert("The username doesn't seem to be valid.");
		return false;
	}

  	/* 
  	if the e-mail address is at an IP address (as opposed to a symbolic
	host name) make sure the IP address is valid. */

	var IPArray=domain.match(ipDomainPat);
	if (IPArray!=null) {

		// this is an IP address

		for (var i=1;i<=4;i++) {
			if (IPArray[i]>255) {
				alert("Destination IP address is invalid!");
				return false;
   			}
		}
	
		return true;
	}

	// Domain is symbolic name.  Check if it's valid.
 
	var atomPat=new RegExp("^" + atom + "$");
	var domArr=domain.split(".");
	var len=domArr.length;
	for (i=0;i<len;i++) {
		if (domArr[i].search(atomPat)==-1) {
			alert("The domain name does not seem to be valid.");
			return false;
   		}
	}

  	/* 
  	domain name seems valid, but now make sure that it ends in a
	known top-level domain (like com, edu, gov) or a two-letter word,
	representing country (uk, nl), and that there's a hostname preceding 
	the domain or country. */

	if (checkTLD && domArr[domArr.length-1].length!=2 && domArr[domArr.length-1].search(knownDomsPat)==-1) {
		alert("The address must end in a well-known domain or two letter " + "country.");
		return false;
	}

	// Make sure there's a host name preceding the domain.

	if (len<2) {
		alert("This address is missing a hostname!");
		return false;
	}

	// If we've gotten this far, everything's valid!
	return true;
}

/*
	Controllo della partita iva
	
	Utilizza la funzione ControllaPIVA() per controllare la correttezza del
	codice in input
*/

function check_PI_it(piva){
	var result=ControllaPIVA(piva);
	
	if (result>0){
		return true;
	}else{
		if(result == -1){
			alert(	"La lunghezza della partita IVA non e`\n" +
				"corretta: la partita IVA dovrebbe essere lunga\n" +
				"esattamente 11 caratteri.\n");
			return false;	
		}

		if(result == -2){
			alert(	"La partita IVA contiene un carattere non valido `" +
				"'.\nI caratteri validi sono le cifre.\n");
			return false;	
		}

		if(result == -3){
			alert(	"La partita IVA non e` valida:\n" +
				"il codice di controllo non corrisponde.\n");
			return false;	
		}
	}

}

function ControllaPIVA(pi)
{
	if( pi == '' )  return '';
	if( pi.length != 11 )
		return (-1);
	validi = "0123456789";
	for( i = 0; i < 11; i++ ){
		if( validi.indexOf( pi.charAt(i) ) == -1 )
			return (-2);
	}
	s = 0;
	for( i = 0; i <= 9; i += 2 )
		s += pi.charCodeAt(i) - '0'.charCodeAt(0);
	for( i = 1; i <= 9; i += 2 ){
		c = 2*( pi.charCodeAt(i) - '0'.charCodeAt(0) );
		if( c > 9 )  c = c - 9;
		s += c;
	}
	if( ( 10 - s%10 )%10 != pi.charCodeAt(10) - '0'.charCodeAt(0) )
		return (-3);
	return (1);
}

/*
	Controllo del codice fiscale
	
	Utilizza la funzione codiceFISCALE() per controllare la correttezza del
	codice in input
*/

function check_CF_it(cfins){
	var result = codiceFISCALE(cfins);
	if (result == false){
		alert("Il codice fiscale inserito non e` corretto!!!\nriprova.");
		return false;	
	}
	return true;
}

function codiceFISCALE(cfins) {
	var cf = cfins.toUpperCase();    
	var cfReg = /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/;
	if (!cfReg.test(cf))       
		return false;    

	var set1 = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	var set2 = "ABCDEFGHIJABCDEFGHIJKLMNOPQRSTUVWXYZ";    
	var setpari = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";    
	var setdisp = "BAKPLCQDREVOSFTGUHMINJWZYX";    
	var s = 0;    

	for( i = 1; i <= 13; i += 2 )       
		s += setpari.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));    

	for( i = 0; i <= 14; i += 2 )       
		s += setdisp.indexOf( set2.charAt( set1.indexOf( cf.charAt(i) )));    

	if ( s%26 != cf.charCodeAt(15)-'A'.charCodeAt(0) )       
		return false;    
	return true;    
} 

function verifyIP_old(IPvalue) {
	errorString = "";
	theName = "IPaddress";
	
	var ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
	var ipArray = IPvalue.match(ipPattern); 
	
	
	if (IPvalue == "0.0.0.0")
		errorString = errorString + theName + ': '+IPvalue+' is a special IP address and cannot be used here.';
	else if (IPvalue == "255.255.255.255")
		errorString = errorString + theName + ': '+IPvalue+' is a special IP address and cannot be used here.';
	if (ipArray == null)
		errorString = errorString + theName + ': '+IPvalue+' is not a valid IP address.';
	else {
		for (i = 1; i < 5; i++) {
			thisSegment = ipArray[i];
			// alert(thisSegment);
			if (thisSegment > 255) {
				errorString = errorString + theName + ': '+IPvalue+' is not a valid IP address.';
				i = 4;
			}
			if ((i == 0) && (thisSegment > 255)) {
				errorString = errorString + theName + ': '+IPvalue+' is a special IP address and cannot be used here.';
				i = 4;
			}
		}
	}
	extensionLength = 3;

	if (errorString == ""){
		// alert ("That is a valid IP address.");
		return true;
	}else{
		
		return false;
	}
}

function verifyIPv4(IPvalue)
{

	var ipPattern = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/;
	var ipArray = IPvalue.match(ipPattern);
	
	if(IPvalue == "0.0.0.0" || IPvalue == "255.255.255.255")
		return false;
	
	if(ipArray == false || ipArray == null)
		return false;
	else {
		for (i = 0; i < 4; i++)
		{
			thisSegment =  parseInt(ipArray[i]);
			if (thisSegment > 255)
				return false;
			if ((i == 0) && (thisSegment < 1))
				return false;
		}
	}

	return true;
}

function verifyIPv6(IPvalue)
{
	return (/^\s*((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?\s*$/.test(IPvalue));

	// var ipPattern = /^([0-9a-f]{1-4})\:([0-9a-f\:][0-9a-f\:]*)$/;
	//var ipPattern = /^([0-9a-f\:]*)$/;
	//var ipArray = IPvalue.toLowerCase().match(ipPattern);
	//	
	//if(ipArray == false || ipArray == null)
	//	return false;
	//
	//return true;
}


function checkIPv(IPvalue) {
	if(verifyIPv4(IPvalue)){
		return 'ipv4';
	}
	
	if(verifyIPv6(IPvalue))
	{
		return 'ipv6';
	}

	return false;
}

function IPv_cidrMax(IPvalue){
	var ipv = checkIPv(IPvalue);

	var max = 32;
	if(ipv == 'ipv6'){
		max = 128;
	}
	
	return max;	
}

function IPv_cidrList(IPvalue){
	var ipv = checkIPv(IPvalue);
	var ret_List = [];
	
	if(ipv == false)
		return ret_List;
	
	var max = 32;
	var min = 8;
	if(ipv == 'ipv6'){
		max = 128;
		min = 64;
	}
	
	for( i = max; i > min; i--){
		ret_List.push(i);
	}

	return ret_List;
}


function verifyIP(IPvalue){
	if(verifyIPv4(IPvalue)){
		return true;
	}
	
	if(verifyIPv6(IPvalue))
	{
		return true;
	}
	
	return false;
}

// Controlla il tipo di browser in uso
function browser_detection(){
	if(navigator.appName == "Netscape"){
		return "NET";	
	}else{
		return "IE";
	}	
}

// rimuove il parametro di readonly da un oggetto javascript del tipo document.form.input
function unsetRO(input){
  if(!input){
    return;
  }

	if(browser_detection() == "IE"){
		input.readOnly = false;
	}else{
		input.removeAttribute('readonly');
	}
}

// imposta il parametro di readonly da un oggetto javascript del tipo document.form.input
function setRO(input){
  if(!input){
    return;
  }

	if(browser_detection() == "IE"){
		input.readOnly = true;
	}else{
		input.setAttribute('readonly','true');
	}
}


// controlla la validita' di una data
function checkDate(dd, mm, yyyy) {
	var re_0 =/^[0]*/;

	var monthLength = new Array(31,28,31,30,31,30,31,31,30,31,30,31);
	var day = parseInt(dd.value.replace(re_0, ""));
	var month = parseInt(mm.value.replace(re_0, ""));
	var year = parseInt(yyyy.value);

	if (!day || !month || !year)
		return false;

	if (month < 0 || month > 12)
		return false;

	if (year/4 == parseInt(year/4))
		monthLength[1] = 29;

	if (day > monthLength[month-1])
		return false;

	monthLength[1] = 28;

	var now = new Date();
	now = now.getTime(); //NN3

	var dateToCheck = new Date();
	dateToCheck.setYear(year);
	dateToCheck.setMonth(month-1);
	dateToCheck.setDate(day);
	var checkDate = dateToCheck.getTime();

	return true;
}


function checkDate_IT(stringa)
{
	var espressione = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
	if (!espressione.test(stringa))
	{
	    return false;
	}else{
		anno = parseInt(stringa.substr(6),10);
		mese = parseInt(stringa.substr(3, 2),10);
		giorno = parseInt(stringa.substr(0, 2),10);
		
        //return checkDate(giorno, mese, anno);
		var data=new Date(anno, mese-1, giorno);
		if(data.getFullYear()==anno && data.getMonth()+1==mese && data.getDate()==giorno){
			return true;
		}else{
			return false;
		}        
	}
}

/* Controlla se il giorno e' festivo
 * Restituisce valore negativo se non e' una data valida
 * 0 se non e' festivo, 1 se e' festivo
*/
function checkFestivityDay(dd, mm, yyyy)
{
	if( !checkDate(dd, mm, yyyy) )
		return -1;
  
	var re_0 =/^[0]*/;
  
	var day = parseInt(dd.value.replace(re_0, ""));
	var month = parseInt(mm.value.replace(re_0, ""));
	var year = parseInt(yyyy.value);
	
	var dateToCheck = new Date(year,(month-1),day);
	
	//alert(dateToCheck.getMonth());
	if( dateToCheck.getDay() == 6 || dateToCheck.getDay() == 0 )
		return 1;
	
	return 0;
}

// apre una finestra popup
function openPopup(page, inWidth, inHeight){
	var sWidth = inWidth;
	var sHeight = inHeight;

	if(page == 'undefined')
		return;
		
	if(!sWidth){
		sWidth = screen.width * (80/100);	
	}

	if(!sHeight){
		sHeight = screen.height * (60/100);	
	}

    var popurl=page;
	var parHTML="height="+(sHeight)+",width="+(sWidth)+",status,scrollbars,resizable=1,";
	window.open(popurl,"",parHTML);
}

// ----------------------------
// Gestione Liste Select -- START

var	pList0 = '--------------';

// Svuota una lista 
function svuotaLista(lista, emptyL){

	if(emptyL){
		pList0 = emptyL;
	}
	
	with (lista){
		var counter=length-1;
		while(counter >= 0){
			options[counter] = null;
			counter--;
		}
		
		options[length]=new Option(pList0, 0);
	}
}

function selectAllItemLista(idLista){

	with (document.getElementById(idLista)){
		var counter=length-1;
		while(counter > 0){
			options[counter].selected = true;
			counter--;
		}
	}
}

function spostaItemsLista(inS, outS){
	with (document.getElementById(inS)){
		for(i=length - 1;i > 0; i--){
			if(options[i].selected == true){
				addLista(outS, options[i].text, options[i].value);
				delLista(inS, i);
			}
		}	
	}
}

function buildEmptyList(numChar){
	if(!numChar){
		numChar=20;	
	}
	pList0 = "";

	for(i=0;i<numChar;i++){
		pList0 = pList0 + '-';	
	}	
}

function writeEmptyList(){
	document.write(pList0);	
}

function getEmptyList(){
	return (pList0);	
}

function addLista(idLista, textS, valueS){
		with (document.getElementById(idLista)){
			options[length]=new Option(textS, valueS);						
		}
	
}

function delLista(idLista, indexS){
		with (document.getElementById(idLista)){
			options[indexS]=null;
		}
}

// Gestione Liste Select -- END
// ----------------------------

// -- Toogle Effects
var saveHeight = new Object();
var showing = new Object();

function effectInit(idDiv){
 	showing[idDiv] = true;
 	saveHeight[idDiv] = null;
}

function toggleSlide(idDiv) {
	if ( showing[idDiv] == true)
		{ slideMenuUp(idDiv);  }
	else
		{ slideMenuDown(idDiv);  }
}

function slideMenuUp(idDiv) {
	if(showing[idDiv] == true){	
		var menu = $(idDiv);
		saveHeight[idDiv] = menu.offsetHeight;
		menu.style.overflow = "hidden";
		menu.style.visibility = "hidden";

		showing[idDiv] = false;
	}
}

function slideMenuDown(idDiv) {
	if(showing[idDiv] == false){	
		var menu = $(idDiv);
		menu.style.visibility = "visible";
		menu.style.overflow = "visible";
		
		new Rico.Effect.Size( menu, null, saveHeight[idDiv], 120, 8, {complete:function() { menu.style.overflow = "visible"; }} );
		showing[idDiv] = true;
	}
}

// --/ Toogle Effects   


// CheckInput
// verifica la correttezza del dato in input 
function checkInput(ivalue, typeC) {
	switch(typeC){

		case 0:  // ivalue e' composto solo da cartteri alfanumerici e (-, _, .)
			var tReg = /^[A-Za-z0-9_\-\.]+$/;
			if (!tReg.test(ivalue))       
				return false;    

			break;

		case 1:  // ivalue e' composto solo da numeri
		case "numerico":
			var tReg = /^[0-9]+$/;
			var tDot = /\./;
			
			aValue = Array();
			if(tDot.test(ivalue)){
        aValue = ivalue.split(tDot);
        if(aValue.length > 2)
          return false;
          
      }else{
        aValue[0] = ivalue;
      }
			 
			for(i=0; i < aValue.length; i++) 
  			if (!tReg.test(aValue[i]))
  				return false;
      
			break;

		case 2:  
		case "int":
			var tReg = /^[0-9]+$/;
			if (!tReg.test(ivalue))       
				return false;    

			break;

		default: break;
	}
	
	return true;
}

// cambia la virgola nel punto decimale se presente
function decimalComma2Dot(ivalue){
  return ivalue.replace(/^([^,]*),/, '$1.');
}

function showHideDiv(idDiv){
	if(document.getElementById(idDiv) && document.getElementById(idDiv).style.visibility){
		if(document.getElementById(idDiv).style.visibility == 'hidden'){
			document.getElementById(idDiv).style.visibility = 'visible';
		}else{
			document.getElementById(idDiv).style.visibility = 'hidden';
		}
		
	}	
}

function displayNoneDiv(idDiv){
	if($(idDiv).style.display == ""){
		$(idDiv).style.display = "none";
	}else if($(idDiv).style.display == "none"){    
		$(idDiv).style.display = "";
	}		
}

function createOptionSelect(Select, array_options){
  //Select: name della select da popolare
  //options: array associativo con il value e il contenuto
  var j = 0;
  var object_select = document.getElementsByName(Select)[0];
  if (object_select != undefined){
      for (i = object_select.length; i > 0; i--)  {
        object_select.options[i-1] = null;
      }
      for ( keyVar in array_options ) {
        object_select.options[j] = new Option(array_options[keyVar], keyVar);
        j++;
      }
  }
}

selectRegioneProvincia = function(selectRegione, selectProvincia){
  buildEmptyList(30);
  var option_regione = {'':pList0,
                "XXX":"Regione generale",
                "ABR":"Abruzzo",
                "BAS":"Basilicata",
                "CAL":"Calabria",
                "CAM":"Campania",
                "EMR":"Emilia-Romagna",
                "FVG":"Friuli-Venezia-Giulia",
                "LAZ":"Lazio",
                "LIG":"Liguria",
                "LOM":"Lombardia",
                "MAR":"Marche",                
                "MOL":"Molise",
                "PIE":"Piemonte",
                "PUG":"Puglia",
                "SAR":"Sardegna",
                "SIC":"Sicilia",
                "TOS":"Toscana",
                "TAA":"Trentino-Alto-Adige",
                "UMB":"Umbria",
                "VDA":"Valle D'Aosta",
                "VEN":"Veneto"
                };
  createOptionSelect(selectRegione, option_regione);
   
  var option_provincia = new Array();
  option_provincia[''] = {'':pList0};
  option_provincia['XXX'] = {'':pList0, "XX":"Provincia speciale", "SM":"Repubblica di San Marino"};
  option_provincia['ABR'] = {'':pList0, 'AQ':"L'Aquila", 'CH':'Chieti', 'PE':'Pescara', 'TE':'Teramo'};
  option_provincia['BAS'] = {'':pList0, "MT":"Matera", "PZ":"Potenza"};
  option_provincia['CAL'] = {'':pList0, "CZ":"Catanzaro", "CS":"Cosenza", "KR":"Crotone", "RC":"Reggio Calabria", "VV":"Vibo Valentia"};
  option_provincia['CAM'] = {'':pList0, "AV":"Avellino", "BN":"Benevento", "CE":"Caserta", "NA":"Napoli", "SA":"Salerno"};
  option_provincia['EMR'] = {'':pList0, "BO":"Bologna", "FE":"Ferrara", "FC":"Forli'-Cesena", "MO":"Modena", "PR":"Parma", "PC":"Piacenza", "RA":"Ravenna", "RN":"Rimini", "RE":"Reggio Emilia"};
  option_provincia['FVG'] = {'':pList0, "GO":"Gorizia", "PN":"Pordenone", "TS":"Trieste", "UD":"Udine"};
  option_provincia['LAZ'] = {'':pList0, "FR":"Frosinone", "LT":"Latina", "RI":"Rieti", "RM":"Roma", "VT":"Viterbo"};
  option_provincia['LIG'] = {'':pList0, "GE":"Genova", "IM":"Imperia", "SP":"La Spezia", "SV":"Savona"};
  option_provincia['LOM'] = {'':pList0, "BG":"Bergamo", "BS":"Brescia", "CO":"Como", "CR":"Cremona", "LC":"Lecco", "LO":"Lodi", "MN":"Mantova", "MI":"Milano", "PV":"Pavia", "SO":"Sondrio", "VA":"Varese"};
  option_provincia['MAR'] = {'':pList0, 'AN':'Ancona', 'AP':'Ascoli Piceno', 'MC':'Macerata', 'PU':'Pesaro-Urbino'};
  option_provincia['MOL'] = {'':pList0, "CB":"Campobasso", "IS":"Isernia"};
  option_provincia['PIE'] = {'':pList0, "AL":"Alessandria", "AT":"Asti", "BI":"Biella", "CN":"Cuneo", "NO":"Novara", "TO":"Torino", "VB":"Verbano-Cusio-Ossola", "VC":"Vercelli"};
  option_provincia['PUG'] = {'':pList0, "BA":"Bari", "BR":"Brindisi", "FG":"Foggia", "LE":"Lecce", "TA":"Taranto"};
  option_provincia['SAR'] = {'':pList0, "CA":"Cagliari", "CI":"Carbonia-Iglesias", "NU":"Nuoro", "OT":"Olbia-Tempio", "OR":"Oristano", "VS":"Medio Campidano", "SS":"Sassari", "OG":"Ogliastra"};
  option_provincia['SIC'] = {'':pList0, "AG":"Agrigento", "CL":"Caltanissetta", "CT":"Catania", "EN":"Enna", "ME":"Messina", "PA":"Palermo", "RG":"Ragusa", "SR":"Siracusa", "TP":"Trapani"};
  option_provincia['TOS'] = {'':pList0, "AR":"Arezzo", "FI":"Firenze", "GR":"Grosseto", "LI":"Livorno", "LU":"Lucca", "MS":"Massa-Carrara", "PI":"Pisa", "PT":"Pistoia", "PO":"Prato", "SI":"Siena"};
  option_provincia['TAA'] = {'':pList0, "BZ":"Bolzano", "TN":"Trento"};
  option_provincia['UMB'] = {'':pList0, "PG":"Perugia", "TR":"Terni"};
  option_provincia['VDA'] = {'':pList0, "AO":"Aosta"};
  option_provincia['VEN'] = {'':pList0, 'BL':'Belluno', 'PD':'Padova', 'RO':'Rovigo', 'TV':'Treviso', 'VE':'Venezia', 'VR':'Verona', 'VI':'Vicenza'};

  var object_select_regione = document.getElementsByName(selectRegione)[0];
  var object_select_provincia = document.getElementsByName(selectProvincia)[0];
  object_select_regione.onchange = function(e){
    if (!e){ //condizione per funzionare con IE
      var e = window.event;
    }
    if (e.target){
      tendina = e.target;
    }
    else if (e.srcElement){ //condizione per funzionare con IE
      tendina = e.srcElement;
    }
    var valore = tendina.options[tendina.selectedIndex].value;
    createOptionSelect(selectProvincia, option_provincia[valore]);
  };
}
//  End -->

// href javascript
function goLocationPage(page){
  window.location.href = page;
}

function changeClassName(el, toClass){
    el.className = toClass;
}

function SubmitVirtualForm(params, options)
{
	if(!params) return false;

	VirtualForm = document.createElement('form');
	VirtualForm.setAttribute('method', 'post');
	if(options['method'] && (options['method'].toLowerCase() == 'post' || options['method'].toLowerCase() == 'get') )
		VirtualForm.setAttribute('method', options['method'].toLowerCase());
	if(options['action'])
		VirtualForm.setAttribute('action', options['action']);

	var InputField;
	for(var i in params)
	{
		//alert(i);
		InputField = document.createElement('input');
		InputField.setAttribute('type', 'hidden');
		InputField.setAttribute('name', i);
		InputField.setAttribute('value', params[i]);
		VirtualForm.appendChild(InputField);
	}
	document.body.appendChild(VirtualForm);
	VirtualForm.submit();
	document.body.removeChild(VirtualForm);
}