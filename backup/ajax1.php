<h2>AJAX</h2>

<button type="button" onclick="loadDoc()">Request data</button>

<p id="demo"></p>
 
<script>
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      document.getElementById("tag0").innerHTML = xhttp.responseText;
    }
  };
  xhttp.open("POST", "table.php", true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send("tag=mysql&id=1");
}
</script>

<!-- _________________________________________________________________ -->


<script>
function loadDoc(url, cfunc) {
  post = "tag=mysql&id=1";
  var xhttp;
  xhttp=new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      cfunc(xhttp);
    }
  };
  xhttp.open("POST", url, true);
  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(post);
}

function myFunction(xhttp) {
  tag = "tag0";
  document.getElementById(tag).innerHTML = xhttp.responseText;
}
</script>
