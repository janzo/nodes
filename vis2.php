<!doctype html>
<html>
<head>
  <title>Prove</title>

<?php
// PHP array
$products = array(
    // product abbreviation, product name, unit price
    array('choc_cake', 'Chocolate Cake', 15),
    array('carrot_cake', 'Carrot Cake', 12),
    array('cheese_cake', 'Cheese Cake', 20),
    array('banana_bread', 'Banana Bread', 14)
   
);

echo json_encode( $products )
?>
<script type="text/javascript">
// pass PHP array to JavaScript array
var products = <?php echo json_encode( $products ) ?>;

// result seen through view source
// var products = [["choc_cake","Chocolate Cake",15],["carrot_cake","Carrot Cake",12],["cheese_cake","Cheese Cake",20],["banana_bread","Banana Bread",14]];

// how to access elements in multi-dimensional array in JavaScript
alert( products[0][1] ); // Chocolate Cake
</script>  
</body>
</html>