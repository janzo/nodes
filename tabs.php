	
<script src="jsjanzo/tabs.js"></script>
<!-- <div class="container"> -->
<? 

include_once("funzioni_tabs.php"); 
include_once("funzioni_newjanzo.php"); 
$mytag = new tag;
$title = $mytag->tag_titles_4tabs();
$id = $mytag->tag_id_4tabs ();
$url = $mytag->tag_url_4tabs ();
$post = $mytag->tag_post_4tabs ();
$mytab = new tab;
$mytab->tab_pills ($title, $id, $url, $post);

?>
