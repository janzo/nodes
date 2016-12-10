
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">

	<title>Table</title>
	
	<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" type="text/css" /><!-- 	ok funziona -->
	<link rel="stylesheet" href="css/jquery.tablesorter.css" type="text/css" /> 
	<script src="js/jquery.min.js"></script><!-- 	ok funziona -->
	<script src="js/jquery.tablesorter.min.js"></script>
	<script src="js/jquery.stickytableheaders.min.js"></script>
	<!--<script src="jsjanzo/tabs.js"></script>-->
	<? include_once("funzioni_db.php"); ?>
<script src="bootstrap/js/bootstrap.min.js"></script>
	
</head>
<body>




<?
$myconnesione = new connessione;
$tag = $_POST['tag'];
?>

<!--<div id="invisibile">
	<h3><? echo ($tag); ?><h3>
</div>-->

<div id="visibile">
<?
	$myconnesione->table1("$tag");
?>
</div>
<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->

<script src="bootstrap/js/bootstrap.min.js"></script><!-- nb: diverso indirizzo su impresa!!!! -->

<script>
	$(document).ready(function () {
		$(".tablesorter").tablesorter();
		var offset = $('.navbar').height();
		$("html:not(.legacy) table").stickyTableHeaders({fixedOffset: offset});
	});
</script>  
  
  
  
</body>
</html>
