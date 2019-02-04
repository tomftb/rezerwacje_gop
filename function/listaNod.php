<?php

/*---------------------- SELECT DATA ---------------------------*/
function selectData($selectSQL,$connection)
{
	$option=(string)"";
	$first=(boolean)TRUE;
	$selected='selected="selected"';
	$i=(integer)0;
	$j=(integer)0;
        $tablicaWynik=array();
        $connection->query($selectSQL,'1');
    	$data=$connection->queryReturnValue();
        echo "<pre>";
        //print_r($data);
        echo "</pre>";
        $num_rows = count($data);
	
	if ($num_rows > 0) 
	{
                foreach($data as $klucz=> $wartosc)
		{
                    //echo "i - ${i} , ${klucz} , ".$wartosc['nod']," <br/>";
                    $tablicaWynik[$klucz][$klucz]=$wartosc['nod'];
                    $j++;
		}
		$i++;
		$j=0;
	};

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
		};
		$option.="<option value=\"".$tmpId."|".$tmpNazwa."\">".$tmpNazwa."</option>";
	};
return $option;
}
$tablicaPrac=array();
$tablicaKlaster=array();
$tablicaKlaster=selectData("SELECT id,nod,pracownia FROM klaster WHERE 1=? group by id",$dbLink);
$tablicaPrac=selectData("SELECT id,nazwa FROM pracownia WHERE WSK_U=? ORDER BY id ",$dbLink);
$optionKlaster=(string)createOption($tablicaKlaster);
$optionPrac=(string)createOption($tablicaPrac);
//mysqli_close($connection);
?>
