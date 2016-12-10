function prova_ajax1 () {
	  
	$(document).ready(function(){
	    $("p").mouseenter(function(){
		$(this).hide();
	    });
	});
	
	
	}
	
	function prova_ajax2 () {
	$(document).ready(function(){
		$("a").mouseenter(function()
		{
		    alert($(this).attr("href"));
		});	
	});
	}
	
	function evidenzia () {
	  
	$(document).ready(function(){
		$("a").mouseenter(function()
		{
// 		    $(this).attr({"href": "http://www.w3schools.com/jquery" });
		    $(this).css({"background-color": "yellow", "font-size": "200%"});	    
		});
		$("a").mouseleave(function()
		{
// 		    $(this).attr({"href": "http://www.w3schools.com/jquery" });
		    $(this).css({"background-color": "", "font-size": "100%"});	    
		});
	});
	}
	
	function prova_ajax () {
	$(document).ready(function(){
	    $("p").click(function(){
		$("#div1").load("http://www.mrwebmaster.it/grafica/");
	    });
	});
	}

	function prova_ajax4 () {
	    function showHint(str) {
		if (str.length == 0) {
		    document.getElementById("txtHint").innerHTML = "";
		    return;
		} else {
		    var xmlhttp = new XMLHttpRequest();
		    xmlhttp.onreadystatechange = function() {
			if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			    document.getElementById("txtHint").innerHTML = xmlhttp.responseText;
			}
		    };
		    xmlhttp.open("GET", "iframe.php?q=" + str, true);
		    xmlhttp.send();
		}
	    }
	    </script>

	    <p><b>Start typing a name in the input field below:</b></p>
	    <form>
	    First name: <input type="text" onkeyup="showHint(this.value)">
	    </form>
	    <p>Suggestions: <span id="txtHint"></span></p>
	    <?
	    <script>
	}

function myFunction() {
    document.getElementById("demo").innerHTML = "Paragraph changed.";
}
	

	
	


