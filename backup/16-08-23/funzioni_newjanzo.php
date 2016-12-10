<?

class tag
{
	function tag_titles_4tabs ()
	{
	$myconnesione = new connessione;
	$tags = $myconnesione->querytags();
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
	$myconnesione = new connessione;
	$tags = $myconnesione->querytags();
	for ( $n=0; $n <=$tags ['n']; $n++)
		{
			$tagid [$n]= "tag".$n;
		}
	return $tagid;
	}
	
	function tag_url_4tabs ()
	{
	$myconnesione = new connessione;
	$tags = $myconnesione->querytags();
	for ( $n=0; $n <=$tags ['n']; $n++)
		{
		$tagurl[$n]='table.php';
		}
		
	return $tagurl;
	}	
	
	
	function tag_post_4tabs ()
	{
	$myconnesione = new connessione;
	$tags = $myconnesione->querytags();
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
	
}
?>