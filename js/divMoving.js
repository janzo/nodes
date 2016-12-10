/*
divMoving

Richiede la libreria prototype.js
Per utilizzare l'oggetto inserire la seguente parte di codice javascript. Esempio:
var myDivMoving = null;
window.onload = function(){
   myDivMoving = new divMoving("divTopLeft", {offset:true});
}

idName: id dell'elemento

options
offset: boolean. decide se l'elemento deve scorrere all'interno di un altro. Default prende l'elemento contenente l'elemento in questione.
fromTop: intero. Distanza dall'inizio della pagina.
*/

divMoving = Class.create();
divMoving.prototype = {
    debug: false,
    el: null,
    elCloned: null,
    offset: false,
    fromTop: 0,
    toBottom: 0,
    mTop: 0, // Margin top dell'elemento
    elHeight: 0,
    elWidth: 0,
    elStyle: [],
    contHeight: 0,
    container: [],
    parentElement: null,
    parentTopBorder: 0,
    parentBottomBorder: 0,
    initialize: function(idName, options){

        if(options["offset"]) {
			this.offset = options["offset"];
		}
        
        if(options["fromTop"])
            this.fromTop = options["fromTop"];
       
        this.el = $(idName);
        
        if(this.debug){
            elDebug = new Element('div', {style: 'border: 1px solid black; background-color: red; position: fixed; right:0px; top:0px;'});
            document.body.insert({bottom: elDebug});
        }       

        this._load();

        Event.observe(window, 'resize', this._load.bindAsEventListener(this));
        Event.observe(window, 'scroll', this.moving.bindAsEventListener(this));
    },
    
    _load: function(event){

        if(this.elCloned){
            Element.remove(this.elCloned);
        }else{
            this.elStyle["width"] = '';
            if(this.el.getStyle('width'))
                this.elStyle["width"] = this.el.getStyle('width');

            this.elStyle["position"] = '';
            if(this.el.getStyle('position'))
                this.elStyle["position"] = this.el.getStyle('position');
        }
        this.elCloned = new Element('div');
        this.container = document.body;
        if(this.offset){
            if(this.el.parentNode)
                this.container = this.el.parentNode;

            this.contHeight = (Element.getHeight(this.container));
        }

        //catturo dimensioni dell'elemento
        this.elHeight = (Element.getHeight(this.el));
        this.elWidth = (Element.getWidth(this.el));
        
        this.elCloned.style.width = this.elWidth + "px";
        this.elCloned.style.heigth = this.elHeight + "px";
        this.elCloned.style.backgroundColor = "yellow";
        this.elCloned.style.display = "none";
        this.elCloned.style.visibility = "hidden";

//         var width = Element.getWidth(this.el);
//         var tmp = 0;
//         var bL = (tmp = Element.getStyle(this.el, "borderLeftWidth")) ? (isNaN(tmp = tmp.split("px")[0])?0:tmp):0;
//         var bR = (tmp = Element.getStyle(this.el, "borderRightWidth")) ? (isNaN(tmp = tmp.split("px")[0])?0:tmp):0;
//         var pL = (tmp = Element.getStyle(this.el, "padding-left")) ? (isNaN(tmp = tmp.split("px")[0])?0:tmp):0;
//         var pR = (tmp = Element.getStyle(this.el, "padding-right")) ? (isNaN(tmp = tmp.split("px")[0])?0:tmp):0;
//         this.mTop = (tmp = Element.getStyle(this.el, "marginTop")) ? (isNaN(tmp = tmp.split("px")[0])?0:tmp):0;
//         width = width - bL - bR - pL - pR;
        
//         this.elCloned.style.width = width + "px";
        //this.elCloned.style.backgroundColor="#FFCC80";
//         this.fixing();

//         var mL = (tmp = Element.getStyle(this.el, "marginLeft")) ? (isNaN(tmp = tmp.split("px")[0])?0:tmp):0;
// 
        /* Bug Fix per WebKit */
        /* Se l'elemento si trova in una cella e la table ha un bordo con spessore, solo per WebKit, deve essere considerato */
        var bugLeftWebkit = 0;
        var bugLeftIE = 0

        if(this.el.parentNode.parentNode.parentNode.parentNode)
            this.parentElement = this.el.parentNode.parentNode.parentNode.parentNode;
        
        if(Prototype.Browser.WebKit && this.parentElement && this.parentElement.tagName == "TABLE"){
            bugLeftWebkit = (tmp = Element.getStyle(this.parentElement, "borderLeftWidth")) ? (isNaN(tmp = tmp.split("px")[0])?0:parseInt(tmp)):0;
//                 if(this.parentElement.style.border)
//                     bugLeftWebkit++;
            this.parentTopBorder = (tmp = Element.getStyle(this.parentElement, "borderTopWidth")) ? (isNaN(tmp = tmp.split("px")[0])?0:parseInt(tmp)):0;
            this.parentBottomBorder = (tmp = Element.getStyle(this.parentElement, "borderBottomWidth")) ? (isNaN(tmp = tmp.split("px")[0])?0:parseInt(tmp)):0;
        }
        
//             if(Prototype.Browser.IE && this.parentElement && this.parentElement.tagName == "TABLE")
//                 bugLeftIE = 1;

        //this.elCloned.style.left=(Element.cumulativeOffset(this.el)[0]-mL+bugLeftWebkit-bugLeftIE)+"px";        

        this.el.insert({before: this.elCloned});

        this.originaling();
        if(arguments[0] && event.type == "resize"){
            this.moving();
        }
    },
    
    moving: function(){

        // yOff: distanza dell'elemento dall'inizio della pagina
        // y: distanza dell'elemento dalla parte superiore del browser
        
        //ycOff: distanza del contenitore dall'inizio della pagina
        //yc: l'altezza del contentitore a partire dalla parte superiore del browser

        var tmpPx = 0;
        var elRef = this.el;
        if(this.elCloned.style.display != 'none')
            elRef = this.elCloned;

        yOff = Element.cumulativeOffset(elRef)[1]-this.mTop-this.fromTop;
        y = Element.cumulativeScrollOffset(elRef)[1]-yOff-this.parentBottomBorder;

        ycOff = Element.cumulativeScrollOffset(this.container)[1];
        this.contHeight = Element.getHeight(this.container);
        yc = Element.cumulativeOffset(this.container)[1] + this.contHeight - ycOff - this.elHeight + this.parentTopBorder-this.fromTop;
        
        if(this.debug) elDebug.innerHTML = y;
        
        if(y > 0){
            if(this.offset){
                if(yc >= 0){
                    this.fixing();
                }else{
                    this.absoluting();
                }
            }else{
                this.fixing();
            }
            this.HideShowElClone("moving");
    	}else{
            this.originaling();
            this.HideShowElClone("original");
        }
        this.setHeight(y);        
    },
    
    refresh: function(){
        tmpEvent = new Object();
        tmpEvent.type = "resize";
        this._load(tmpEvent);
        
    },

    fixing: function(){

        if(this.el.style.position == 'fixed')
            return true;
        this.el.style.position="fixed";
        this.el.style.top=this.fromTop+"px";
    },
    
    absoluting: function(){

        if(this.el.style.position == 'absolute'){
            return true;
        }
        this.el.style.position="absolute";
        this.el.style.top=(Element.cumulativeOffset(this.container)[1]+this.contHeight-this.elHeight+this.parentTopBorder)+"px";
    },

    originaling: function(){
        
        if(this.el.style.position == this.elStyle["position"])
            return true;
        this.el.style.width = this.elStyle["width"];
        this.el.style.position = this.elStyle["position"];
        
        //this.el.style.top=(Element.cumulativeOffset(this.container)[1]+this.contHeight-this.elHeight+this.parentTopBorder)+"px";
    },

    setHeight: function(distFromTop){
        this.el.style.height = null;
        this.elHeight = Element.getHeight(this.el);
        var maxHeight = this.contHeight - this.fromTop - this.toBottom;
        if(this.el.style.position == 'fixed')
            null;
        else
            maxHeight = maxHeight + distFromTop;
        
        if(this.elHeight > maxHeight)
            this.el.style.height = maxHeight+"px";
    },

    HideShowElClone: function(caso){
        switch(caso){
            case 'original':
                if(this.elCloned.style.display != "none")
                    this.elCloned.style.display = "none";
                break;                    
            case 'moving':
                if(this.elCloned.style.display != "")
                    this.elCloned.style.display = "";
                break;
        }
    }

};