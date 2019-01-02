<?php
require_once($_SERVER["DOCUMENT_ROOT"]."/function/redirectToLoginPage.php");
        
$optionWartosc=array(); 
        
?>
	<div class="mt-5 w-100"><center><p class="pt-5 P_MAIN">
	<?php //echo  $_GET["id"]." - ".$_SERVER['HTTP_HOST']."<br/>".$_SERVER['REQUEST_URI']."</br>";?>
	
	Rezerwacje klastra:</p>
	<form method="POST" action="">
    	<table >
	<tr><td rowspan="4" style="padding-right:30px;"><img src="gt_utilities/gt_logo_przez_160x100.png" alt="Logo_Geofizyka_Torun"></br></td></tr>
    	<tr>
   	<td><p class="p_inp_20">Wskaż zakres nodów:</p></td>
	<td>
	<?php
	for($i=0;$i<2;$i++)
	{
		echo "<select class=\"SEL_NOD\" name=\"nod".$i."\">";
		if(ISSET($_POST['nod'.$i]))
		{
			echo "<optgroup label=\"Aktualny :\" class=\"OPTGROUP\">";
			$optionWartosc=explode('|',$_POST['nod'.$i]);
			echo "<option value=\"".$optionWartosc[0]."|".$optionWartosc[1]."\">".$optionWartosc[1]."</option>";
		};
		echo "<optgroup label=\"Dostępne :\" class=\"OPTGROUP\">";	
		echo $optionKlaster;
		echo "</select>";
	};
	?>
	</td>
    	<tr>
   	<td><p class="p_inp_20">Wskaż pracownie:</p></td>
	<td>
	<select class="SEL_PRAC" name="pracownia">
	<?php
	if(ISSET($_POST['pracownia']))
	{
		echo "<optgroup label=\"Aktualny :\" class=\"OPTGROUP\">";
		$optionWartosc=explode('|',$_POST['pracownia']);
		echo "<option value=\"".$optionWartosc[0]."|".$optionWartosc[1]."\">".$optionWartosc[1]."</option>";
	};
	?>
	<optgroup label="Dostępne :" class="OPTGROUP">
	<?php echo $optionPrac; ?>
	</select>
	</td>
	</tr>
    	<tr height="40px">
    	<td>&nbsp;</td><td><input class="inp_szukaj" type="Submit" value="Rezerwuj" name="rezerwuj"></td>
    	</tr>
	<td></td><td></td><td>
	<!-- <p class="P_LEGENDA"><span class="S_LEGENDA">*</span> Można wyszukiwać po fragmencie (symbol - <span class="S_LEGENDA">%</span>).</p>-->
	</td>
	<tr>
	</tr>
    	</table>
    	</form>
    	</center></div>