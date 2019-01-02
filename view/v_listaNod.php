<?php require_once($_SERVER["DOCUMENT_ROOT"]."/function/redirectToLoginPage.php"); ?>

<center><table class="t_main">	
	<tr>
	<th colspan="10"><p class="p_24_b">Aktualny przydział nodów:</p>
	</th>
	</tr>
	<tr>
	<th class="th_main" width="200px">Pracownia :</th>
	<th class="th_main" width="600px">Przypisane nody :</th>
        </tr>
		
<?php
	/* PONOWNE WYWOLANIE W CELU AKTUALIZACJI DANYCH */	
	$tablicaKlaster=selectData("SELECT `id`,`nod`,`pracownia` FROM `klaster` ORDER BY `id`",$connection);
	$tablicaPrac=selectData("SELECT `id`,`nazwa` FROM `pracownia` WHERE `WSK_U`=0 ORDER BY `id` ",$connection);
	foreach($tablicaPrac as $klucz=> $wartoscPrac)
	{
		echo "<tr>";
		//Pracownie		
		echo "<td class=\"td_main\" width=\"200px\">".$wartoscPrac['nazwa']."</td>";
		//Przypisane klastry
		echo "<td class=\"td_main\" width=\"600px\">";
		foreach($tablicaKlaster as $wartoscKlastr)
		{
			if($wartoscPrac['id']==$wartoscKlastr['pracownia']) echo $wartoscKlastr['nod'].", ";
			
		};
		echo "</td>";
		echo "</tr>";
	};
?>
	</table>
