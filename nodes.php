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
	<link href="vis/dist/vis.css" rel="stylesheet" type="text/css" />

	<script type="text/javascript" src="vis/dist/vis.js"></script>
	<script src="js/jquery.min.js"></script><!-- 	ok funziona -->

  <style type="text/css">
    #mynetwork {
      width: 100%;
      height: 700px;
      border: 1px solid blue;
    }
  </style>
<?  include_once("funzioni_newjanzo.php"); ?>
	
</head>
<body style="background-color:powderblue;">
<? include_once("navbar.htm"); ?>
<div class="container"> 
<div id="wrap">
<?
$data_nodes=array();
$conn = new connessione ();
$query_nodes = "SELECT distinct n.id, n.description, n.content FROM mynodes AS n ";
$result = $conn-> select1($query_nodes);

$n=0;	
foreach ($result as $key => $res)
{
	$label=$res[1];

	$label = str_replace("https://www.", "",$label);
	$label = str_replace("http://www.", "",$label);
	$label = str_replace(":", "-",$label);
	$label = str_replace("'", " ",$label);
	$label = str_replace(":", " ",$label);
	$label = str_replace("/", " ",$label);
	$label = str_replace(".", " ",$label);
	$label = str_replace("_", " ",$label);

	$data_nodes[$n] = "{ id: ".$res[0].", label: '".$label."'},";
	$n++;
}
$query_relations = "SELECT distinct r.id_1, r.id_2 FROM node_relations AS r";
$resultr = $conn-> select1($query_relations);

$n=0;	
foreach ($resultr as $keyr => $resr)
{
	$from=$resr[0];
	$to=$resr[1];

	$data_relations [$n] = "{from:".$resr[0].", to: ".$resr[1]."},";
	
	$n++;
}
?>
<!-- <pre id="eventSpan"></pre> -->

<div id="framenode"  ></div>
<div id="mynetwork"></div>

<script type="text/javascript">
  // create an array with nodes
  var nodes = new vis.DataSet([
	<?
	foreach ($data_nodes as $data_node)
	{
		echo $data_node;
	}
	?>  
//     {id: 1, label: 'Node 1'},
  ]);

  // create an array with edges
  var edges = new vis.DataSet([
<?  
	foreach ($data_relations as $data_relation)
	{
		echo $data_relation;
	}
?>  
//     {from: 2, to: 5}
  ]);

  // create a network
  var container = document.getElementById('mynetwork');
  var data = {
    nodes: nodes,
    edges: edges
  };
    var options = {
    nodes : {
      shape: 'dot',
      size: 10
    },
    interaction:{
      hover:true
    }
  };
  var network = new vis.Network(container, data, options);
  
  
  function replacer(key, value) {
//   if (typeof value === "string") {
  if (typeof value === "object") {
//     return undefined;
    return undefined;
  }
  return value;
}
  
  
  
    network.on ("click", function (params) 
	      {
		    params.event = "[original event]";
// 		    document.getElementById('eventSpan').innerHTML = '<h2>Click event:</h2>' + JSON.stringify(params, null, 4);

		    var content = "<iframe width='100%' height='20px' frameborder='0' src='view.php?id="+params.nodes + "'><\/iframe>";
// 		    document.getElementById('framenode').innerHTML = content;
 		    window.open('view.php?id='+params.nodes )

// 		    document.getElementById('framenode').innerHTML = content;
	      }
    );  
  
  
</script>
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

