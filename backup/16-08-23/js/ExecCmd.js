// Funzioni javascript per abilitare l'esecuzione
// dell'applet java che esegue comandi da shell 
//
// Attenzione: e' necessaria la presenza del file SignedExecApplet.jar nella directory ../java/
//
// Last update: 2006-11-03 - comandi per windows
function checkDiv(divId){
		if(document.getElementById(divId)){
			document.getElementById(divId).style.visibility = 'visible';
			return;	
		}
		
		// il div non esiste, lo creo al volo
		var eDiv=document.createElement("DIV");
		eDiv.id = divId;
		eDiv.style.visibility = 'visible';
		eDiv.style.position = 'absolute';
		eDiv.style.top = '10px';
		eDiv.style.left = '1px';
		// eDiv.style.backgroundColor="red";
		
		document.body.appendChild(eDiv);
		return;
}

function AppletFireFox(divId, cmd, ip, port){
	checkDiv(divId);
	
	document.getElementById(divId).innerHTML =
		  "<object ID='appletTest1' classid=\"java:execApplet.class\" height=\"0\" width=\"0\" >" +
		  "   <param name=\"mayscript\" value=\"Y\">" +
		  "   <param name=\"archive\" value=\"../java/SignedExecApplet.jar\">" +
		  "   <param name=\"cmd\" value=\""+cmd+"\">" +
		  "   <param name=\"ip\" value=\""+ip+"\">" +
		  "   <param name=\"port\" value=\""+port+"\">" +
		  "</object>";
}

function AppletIE(divId, cmd, ip, port){
	checkDiv(divId);
		
	document.getElementById(divId).innerHTML =
	    "<object ID='appletTest1' classid=\"clsid:8AD9C840-044E-11D1-B3E9-00805F499D93\"" +
		"		height=\"0\" width=\"0\" >" +
		"   <param name=\"code\" value=\"execApplet.class\" />" +
	    "   <param name=\"archive\" value=\"../java/SignedExecApplet.jar\">" +
	    "   <param name=\"cmd\" value=\""+cmd+"\">" +
	    "   <param name=\"ip\" value=\""+ip+"\">" +
	    "   <param name=\"port\" value=\""+port+"\">" +
		"</object>" ;
}

// esegue un'occorrenza dell'applet su:
// ip: indirizzo ip
// port: porta destinazione (obbligatoria per telnet
// cmd: applicazione che viene eseguita:
//		0: ping -t ip
//		1: tracert ip
//		2: telnet ip port
function ExecCmd(vBrowser, cmd, ip, port){
			
	if(vBrowser.toLowerCase() == 'firefox'){
		// Firefox
		AppletFireFox('divApplet1', cmd, ip, port);
	}else if(vBrowser.toLowerCase() == 'explorer'){
		// IE
		AppletIE('divApplet', cmd, ip, port);
	}else{	
		alert('ExecCmd Plug-in non configurato');
	}
}