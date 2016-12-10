/**
  acl.js
  
  Libreria di funzione per la gestione del form delle acl generato da alienante
  	
 */


/*
  Seleziona una riga della tabella acl
  Ogni checkbox è etichettato come acl_object + \d\d (2 digit)
  Escudo i due digit dal nemo del checkbox ed ottengo la stringa per il confronto
*/
function select_rows(acl_object){

	nb = document.dati.elements.length;
	for (var i=0;i<nb;i++) {
		switch (document.dati.elements[i].type){
			case "checkbox":
				var test_str = document.dati.elements[i].name;
				test_str = test_str.substr(0,test_str.length - 2);	

				if( test_str == acl_object ){
					 document.dati.elements[i].checked = 1;
				}
				break;			

			default: break;
		}

	}	
	
}

function select_columns(acl_columns){

	nb = document.dati.elements.length;
	for (var i=0;i<nb;i++) {
		switch (document.dati.elements[i].type){
			case "checkbox":
				var test_str = document.dati.elements[i].name;
				test_str = test_str.substr(test_str.length - 2,test_str.length);	

				if( test_str == acl_columns ){
					 document.dati.elements[i].checked = 1;
				}
				break;			

			default: break;
		}

	}	
	
}
