<?php
// if(!defined("SERVER")){define("SERVER", "localhost");}
// if(!defined("USER")){define("USER", "root");}
// if(!defined("PASS")){define("PASS", "");}
// if(!defined("DB")){define("DB", "links");}
// print_r(get_defined_constants(true));


class connessione 
{

const SERVER = "localhost";
const USER = "root";
const PASS = "";
const DB = "nodes";

// public $conn="";

	public function __construct (){
	$this->conn = $this-> connetti();
	}
	
	public function __destruct (){
	mysqli_close($this->conn);
	}
	
	public function connetti ()
	{
		$link =  new mysqli(self::SERVER, self::USER, self::PASS, self::DB);
		if ($link->connect_errno) {
			printf("Connect failed: %s\n", $mysqli->connect_error);
			exit();
 		}
	  // 		echo "Success: A proper connection to MySQL was made! The my_db database is great." . PHP_EOL;
	  // 		echo "Host information: " . mysqli_get_host_info($link) . PHP_EOL;
		
	return $link;	
	}

	function select_row ($campo,$campo_condizione, $valore_condizione)
	{	
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
	
	if ($this->conn->multi_query($query)) {
	    do {
		/* store first result set */
		if ($result = $this->conn->use_result()) {
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
	    } while ($this->conn->next_result());
	}
	$myrow ['n'] = $n-1;
	return $myrow;
	}
	

	function select_distinct ($query)
	{	
	    $n = 0;
	    if ($this->conn->multi_query($query)) 
	    {
		do 
		{
		    /* store first result set */
		    if ($result = $this->conn->use_result()) 
		    {
			while ($row = $result->fetch_row()) 
			{
			    $array[$n]=$row[0];
			    $n =$n+1;	
			}
		    }
		} while ($this->conn->next_result());
		$array["n"]= $n-1;
		return $array;
		$result->close();
	    }
	}

	function select1 ($query)
	{	
	    $n = 0;
	    if ($this->conn->multi_query($query)) 
	    {
		do 
		{
		    /* store first result set */
		    if ($result = $this->conn->use_result()) 
		    {
			while ($row = $result->fetch_row()) 
			{
			    $array[$n]=$row;
			    $n =$n+1;	
			}
		    }
		} while ($this->conn->next_result());
// 		$array["n"]= $n-1;
		return $array;
		$result->close();
	    }
	}

	
	
	
}

