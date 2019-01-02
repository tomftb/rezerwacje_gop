<?php
if(isset($_SESSION["permission"]) && ($_SESSION["permission"]=="yes") && ($_SESSION["username"]!=""))
{
$optionWartosc=array();
?>
	<div>
	<p class="p_info_18">Aktualnie zalogowany użytkownik - <span class="s_info_o">
	<?php echo $_SESSION["username"]; ?>
	</span><span class="s_float_right">
	<a href="index.php?logout=t" class="a_logout">Logout</a>
	</span></p>
	</div>
	<div class="d_input_belt">
		<div class="d_inside_input">
			<a class="a_input_belt" href="HTTP://<?php echo  $_SERVER['HTTP_HOST']."?id=1"; ?>">Rezerwacje klastra</a><a class="a_input_belt" href="HTTP://<?php echo  $_SERVER['HTTP_HOST']."?id=2"; ?>">Zgłoś projekt</a>
		</div>
	</div>
	<?php
	$idPage=1;
	if(isset($_GET["id"])) $idPage=$_GET["id"];
	
	switch ($idPage):
				default:
				case 1:
						if(checkFile('function/listaNod.php')) include('function/listaNod.php');
						if(checkFile(include("view/rezerwacje.php")));
						if(ISSET($_POST["rezerwuj"]))
						{	//echo "Wcisnieto \"rezerwuj\"</br>";
							if(checkFile('function/checkData.php')) include('function/checkData.php');
						};
						if(checkFile('view/v_listaNod.php')) include('view/v_listaNod.php');
						
					break;
				case 2:
						echo $idPage;
					break;
	endswitch;				
	?>
	
	
<?php	
}
else
{
	if(checkFile('view/no_auth.php')) include('view/no_auth.php');
};
?>
