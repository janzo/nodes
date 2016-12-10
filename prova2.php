<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">

	<title>Nodes</title>
	
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

<?
	$conn = new connessione ();
	
	$query = "SELECT distinct n.id, n.description, n.content, r.id_2 FROM mynodes AS n, node_types as t, node_relations as r WHERE n.id = r.id_1 ";
	
	$result = $conn-> select1($query);
	
	echo $result[3][3]."</br>";

	
	
//  	print_r($result);
// 	foreach($result as $res)
// 	{
// 	echo $res[0][3]."</br>";
// 	}








if (0)
	{
	$conn = new connessione ();
	$query = "SELECT description FROM mynodes where type=4";
	$tagnomi = $conn-> select1($query);
	foreach($tagnomi as $tagnome)
	{
		echo "tagnome= ".$tagnome."</br>";
		$query1 = "SELECT url FROM mylinks where tag='".$tagnome."'";
		$urls = $conn-> select1($query1);
		foreach($urls as $url)
		{
			echo ("->      ".$url."</br>");
			$query2 = "SELECT id FROM mynodes where content='".$url."'";
			$ids = $conn-> select1($query2);
			foreach ($ids as $id)
			{
			$query3 = "SELECT id FROM mynodes where description='".$tagnome."'";
			$tagids = $conn-> select1($query3);
			
			
			
			
			echo "id url FROM mynodes: ".$id." tagnome: ".$tagnome." tagid:".$tagids[0]."</br>";
			$toinsert="INSERT INTO node_relations (id_1, id_2) values (".$id.", ".$tagids[0].")";
			
			if ($conn->connetti()->query($toinsert))
			{
			echo "ok";		
			}
		
			}
		}
	}	
}




?>
	
	
	
	
	
	
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

