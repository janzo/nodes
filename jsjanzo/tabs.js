
function loadDoc(url, tabid, post) 
{
	$(document).ready
	(
	  function()
	  {
		$.post(url , {tag: post}, function(result)
					  {
					  $("#"+tabid).html(result);	   	    
					  console.log(tabid);
					  }
		      );
	  }
	);
}