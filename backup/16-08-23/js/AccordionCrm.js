var optionAccordion = { 
		 panelHeight	     : 300,

		 expandedBg          : 'red',
	         expandedTextColor   : 'white',
	         expandedFontWeight  : 'bold',

	         hoverBg             : 'blue',
	         hoverTextColor      : 'white',

	         collapsedBg         : 'yellow',
	         collapsedTextColor  : 'white',
	         collapsedFontWeight : 'normal',

	         borderColor         : '#000000',
	         onHideTab           : null,
	         onShowTab           : null,
		 onLoadShowTab       : '1' 
	};



function AccordionCrm(aDiv, nCssSheet, vBrowser){	
	this.accordionDiv = aDiv;
	this.nCssSheet = nCssSheet;
	this.debug = 0;

	this.cssStyleSelected = 'panelSelected';
	this.cssStyleUnSelected = 'panelUnselected';
	this.cssStyleHover = 'panelHover';

	this.vBrowser = 'Explorer';
	
	if(vBrowser != 'undefined')
		this.vBrowser = vBrowser;

	return this;
}


AccordionCrm.prototype.sheet2options=function(){


	var Rules = null;
	if(document.styleSheets[this.nCssSheet].cssRules){
		Rules = document.styleSheets[this.nCssSheet].cssRules;
	}else{
		Rules = document.styleSheets[this.nCssSheet].rules;
	}

	
	if(this.vBrowser != 'Explorer'){

		for(var i = 0; i < Rules.length; i++){
		
			if(Rules[i].selectorText == '.' + this.cssStyleSelected){
				optionAccordion.expandedBg = Rules[i].style.getPropertyValue('background-color');	
				optionAccordion.expandedTextColor  = Rules[i].style.getPropertyValue('color');	
			}
		
			if(Rules[i].selectorText == '.' + this.cssStyleUnSelected){
				optionAccordion.collapsedBg = Rules[i].style.getPropertyValue('background-color');
				optionAccordion.collapsedTextColor = Rules[i].style.getPropertyValue('color');	
			}
		
			if(Rules[i].selectorText == '.' + this.cssStyleHover){
				optionAccordion.hoverBg = Rules[i].style.getPropertyValue('background-color');
				optionAccordion.hoverTextColor = Rules[i].style.getPropertyValue('color');
			}
			
		}
		
	}else{	
		for(var i = 0; i < Rules.length; i++){
		
			if(Rules[i].selectorText == '.' + this.cssStyleSelected){
				optionAccordion.expandedBg = Rules[i].style.background;	
				optionAccordion.expandedTextColor  = Rules[i].style.color;	
			}
		
			if(Rules[i].selectorText == '.' + this.cssStyleUnSelected){
				optionAccordion.collapsedBg = Rules[i].style.background;
				optionAccordion.collapsedTextColor = Rules[i].style.color;	
			}
		
			if(Rules[i].selectorText == '.' + this.cssStyleHover){
				optionAccordion.hoverBg = Rules[i].style.background;
				optionAccordion.hoverTextColor = Rules[i].style.color;
			}
			
		}

	}
	
	return true;
}

AccordionCrm.prototype.Accordion=function(showTab, panelHeight){
	
	optionAccordion.onLoadShowTab = '0';
	if(showTab)
		optionAccordion.onLoadShowTab = showTab;

	if(panelHeight)
		optionAccordion.panelHeight = panelHeight;

	if(this.debug == 1)
		alert(optionAccordion.onLoadShowTab);
	
	new Rico.Accordion( $(this.accordionDiv), optionAccordion);
}