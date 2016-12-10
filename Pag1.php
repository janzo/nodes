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

<? include_once("navbar.htm"); ?>

<div id="wrap">
	<div class="container">
	
	
<?if (!isset($_POST['url']) || ($_POST['url']=="")){?>	
	  <div class="form-group">
	    <form method="post" action="Pag1.php">
	    <label for="email">Nuovo link:</label>
	    <input type="text" name="url" id="url class="form-control" >
	  <button type="submit" class="btn btn-default" >Inserisci</button>
	</form>
	  </div>
	
	
	
	<!--	<div style  "padding-top:100px;" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
		
			<iframe style "width:100%;" src="https://docs.google.com/document/d/1L_KE4dqN8Qz6xXsy8G9X_LnS5H94_k3QTDfDqBrBQyg/pub?embedded=true"></iframe>
		
		</div>
		<div style  "padding-top:100px;" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<iframe src="https://docs.google.com/spreadsheets/d/1-1wW1579wJbdRGyxDXnonm494R5dBpjEG4LrxzTLk8c/pubhtml?widget=true&amp;headers=false"></iframe>
		</div>
		<div style  "padding-top:100px;" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<iframe width="560" height="315" src="https://www.youtube.com/embed/QH3Fx41Jpl4" frameborder="0" allowfullscreen></iframe>
		</div>
		<div style  "padding-top:100px;" class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
			<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2798.5578243809564!2d10.999607015763237!3d45.45856584183998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x477f58b9feeff6f1%3A0x794280e97391232f!2sVia+Marsala%2C+83%2C+37128+Verona+VR!5e0!3m2!1sen!2sit!4v1472696366398" width="400" height="300" frameborder="0" style="border:0" allowfullscreen></iframe>
		</div>-->

	</div>
</div>





</body>
</html>

<?
}
$url = null;
if (isset($_POST['url']))
{
	$url = $_POST['url'];
}

if ($url != null)
{
	$mylink = new link;
	$thisid = $mylink->insert_url_descr ($url); 
	echo $mylink->stampa_link_da_id ($thisid);
	echo ("</br><a href='Pag1.php'>Nuovo inserimento </a>");
// 	echo ("</br><a href='form2.php?id=".$thisid."'>modifica</a>");
$mytag = new tag;
$mytag ->table_links_by_tags ('SenzaTAG');


}
?>
