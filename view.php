<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="">
	<meta name="author" content="">

	<title>Janzo's Home</title>
	
	<link rel="stylesheet" href="bootstrap/css/bootstrap.min.css" type="text/css" /><!-- 	ok funziona -->
<!-- 	<link rel="stylesheet" href="css/jquery.tablesorter.css" type="text/css" /> -->
	<script src="js/jquery.min.js"></script><!-- 	ok funziona -->
<!-- 	<script src="js/jquery.tablesorter.min.js"></script> -->
<!-- 	<script src="js/jquery.stickytableheaders.min.js"></script> -->
	<!--<script src="jsjanzo/tabs.js"></script>-->
	<? include_once("funzioni_newjanzo.php"); ?>
	<? include_once("funzioni_tabs.php"); ?>

	
</head>
<body style="background-color:powderblue;">


<div id="wrap">
	<div class="container">
	
	
<?
if (!isset($_GET['id']) || ($_GET['id']=="")){
echo "nessun get";
}

$id = null;

if (isset($_GET['id']))
{
	$id = $_GET['id'];
}

if ($id != null)
{

	$data_nodes=array();
	$conn = new connessione ();
	$query_nodes = "SELECT distinct n.id, n.description, n.content, n.type FROM mynodes AS n WHERE ID =".$id;
	$result = $conn-> select1($query_nodes);
	// print_r($result);

	if ($result[0][3]==1)//È UN LINK
	{
	header("location:". $result[0][2]);
	}
	if ($result[0][3]==4)//È UN TAG
	{
	ECHO "TAG ".$result[0][1]." id: ".$result[0][3] ;
	}
	
	
	
	
}
?>
</body>
</html>