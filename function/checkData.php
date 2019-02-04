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
$updateNodValue="";
if($dataNod0[0] <= $dataNod1[0])
{
    $updateNodValue=$dataPrac[0].",".$dataNod0[0].",".$dataNod1[0];
}
else
{
        $updateNodValue=$dataPrac[0].",".$dataNod1[0].",".$dataNod0[0];
};
    $updateNod="UPDATE klaster SET pracownia=? WHERE id>=? AND id<=? ";
    $dbLink->query($updateNod,$updateNodValue);
};
?>
