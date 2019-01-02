<?php
if(ISSET($_POST["rezerwuj"]))
{	//echo "Wcisnieto \"rezerwuj\"</br>";
//echo "<p class=\"P_LOAD_FILE\"><span class=\"S_LOAD_OK\">Załadowano funkcję </span>- ".basename(__FILE__,'.php')."</p>";
foreach($_POST as $id => $wartosc)
{
	//echo "[$id] $wartosc</br>";
};
$dataNod0=(array)explode('|',$_POST["nod0"]);
$dataNod1=(array)explode('|',$_POST["nod1"]);
$dataPrac=(array)explode('|',$_POST["pracownia"]);		
if($dataNod0[0] <= $dataNod1[0])
{
	$updateNod="UPDATE `klaster` SET `pracownia`='".$dataPrac[0]."' WHERE `id`>='".$dataNod0[0]."' AND `id`<='".$dataNod1[0]."' ";
	//echo "nod0 <= nod1 </br>";
}
else //$_POST["nod0"] > $_POST["nod1"]
{
	$updateNod="UPDATE `klaster` SET `pracownia`='".$dataPrac[0]."' WHERE `id`>='".$dataNod1[0]."' AND `id`<='".$dataNod0[0]."' "; 
	//echo "nod0 > nod1 </br>";
};

if($_SESSION["PHPV"]<7.0)
	{	
		$result = mysqli_query($connection,$updateNod) or die ('Zapytanie zakończone niepowodzeniem: ' . mysql_error($connection));
	}
	else
	{
		$result = mysqli_query($connection,$updateNod) or die ('Zapytanie zakończone niepowodzeniem: ' . mysqli_error($connection));
	};
};
?>
