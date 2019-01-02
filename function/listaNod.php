<?php

/*---------------------- SELECT DATA ---------------------------*/
function selectData($selectSQL,$connection="")
{
	$option=(string)"";
	$first=(boolean)TRUE;
	$selected='selected="selected"';
	$i=(integer)0;
	$j=(integer)0;
	if($_SESSION["PHPV"]<7.0)
	{	
		$result = mysqli_query($connection,$selectSQL) or die ('Zapytanie zakończone niepowodzeniem: ' . mysqli_error($connection));
		$num_rows = mysqli_num_rows($result);
	}
	else
	{
		$result = mysqli_query($connection,$selectSQL) or die ('Zapytanie zakończone niepowodzeniem: ' . mysqli_error($connection));
		$num_rows = mysqli_num_rows($result);
	}	
	if ($num_rows > 0) 
	{
		if($_SESSION["PHPV"]<7.0)
		{
			while ($wynikSQL = mysqli_fetch_array($result, MYSQLI_ASSOC))
			{
				/*
				IF($_SESSION["username"]=="tborczynski")
				{
					echo "[id] $wynikSQL[0] |";
					echo "[nod] - ".$wynikSQL[1]." | ";
					echo "[pracownia] - ".[2]."</br>";
				};
				*/
				//$option.="<option class=\"OPT_NOD\" value=".$wynikSQL['id'].">".$wynikSQL['nod']."</option>";
				foreach($wynikSQL as $klucz=> $wartosc)
				{
					$tablicaWynik[$i][$klucz]=$wartosc;
					$j++;
				}
				$i++;
				$j=0;
			};//WHILE
		}//IF PHP 7
		else
		{
			while ($wynikSQL = mysqli_fetch_array($result, MYSQLI_ASSOC))
			{
				/*
				IF($_SESSION["username"]=="tborczynski")
				{
					echo "[id] ".$wynikSQL['id']." |";
					echo "[nod] - ".$wynikSQL['nod']." | ";
					echo "[pracownia] - ".$wynikSQL['pracownia']."</br>";
				};
				*/
				foreach($wynikSQL as $klucz =>$wartosc)
				{
					$tablicaWynik[$i][$klucz]=$wartosc;
					$j++;
				}
				$i++;
				$j=0;
			};//WHILE
			
		};//ELSE
	};
/*
echo "[".basename(__FILE__)."]Wynik SQL</br>";
foreach($tablicaWynik as $klucz=> $wartosc)
{
	echo "$klucz - ";
	foreach($wartosc as $klucz2 => $wartosc2)
	{
		echo $wartosc2.",";
	};
	echo "</br>";
};
*/
return (array)$tablicaWynik;
}
function createOption($tabDane)
{
// Pracownie nazwa
// Klaster nod
$tmpId=(integer)0;
$tmpNazwa=(string)"";
	$option=(string)"";

	foreach($tabDane as $klucz =>$wartosc)
	{

		foreach($wartosc as $kluczTab => $wartoscTab)
		{
			if($kluczTab=='id') $tmpId=$wartoscTab; 
			if($kluczTab=='nazwa' || $kluczTab=='nod') $tmpNazwa=$wartoscTab;
			//echo $kluczTab.": ".$wartoscTab.", ";
			
		};
		$option.="<option value=\"".$tmpId."|".$tmpNazwa."\">".$tmpNazwa."</option>";
		//echo "</br>";
		
	};
return $option;
}
$tablicaPrac=array();
$tablicaKlaster=array();
$tablicaKlaster=selectData("SELECT `id`,`nod`,`pracownia` FROM `klaster` ORDER BY `id`",$connection);
$tablicaPrac=selectData("SELECT `id`,`nazwa` FROM `pracownia` WHERE `WSK_U`=0 ORDER BY `id` ",$connection);
$optionKlaster=(string)createOption($tablicaKlaster);
$optionPrac=(string)createOption($tablicaPrac);
//mysqli_close($connection);
?>
