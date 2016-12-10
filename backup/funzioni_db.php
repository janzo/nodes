<?php
define("SERVER", "localhost");
define("USER", "root");
define("PASS", "");
define("DB", "links");

class connessione 
{
	public function connetti ()
	{
		$link =  new mysqli(SERVER, USER, PASS, DB);
	

		if ($link->connect_errno) {
		printf("Connect failed: %s\n", $mysqli->connect_error);
		exit();
 		}
// 		echo "Success: A proper connection to MySQL was made! The my_db database is great." . PHP_EOL;
// 		echo "Host information: " . mysqli_get_host_info($link) . PHP_EOL;
		
	return $link;	
	}

	function numtags ()
	{
// 	$this->connetti();
	if ($result = $this->connetti()->query("SELECT DISTINCT tag FROM mylinks;")){
// 		printf("Select returned %d rows.\n", $result->num_rows);
		}
	return $result->num_rows;
	mysqli_close($result);
	}
	


	function select_row ($campo,$campo_condizione, $valore_condizione)
	{	
	$mysqli = $this->connetti();
	$selectall = false;
	if ($campo == '*')
	{
	      $selectall = true;
	}
		
	if ($campo == 'all')
	{
		$query = "SELECT  * FROM mylinks;";
		$selectall = true;
	}
	else
	{
		if ($valore_condizione == 'null'||$valore_condizione == 'NULL'||$valore_condizione == ''||$valore_condizione == 'SenzaTAG')
		{
			$query = "SELECT  * FROM mylinks WHERE tag IS NULL;";
			$selectall = true;
		}
		else 
		{
			$query = "SELECT  $campo FROM mylinks WHERE $campo_condizione = '$valore_condizione';";
		}
	}
	$n = 0;
	
	if ($mysqli->multi_query($query)) {
	    do {
		/* store first result set */
		if ($result = $mysqli->use_result()) {
		    while ($row = $result->fetch_row()) {
			$indice = 0;
			if ($selectall || $campo == 'id') { $myrow ['id'] [$n] = $row[$indice];}
			if ($selectall){$indice = 1;} else {$indice = 0;}
			if ($selectall || $campo == 'url'){$myrow ['url'] [$n] = $row[$indice];}
			if ($selectall){$indice = 2;} else {$indice = 0;}
			if ($selectall || $campo == 'descr'){$myrow ['descr'][$n] = $row[$indice];}
			if ($selectall){$indice = 3;} else {$indice = 0;}
			if ($selectall || $campo == 'tag'){$myrow ['tag'] [$n] = $row[$indice];}
			if ($selectall){$indice = 4;} else {$indice = 0;}
			if ($selectall || $campo == 'note'){$myrow ['note'] [$n] = $row[$indice];}
			$n =$n+1;	
		    }
		    $result->close();
		}
	    } while ($mysqli->next_result());
	}
	$myrow ['n'] = $n-1;
	
	return $myrow;
	/* close connection */
 	mysqli_close($mysqli);
// 	$mysqli->close();
	}
	
	
	function querytags ()
	{	
	$mysqli = $this->connetti();
 	$query = "SELECT DISTINCT tag FROM mylinks";
	$n = 0;
	if ($mysqli->multi_query($query)) 
	{
	    do 
	    {
		/* store first result set */
		if ($result = $mysqli->use_result()) 
		{
		    while ($row = $result->fetch_row()) 
		    {
// 		    printf("%s\n", $row[0]);
// 		    if ($row[0]=="")
// 		    {
// 			$tags[$n]="SENZA TAG";
// 		    }else {
			$tags[$n]=$row[0];
// 		    }
//   		    echo ($tags[$n]."</br>");
		    $n =$n+1;	
		    }
		 }
	    } while ($mysqli->next_result());
// 	$tags ['n'] = 7;
	/* close connection */
	$tags["n"]= $n-1;
	return $tags;
	$result->close();
	mysqli_close($mysqli);
	}
	}
	

	function stampapertag ()
	{
	
	$tags = $this->querytags();
	for ( $n=0; $n <=$tags ['n']; $n++)
	{
		echo ("-->".$tags [$n]."<--</br>");
		// $riga = $conn->select_row('all','','');
		$riga = $this->select_row('*','tag',$tags [$n]);
		for ( $n1=0; $n1 <=$riga ['n']; $n1++)
		{
			echo ($riga ['descr'][$n1]."</br>");
			
		}
	}
	}
	
	function tab_pills ()
	{
	
	$tags = $this->querytags();

?>	
	
	<div class="row" style="font-weight:bold;">
		<ul class="nav nav-pills nav-justified" id="tabHeader1" style="cursor: pointer;">
	
<?	
	
	
	for ( $n=0; $n <=$tags ['n']; $n++)
		{
	// 		echo ("-->".$tags [$n]."<--</br>");
			$tag_a='<li';
			$tag_b='<li';
			if ($n==0) {$tag_b=' class="active"';} else {$tag_b='';}
			
			if ($tags [$n]=="")
			{
				$tag_c= '><a data-toggle="pill" href="#SenzaTAG" >SenzaTAG</a></li>';
				
			}else{
				$tag_c= '><a data-toggle="pill" href="#'.$tags [$n].'">'.$tags [$n].'</a></li>';
			}
			// $riga = $conn->select_row('all','','');
			echo $tag_a.$tag_b.$tag_c;
		
		}
?>		
		</ul>
	</div>		
<?		
		
	}
	
	function tab_content ()
	{
	?> <div class="tab-content"> <?
	$tags = $this->querytags();
	for ( $n=0; $n <=$tags ['n']; $n++)
		{
	?>
	    <div id="<?
	    if ($tags [$n]==""){echo ('SenzaTAG');}else
	    {
	    echo ($tags [$n]);
	    }
	    
	    ?>" class="tab-pane fade <? if ($n==0) {echo ('in active');} ?>">
	      <? 	      $this->table1($tags [$n]); ?>
	      
	    </div>
	<?
		}	
	?> </div> <?
	
	}
	

	function table1 ($tag)
	{
	$tags = $this->querytags(); 
//  	$riga = $this->select_row("*","tag","html");
	if ($tag=="*"||$tag=="all")
	{
	      $riga = $this->select_row("all","","");
	}
	else
	{
// 	      if ($tag=="SenzaTAG"){$tag="";}
	      $riga = $this->select_row('*','tag',$tag);
// 	      echo("why?");
	
	}
	
// 		echo ($head [0]);
// 		echo ($riga ['id'][0]);
		
		?>
		<div class="table-responsive table-scrollable"> 
		<table class="table table-condensed table-striped tablesorter">
		<thead>
		<tr>
		<th class="text-left">Id</th>
<!-- 		<th class="text-left">Url</th> -->
		<th class="text-left">Link</th>
		<th class="text-left">Tag</th>
		<th class="text-left">Note</th>
		<?
		
		
		?>
		</tr>
		</thead>
		<tbody>
		
		<?for ( $n1=0; $n1 <=$riga ['n']; $n1++)
		{?>	
		<tr class= "active">
		<td>
		<?echo ($riga ['id'][$n1]."</br>");?>
		</td>
		<td>
		<a href="<?echo ($riga ['url'][$n1]);?>"  
		><?echo ($riga ['descr'][$n1]."</br>");?></a>
		</td>
		<td>
		<?echo ($riga ['tag'][$n1]."</br>");?>	
		</td>
		<td>
		<?echo ($riga ['note'][$n1]."</br>");?>	
		</td>
		</tr>
		<?}?>
				
		</tbody>
		</table>
		</div>
		<?

	}

	
	function tablepertag ()
	{
	
	$tags = $this->querytags();
	for ( $n=0; $n <=$tags ['n']; $n++)
	{
		echo ("-->".$tags [$n]."<--</br>");
		// $riga = $conn->select_row('all','','');
		$this->table1($tags [$n]); 
	}
	}	
	


}