<?php 
require_once($_SERVER["DOCUMENT_ROOT"]."/function/redirectToLoginPage.php");
$optionWartosc=array("GB","TB"); ?>

<div class="mt-5"><center><p class="P_MAIN">
	<?php //echo  $_GET["id"]." - ".$_SERVER['HTTP_HOST']."<br/>".$_SERVER['REQUEST_URI']."</br>";?>
	
	GOP - zgłaszanie Projektu:</p>
	<!-- <form method="POST" action=""> -->
	<form action="" method="POST" id="addFormProject">
    	<table>
			<tr>
				<td rowspan="6" style="padding-right:30px;"><img src="gt_utilities/gt_logo_przez_160x100.png" alt="Logo_Geofizyka_Torun"></br></td>
			</tr>
			<tr>
				<td><p class="p_inp_20"><span class="S_LEGENDA">*</span>Nazwa projektu:</p></td>
				<td>
					<input class="inpText_592 validate[required, maxSize[100]]" type="text" name="nazwaProjektu" id="nazwaProjektu" value=""/>
					<?php 
						if(isset($_POST["nazwaProjektu"]) && $_POST["nazwaProjektu"]!=trim('') ) 
						{
							
							echo '<br/><span style="margin-top:10px; color:#8c8c8c; font-size:16px; font-weight:bold;">Ostatnio zgłoszony projekt - '.$_POST["nazwaProjektu"].'</span>';
						};
					?>
					<!-- DIV WARNING -->
					<div id="divErr">
								<span class="S_LOAD_ERR" id="nowy_projekt_warn"></span><span id="nowy_projekt_name"></span>
					</div>
					<!-- END DIV WARNING -->
				</td>
			<tr>
				<td>
				
			
				<p class="p_inp_20"><span class="S_LEGENDA">*</span>Rozmiar pliku bazowego:</p></td>
				<td >
			
					<input class="inpText_532 validate[custom[integer], required, maxSize[20]]" type="text" name="rozmiarPlik" id="rozmiarPlik" maxlength="20" value=""/><select class="SEL_JED" name="rozmiarJednostka">
					<?php
					if(isset($_POST['rozmiarJednostka']))
					{
						//echo "<optgroup label=\"Aktualny :\" class=\"OPTGROUP\">";
						//$optionWartosc=explode('|',$_POST['rozmiarJednostka']);
						//echo "<option value=\"".$optionWartosc[0]."|".$optionWartosc[1]."\">".$optionWartosc[1]."</option>";
						echo "<option value=\"".$_POST['rozmiarJednostka']."\">".$_POST['rozmiarJednostka']."</option>";
						//echo $_POST['rozmiarJednostka']
					};
					?>
					<!-- <optgroup label="Dostępne :" class="OPTGROUP"> -->
					<?php 
					foreach($optionWartosc as $jednostkaWybor)
					{
						if(!isset($_POST['rozmiarJednostka']) )
						{
							echo "<option value=\"".$jednostkaWybor."\">".$jednostkaWybor."</option>";
						}
						else
						{
							if($_POST['rozmiarJednostka']!=$jednostkaWybor)
							{
								echo "<option value=\"".$jednostkaWybor."\">".$jednostkaWybor."</option>";
							}
						}
					}
					?>
					</select>
					
					<?php
						if(isset($_POST["rozmiarPlik"]) && $_POST["rozmiarPlik"]!=trim('') )
						{
							
							echo '<br/><span style="margin-top:10px;color:#8c8c8c; font-size:16px; font-weight:bold;">Rozmiar zgłaszanego projektu - '.$_POST["rozmiarPlik"].' '.$_POST['rozmiarJednostka'].'</span>';
						};
					?>
				</td>
			</tr>
			<tr>
				<td><p class="p_inp_20"><span class="S_LEGENDA">*</span>Lista przypisanych pracowników:</p></td>
				<td>
					<textarea name="przypisaniPracownicy" id="przypisaniPracownicy" class="textArea validate[required, maxSize[1024]]"></textarea> <!-- validate[required, maxSize[1024]] -->
					<?php
						if(isset($_POST["przypisaniPracownicy"]) && $_POST["przypisaniPracownicy"]!=trim('') )
						{
							
							echo '<br/><span style="margin-top:10px;color:#8c8c8c; font-size:16px; font-weight:bold;">Przypisani użytkownicy - '.$_POST["przypisaniPracownicy"].'</span>';
						};
						?>
							<!-- DIV WARNING -->
					<div id="divErr2">
								<span class="S_LOAD_ERR" id="przypisaniPracownicy_warn"></span><span id="przypisaniPracownicy_name"></span>
					</div>
					<!-- END DIV WARNING -->
				</td>
			</tr>
			<tr height="40px">
				<td>&nbsp;</td>
				<td>
				<input type="hidden" name="host" id="host" value="HTTP://<?php echo $_SERVER['HTTP_HOST']; ?>"></input>
				<input type="hidden" name="username" id="username" value="<?php echo $_SESSION['username']; ?>"/>
				<input class="inp_szukaj" type="Submit" value="Zgłoś" name="zglos">
				</td>
			</tr>
			<tr>
			<td colspan="2"><p class="P_LEGENDA">Legenda:
				<br/><span class="S_LEGENDA">-</span> Pola z sumbolem (<span class="S_LEGENDA">*</span>) wymagane;
				<br/><span class="S_LEGENDA">-</span> Przykładowa nazwa projektu - <span class="S_LEGENDA">PGNIG_Test-Torun_3D_2018</span>;
				<br/><span class="S_LEGENDA">-</span> Nazwa projektu może się zaczynać i kończyć na - <span class="S_LEGENDA">' a-Z , 0-9 '</span>;
				<br/><span class="S_LEGENDA">-</span> Nazwa projektu może zawierać  - <span class="S_LEGENDA">' a-Z , 0-9 , _ , - '</span>;
				<br/><span class="S_LEGENDA">-</span> Rozmiar pliku bazowego - <span class="S_LEGENDA">wartość całkowitoliczbowa</span>;
				<br/><span class="S_LEGENDA">-</span> W polu zgłaszane osoby rozpoczynamy jak i kończymy wprowadzanie symbolem - <span class="S_LEGENDA">' a-Z '</span>;
				<br/><span class="S_LEGENDA">-</span> W polu zgłaszane osoby można użyć symboli - <span class="S_LEGENDA">' a-Z , 0-9 , @ , _ , - , . , , '</span>;
				<br/><span class="S_LEGENDA">-</span> Białe znaki w nazwie Projketu są automatycznie usuwane (<span class="S_LEGENDA">spacja, tabulacja</span>);
				</p></td>
				<td>&nbsp;
				</td>
			</tr>
		</table>
		
    </form>
    </center></div>