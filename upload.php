<?php
// per prima cosa verifico che il file sia stato effettivamente caricato
if (!isset($_FILES['userfile']) || !is_uploaded_file($_FILES['userfile']['tmp_name'])) {
  echo 'Non hai inviato nessun file...';
  
// file_put_contents(sys_get_temp_dir().'/file.txt', 'content');
  
  ?><pre><?
  print_r($_FILES);
  ?></pre><?
  exit;    
}

//percorso della cartella dove mettere i file caricati dagli utenti
$uploaddir = '/var/www/html/nodes/uploads/';
// $uploaddir = '/var/www/';

//Recupero il percorso temporaneo del file
$userfile_tmp = $_FILES['userfile']['tmp_name'];

//recupero il nome originale del file caricato
$userfile_name = $_FILES['userfile']['name'];

//copio il file dalla sua posizione temporanea alla mia cartella upload
if (move_uploaded_file($userfile_tmp, $uploaddir . $userfile_name)) {
  //Se l'operazione è andata a buon fine...
  echo 'File inviato con successo.';
  ?><pre><?
  print_r($_FILES);
  ?></pre><?
}else{
  //Se l'operazione è fallta...
  echo 'Upload NON valido!'; 
}
?>