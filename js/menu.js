navHover = function() {
	if(document.getElementById("menu_bar_sx") != null) {
    ok = iemenu("menu_bar_sx");
  }
	if(document.getElementById("menu_bar_dx") != null) {
    ok = iemenu("menu_bar_dx");
  }
}

function iemenu(menu_idname) {
  divmenu = document.getElementById(menu_idname);
  menuul = getElementsByClass("navmenu", divmenu, "ul");
  
  for (j = 0; j < menuul.length; j++) {
    menulink = menuul[j].getElementsByTagName("li");
    
    for (i = 0; i < menulink.length; i++) {
      menulink[i].onmouseover = function() {
        this.className+="iehover";
		  }
		  menulink[i].onmouseout = function() {
        this.className=this.className.replace(new RegExp("iehover\\b"), "");
		  }
    }
	
  }
	return 0;
}


function getElementsByClass(searchClass, node, tag) {
  var classElements = new Array();
  if (node == null)
    node = document;
  if (tag == null)
    tag = '*';
  var els = node.getElementsByTagName(tag);
  var elsLen = els.length;
  var pattern = new RegExp("(^|\\s)"+searchClass+"(\\s|$)");
  for (i = 0, j = 0; i < elsLen; i++) {
    if (pattern.test(els[i].className) ) {
      classElements[j] = els[i];
      j++;
    }
  }
  return classElements;
}

if (window.attachEvent) {
	window.attachEvent("onload", navHover);
}
