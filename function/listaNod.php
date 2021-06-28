<?php
if(!defined("DR")){
    die('Direct access not permitted');
}
else{
    require_once(DR."/function/redirectToLoginPage.php");
    require_once(DR."/.cfg/config.php");
} 
$dbLink=NEW initialDb();
/*
 * CREATE SELECT OPTION LIST
 */
function createOption($tabDane)
{
    // Pracownie nazwa
    // Klaster nod
    $tmpId=(integer)0;
    $tmpNazwa=(string)"";
    $option=(string)"";

    foreach($tabDane as $wartosc)
    {
        foreach($wartosc as $kluczTab => $wartoscTab)
        {
            //echo "kluczTab - ".$kluczTab." - ".$wartoscTab."<br/>";
            if($kluczTab=='id') {$tmpId=$wartoscTab;} 
            if($kluczTab=='nazwa' || $kluczTab=='nod') {$tmpNazwa=$wartoscTab;}
        }
        $option.="<option value=\"".$tmpId."|".$tmpNazwa."\">".$tmpNazwa."</option>";
    }
    return $option;
}
$dbLink->query('SELECT id,nod,pracownia FROM klaster WHERE 1=? group by id','1');
$tablicaKlaster= $dbLink->queryReturnValue();

$dbLink->query('SELECT id,nazwa FROM pracownia WHERE WSK_U=? ORDER BY id','0');
$tablicaPrac=$dbLink->queryReturnValue();

$optionKlaster=(string)createOption($tablicaKlaster);
$optionPrac=(string)createOption($tablicaPrac);
