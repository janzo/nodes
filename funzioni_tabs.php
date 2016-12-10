<script src="jsjanzo/tabs.js"></script>

<style>
div.tab-pane  {
    padding-top: 20px;
}


</style>


<?

class tab 
{
	function tab_pills ($tabtitle, 	// array dei titoli delle tabs
			    $tabid ,	// array degli id delle tabs
			    $taburl,	// array degli url dei files da caricare con ajax 	
			    $tabpost	// array delle stringhe post da inviare con ajax
			   )
	{

		?>	
		<div class="row" style="font-weight:bold;">
			<ul class="nav nav-pills nav-justified" id="tabHeader1" style="cursor: pointer;">
		<?
		
		$n=0;
		
		foreach ($tabtitle as $title) {
				$tag_a='<li';
 				if ($n==0) {$tag_b=' class="active"';} else {$tag_b='';}
				$tag_c= '><a data-toggle="pill" href="#'.$tabid[$n].'">'.$title.'</a></li>';
				$li= $tag_a.$tag_b.$tag_c;
				echo $li;
				$n= $n+1;
			}
		$count = $n;	
		?>		
			</ul>
		</div>		
		<div class="tab-content"  > 
		
			<?
			$n=0;
			foreach ($tabid as $id)
			{
			?>  
				<div id="<?echo ($id);?>" class="tab-pane fade <? if ($n==0) {echo (' in active');}?>" style  "padding-top:100px;" >	
				<? 
				$n =$n+1
				?>
				</div>
			<?}?>
		</div><?
		$n=0;
		foreach ($tabid as $id)
		{
		?><script> loadDoc(<? echo "'".$taburl[$n]."'";?>, <? echo "'".$id."'";?>, <? echo "'".$tabtitle[$n]."'";?>); </script>	<?
		$n++;
		}
	}
} /*end class*/