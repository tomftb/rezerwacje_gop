<?php
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
                    //echo "kluczTab - ".$kluczTab." - ".$wartoscTab."<br/>";
                    if($kluczTab=='id') $tmpId=$wartoscTab; 
                    if($kluczTab=='nazwa' || $kluczTab=='nod') $tmpNazwa=$wartoscTab;
		};
		$option.="<option value=\"".$tmpId."|".$tmpNazwa."\">".$tmpNazwa."</option>";
	};
return $option;
}
$tablicaPrac=array();
$tablicaKlaster=array();
$dbLink->query('SELECT id,nod,pracownia FROM klaster WHERE 1=? group by id','1');
$tablicaKlaster= $dbLink->queryReturnValue();

$dbLink->query('SELECT id,nazwa FROM pracownia WHERE WSK_U=? ORDER BY id','0');
$tablicaPrac=$dbLink->queryReturnValue();

$optionKlaster=(string)createOption($tablicaKlaster);
$optionPrac=(string)createOption($tablicaPrac);
?>
