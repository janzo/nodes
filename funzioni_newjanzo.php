<?
include_once("funzioni_db.php");

class node
{
	function insert_node ($descr, $type=1, $content=null )
	{
		if ($type==1)
		{
		
			//è un link
			$url=$descr;
// 			$id= $this->get_by_url ($url, 'id');
// 			if ($id != null)
// 			{
// 				echo htmlspecialchars("Link già presente")." id: ".$id."</br>";
// 				$thisid = $id;
// 			}
// 			else
// 			{
			    $conn = new connessione();
			    $connins = $conn->connetti();
// 			    $titolo = $connins->real_escape_string(trovatitolo ($url));
			    $titolo = $connins->real_escape_string($this->trovatitolo ($url));
			    $toinsert = "INSERT INTO mynodes (type, description, content) VALUES ('$type', '$titolo', '$url')";

			  if ($connins->query($toinsert)) 
// 			  if ($conn->query($toinsert)) 
			    {
 			    $thisid = $this->get_by_url ($url, 'id');
			    echo (/*$connins->affected_rows.*/"<br>Nuovo link inserito: </br>");
			    }
			  else
			    {
			      echo ("<br>Inserimento non eseguito");
			      $thisid= null;
			    }
// 			    $connins->close();  
// 			}
			  $id = null;
 			return $thisid;
			
		      
		}
	}
      
      	function trovatitolo ($url)
	{
	  $source = file_get_contents ($url); //acquisisce il contenuto del file in una stringa
	// 
	if (preg_match ("/<title>(.*)<\/title>/", $source, $regs)) 
	{
	  $descr = $regs[1];
	} 
	else 
	{
	  $descr = $url;
	  echo "Titolo Non trovato<br>";	
	}
	return $descr;
	}
	
	function get_by_url ($url, $rowname)
	{  
	  $sql = "SELECT ".$rowname." FROM `mynodes` WHERE content= '".$url."'";
	  return $this->get_s ($sql, $rowname);
	}
	
	function get_s ($sql, $rowname)
	{
	  $connessione = new connessione();
// 	  $result = $connessione->connetti()->query($sql);
	  $result = $connessione->connetti()->query($sql);
	  if ($result->num_rows > 0) 
	  {
	    while($row = $result->fetch_assoc()) 
	    {
	      $risultato= $row[$rowname];
	    }
	  } 
	  else 
	  {
	    $risultato = null;
	  }
	  return $risultato;
	  $conn->close();
	}	
	
	
	
	
	
}












class link
{
	function insert_url_descr ($url) 
	{
	$id= $this->get_by_url ($url, 'id');
	if ($id != null)
	  {
	    echo htmlspecialchars("Link già presente")." id: ".$id."</br>";
	    $thisid = $id;
	  }
	else
	  {
	    $conn = new connessione();
 	    $connins = $conn->connetti();
// 	    $titolo = $connins->real_escape_string(trovatitolo ($url));
	    $titolo = $connins->real_escape_string($this->trovatitolo ($url));
	    $toinsert = "INSERT INTO mylinks (url, descr) VALUES ('$url', '$titolo')";

	  if ($connins->query($toinsert)) 
// 	  if ($conn->query($toinsert)) 
	    {
	    $thisid = $this->get_by_url ($url, 'id');
	    echo (/*$connins->affected_rows.*/"<br>Nuovo link inserito: </br>");
	    }
	  else
	    {
	      echo ("<br>Inserimento non eseguito");
	      $thisid= null;
	    }
// 	    $connins->close();  
	  }
	  $id = null;
	return $thisid;
	}
	function get_by_url ($url, $rowname)
	{  
	  $sql = "SELECT ".$rowname." FROM `mylinks` WHERE url= '".$url."'";
	  return $this->get_s ($sql, $rowname);
	}
	
	function get_s ($sql, $rowname)
	{
	  $connessione = new connessione();
// 	  $result = $connessione->connetti()->query($sql);
	  $result = $connessione->connetti()->query($sql);
	  if ($result->num_rows > 0) 
	  {
	    while($row = $result->fetch_assoc()) 
	    {
	      $risultato= $row[$rowname];
	    }
	  } 
	  else 
	  {
	    $risultato = null;
	  }
	  return $risultato;
	  $conn->close();
	}
		
	function stampa_link_da_id ($id)
	{
	    $result = null;
	    $descr = $this->get_by_id ($id, "descr");
	    $url = $this->get_by_id ($id, "url");
	    $tag = $this->get_by_id ($id, "tag");
	    $note = $this->get_by_id ($id, "note");
	    $id = $this->get_by_url($url, 'id');
	    if ($url!= null)
	    {
	      $result = "id: ".$id."<strong> #".$tag.": </strong><a href=".$url.">".$descr."</a>";
	      if ($note != null)
	      {
		$result = $result." (".$note.")</br>";
	      }
	      else
	      {
		$result = $result." </br>";
	      }
	    }
	    return $result;
	}

	function get_by_id ($id, $rowname)
	{
	  $sql = "SELECT `".$rowname."` FROM `mylinks` WHERE id=".$id;
	  return $this->get_s ( $sql, $rowname);
	}

	function trovatitolo ($url)
	{
	  $source = file_get_contents ($url); //acquisisce il contenuto del file in una stringa
	// 
	if (preg_match ("/<title>(.*)<\/title>/", $source, $regs)) 
	{
	  $descr = $regs[1];
	} 
	else 
	{
	  $descr = $url;
	  echo "Titolo Non trovato<br>";	
	}
	return $descr;
	}	
	
}



class tag 
{
	function tag_titles_4tabs ()
	{
// 	$myconnesione = new connessione;
	$tags = $this->querytags();
	for ( $n=0; $n <=$tags ['n']; $n++)
		{
			if ($tags [$n]=='')
			{
			$tagtitle[$n]='SenzaTAG';
			}else{
			$tagtitle [$n]= $tags [$n];
			}
		}
		
		
		
	return $tagtitle;
	}
	
	function tag_id_4tabs ()
	{
// 	$myconnesione = new connessione;
	$tags = $this->querytags();
	for ( $n=0; $n <=$tags ['n']; $n++)
		{
			$tagid [$n]= "tag".$n;
		}
	return $tagid;
	}
	
	function tag_url_4tabs ()
	{
// 	$myconnesione = new connessione;
	$tags = $this->querytags();
	for ( $n=0; $n <=$tags ['n']; $n++)
		{
		$tagurl[$n]='table.php';
		}
		
	return $tagurl;
	}	
	
	
	function tag_post_4tabs ()
	{
// 	$myconnesione = new connessione;
	$tags = $this->querytags();
	for ( $n=0; $n <=$tags ['n']; $n++)
		{
			if ($tags [$n]=='')
			{
// 			$tagtag [$n]='tag=SenzaTAG';
			$tagtag [$n]='SenzaTAG';
			}else{
// 			$tagtag [$n]= "tag=".$tags [$n];
			$tagtag [$n]= $tags [$n];
			}
		}
		
	return $tagtag;
	}
	
	function querytags ()
	{
	$conn = new connessione ();
 	$query = "SELECT DISTINCT tag FROM mylinks";
	$tags = $conn-> select_distinct($query);
	return $tags;
	}
	
	function table_links_by_tags ($tag)
	{
 	$myconnesione = new connessione;
	$tags = $this->querytags();
	if ($tag=="*"||$tag=="all")
	{
	      $riga = $myconnesione->select_row("all","","");
	}
	else
	{
	      $riga = $myconnesione->select_row('*','tag',$tag);
	
	}
		?>
		<div class="table-responsive table-scrollable"> 
		<table class="table table-condensed table-striped tablesorter ">
		<thead>
		<tr>
<!-- 		<th class="text-left">Id</th> -->
		<th class="text-left">Link</th>
<!-- 		<th class="text-left">Tag</th> -->
		<th class="text-left">Note</th>
		</tr>
		</thead>
		<tbody>
		<?for ( $n1=0; $n1 <=$riga ['n']; $n1++)
		{?>	
		<tr class= "active">
		
<!--		<td>
		<?echo ($riga ['id'][$n1]."</br>");?>
		</td>
-->
		<td>
		<a href="<?echo ($riga ['url'][$n1]);?>"  
		><?echo ($riga ['descr'][$n1]."</br>");?></a>
		</td>
		
<!--		<td>
		<?echo ($riga ['tag'][$n1]."</br>");?>	
		</td>
-->
		
		<td>
		<small><?echo ($riga ['note'][$n1]."</br>");?></small>	
		</td>
		</tr>
		<?}?>
				
		</tbody>
		</table>
		</div>
		<?
	}
	
}

?>