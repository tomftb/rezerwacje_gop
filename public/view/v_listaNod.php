<?php 
if(!defined("DR")){
    die('Direct access not permitted');

}
else{
    require_once(DR."/function/redirectToLoginPage.php");
} 
?>
<center>
    <table class="t_main" style="margin-top:0px;">	
	<tr>
            <th colspan="2">
                <h2 class="text-center pt-1">Aktualny przydział nodów:</h2>
            </th>
	</tr>
	<tr>
            <th class="th_main" width="200px">
                <h5 class="text-center pt-1">Pracownia :</h5>
            </th>
            <th class="th_main" width="600px">
                <h5 class="text-center pt-1">Przypisane nody :</h5>
            </th>
        </tr>	
<?php
	/* PONOWNE WYWOLANIE W CELU AKTUALIZACJI DANYCH */	
       
        $dbLink->query('SELECT id,nod,pracownia FROM klaster WHERE 1=? group by id','1');
        $tablicaKlaster= $dbLink->queryReturnValue();

        $dbLink->query('SELECT id,nazwa FROM pracownia WHERE WSK_U=? ORDER BY id','0');
        $tablicaPrac=$dbLink->queryReturnValue();
	foreach($tablicaPrac as $klucz=> $wartoscPrac){
		echo "<tr>";
		//Pracownie		
		echo "<td class=\"td_main\" width=\"200px\">".$wartoscPrac['nazwa']."</td>";
		//Przypisane klastry
		echo "<td class=\"td_main\" width=\"600px\">";
		foreach($tablicaKlaster as $wartoscKlastr)
		{
                        if($wartoscPrac['id']==$wartoscKlastr['pracownia']) {echo $wartoscKlastr['nod'].", ";}
		}
		echo "</td>";
		echo "</tr>";
	}
?>
	</table>
</center>