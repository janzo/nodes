<?
class tag
{
	function tag4tabs ()
	{
	$myconnesione = new connessione;
	$tags = $myconnesione->querytags();	
	
	
	
	
	}


}




class tab
{
	function tab_pills ()
	{
	$myconnesione = new connessione;
	$tags = $myconnesione->querytags();

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
	
 	<div class="tab-content"> 
		<?
		for ( $n=0; $n <=$tags ['n']; $n++) 
		{
		?>  
			<div id="<?if ($tags [$n]==""){echo ('SenzaTAG');}else{echo ($tags [$n]);}?>" class="tab-pane fade <? if ($n==0) {echo ('in active');} ?>">
			<? $myconnesione->table1($tags [$n]); ?>
			</div>
		<?
		}	
	?> 
	</div> 
	<?
	}
}