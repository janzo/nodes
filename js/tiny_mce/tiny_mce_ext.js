
//classe che estende Ajax.Autocompleter per modificare il difetto del tasto TAB
tinyMCE_ext = Class.create({
    
    editor: null,  

    initialize: function(textareas_name, options) {    
        
        tinyMCE.init({
        	language : 'it',        
        	mode : "exact",
        	elements : textareas_name.join(","),        
        	theme : "advanced",
            plugins: "table,inlinepopups,preview,paste",
            readonly: false,
                    
        	theme_advanced_buttons1 : "fontselect,fontsizeselect,formatselect,|,justifyleft,justifycenter,justifyright,justifyfull",
        	theme_advanced_buttons2 : "bold,italic,underline,strikethrough,|,sub,sup,|,forecolor,backcolor,|,bullist,numlist,|,table",
            theme_advanced_buttons2_add : ",|,pastetext,code,preview",
            theme_advanced_buttons3 : "",
        
        	theme_advanced_toolbar_location : "top",
        	theme_advanced_toolbar_align : "left",
            
            force_br_newlines : true,
            force_p_newlines : false,            
            forced_root_block : false,
              
        });
        
        this.editor = tinyMCE;            
    },

    setReadonly: function(bool_readonly){
       this.editor.settings.readonly = bool_readonly;        
    },
    
    getContent: function(element){
       return this.editor.get(element).getContent();                
    },

    setContent: function(element, text){
       return this.editor.get(element).setContent(text);                
    },
    
    focus: function(element){
       this.editor.getInstanceById(element).focus();              
    }        
  
});