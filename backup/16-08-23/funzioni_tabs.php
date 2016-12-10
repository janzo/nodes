<?

class tab
{
	function tab_pills ($tabtitle, 	// array dei titoli delle tabs
			    $tabid ,	// array degli id delle tabs
			    $taburl,	// array degli url dei files da caricare con ajax 	
			    $tabpost	// array delle stringhe post da inviare con ajax
			   )
	{
	$myconnesione = new connessione;
	$tags = $myconnesione->querytags();

?>	
	
	<div class="row" style="font-weight:bold;">
		<ul class="nav nav-pills nav-justified" id="tabHeader1" style="cursor: pointer;">
	
<?	
	$n=0;
	
	foreach ($tabtitle as $title) {
			
	
			$tag_a='<li';
			$tag_b='';
// 			if ($n==0) {$tag_b=' class="active"';} else {$tag_b='';}
			$tag_c= '><a onclick ="loadDoc(';
 			$tag_d="'".$taburl[$n]."', ";
 			$tag_e="'".$tabid[$n]."', ";
 			$tag_f="'".$tabpost[$n]."'";
			$tag_g=') "data-toggle="pill" href="#'.$tabid[$n].'">'.$title.'</a></li>';
			$li= $tag_a.$tag_b.$tag_c.$tag_d.$tag_e.$tag_f.$tag_g;
			echo $li;
			$n= $n+1;
		}
?>		
		
		</ul>
	</div>		
	
 	<div class="tab-content"> 
		<?
// 		for ( $n=0; $n <=$tags ['n']; $n++) 
		$n=0;
		foreach ($tabid as $id)
		{
		?>  

			<div id="<?echo ($id);?>" class="tab-pane fade<? //if ($n==0) {echo (' in active');}?>">	
			<? 
// 			echo ($id);
			$n =$n+1
			?>
			</div>
		<?
		}	
	?> 
	</div> 
	<?
	}
}