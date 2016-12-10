<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">

	<title>NewJanzo</title>
	
	<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" type="text/css" /><!-- 	ok funziona -->
<!-- 	<link rel="stylesheet" href="css/jquery.tablesorter.css" type="text/css" /> -->
	<script src="js/jquery.min.js"></script><!-- 	ok funziona -->
<!-- 	<script src="js/jquery.tablesorter.min.js"></script> -->
<!-- 	<script src="js/jquery.stickytableheaders.min.js"></script> -->
	<!--<script src="jsjanzo/tabs.js"></script>-->
	<? include_once("funzioni_db.php"); ?>

	
</head>
<body style="background-color:powderblue;">

<? include_once("navbar.htm"); ?>


<div id="wrap">
	<div class="container">
<li><a href="phpinfo.php">phpinfo.php</a></li></br>  
<li><a href="vis.php">vis.php</a></li></br>  
<li><a href="vis2.php">vis2.php</a></li></br>  
<li><a href="insert.php">insert.php</a></li></br>  
<li><a href="up.php">up.php</a></li></br>  
	</div>
</div>





<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->

<script src="bootstrap/js/bootstrap.min.js"></script><!-- nb: diverso indirizzo su impresa!!!! -->
<!--
<script>
	$(document).ready(function () {
		$(".tablesorter").tablesorter();
		var offset = $('.navbar').height();
		$("html:not(.legacy) table").stickyTableHeaders({fixedOffset: offset});
	});
</script>  -->

</body>
</html>

