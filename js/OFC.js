/*
*	OFC.js - libreria per esportazione immagine da Flash (Open Flash Chart)
*/
OFC = Class.create();
OFC.prototype = {

    name: "Prototype",

    initialize: function() {
	},

    version: function(src){ 
        return $(src).get_version() 
    },
    rasterize: function(src, dst) { 
        $(dst).replace(new Element("img", {src: this.image(src)})) 
    },
    image: function(src){
        return "data:image/png;base64," + $(src).get_img_binary()
    },
    popup: function(src, sWidth, sHeight){
		var parHTML="height=" + sHeight + ",width=" + sWidth + ",status,scrollbars,menubar";
        var POPUPW = window.open('','POPUPW', parHTML);
        POPUPW.document.write("<html><head><title>Grafico: Esporta Immagine<\/title><\/head><body style=\"text-align:center;\"><img src=\"" + this.image(src) + "\" \/><\/body><\/html>"); 
    }
};