<?php
if (session_status() == PHP_SESSION_NONE) {
    session_start();
}
// PHP < 5.4.0
if(session_id() == '') {
    session_start();
}
$DOC_ROOT=filter_input(INPUT_SERVER,"DOCUMENT_ROOT");
require_once($DOC_ROOT."/function/redirectToLoginPage.php");
require_once($DOC_ROOT.'/function/checkPerm.php');
//date_default_timezone_set("Europe/Warsaw");
require_once($DOC_ROOT.'/function/checkFile.php');
//echo $_GET['username']."\n";
//die('STOP');
if(isset($_GET['dataToCheck']) && isset($_GET['type'])) 
{
	$dataToCheck = trim($_GET['dataToCheck']); //id to check
	$type=$_GET['type'];
	//echo "type - ".$type."\ndata to check - ".$dataToCheck."\n";
}
else
{
	exit("No data to check or not isset type ");
	//echo "NOT isset dataToCheck or type<br/>";
}
//die('STOP2<br/>');
/*############################################################################################## INCLUDE CONFIG DATABASE ##############################################################################################*/

if(checkFile($DOC_ROOT.'/.cfg/config.php')) include_once($DOC_ROOT.'/.cfg/config.php');
		
/*############################################################################################## END INCLUDE CONFIG DATABASE ##########################################################################################*/

if(checkPerm('LOG_INTO_ZGL_PROJ',$_SESSION['perm'],0))  
//if($user_logged_in)
{
		switch ($type):
		
					case 1: // CHECK DATABASE ONLY;
						break;
					case 2:
							// CHECK preg_match ONLY;
							/**/
							if(preg_match("/^([a-zA-ZąĄćĆęĘłŁńŃóÓśŚżŻźŹ])([a-zA-Z]*(\,)*[ąĄćĆęĘłŁńŃóÓśŚżŻźŹ]*(\ )*(\.)*(\@)*(\_)*(\-)*)*([a-zA-ZąĄćĆęĘłŁńŃóÓśŚżŻźŹ])$$/x",$dataToCheck))
							{
								// echo "preg_match ok";
							}
							else
							{
								echo "<span style=\"color:red\">W polu występują niedozwolone symbole albo niepoprawna składnia - </span>".$dataToCheck;
							};
							
						break;
					case 3:
							//ECHO "'ą','ć','ę','ł','ń','ó','ś','ź','ż','Ą','Ć','Ę','Ł','Ń','Ó','Ś','Ź','Ż'";
							// CHECK DATABASE AND preg_match;
							$tabPL=array('/ą/','/ć/','/ę/','/ł/','/ń/','/ó/','/ś/','/ź/','/ż/','/Ą/','/Ć/','/Ę/','/Ł/','/Ń/','/Ó/','/Ś/','/Ź/','/Ż/');
							$tabANG=array('a','c','e','l','n','o','s','z','z','A','C','E','L','N','O','S','Z','Z');
							$dataToCheck=preg_replace($tabPL,$tabANG,$dataToCheck);
							if(preg_match("/^([a-zA-Z]|(\d))([a-zA-Z]*(\d)*(\_)*(\-)*)*([a-zA-Z]|\d)$/",$dataToCheck))
							{
                                                            $dbLink->query('SELECT * FROM projekt WHERE UPPER(NAZWA)=UPPER(TRIM(?)) ',$dataToCheck);
                                                            
                                                            if(count($dbLink->queryReturnValue())>0)
                                                            {
                                                                echo "<span style=\"color:red\">W bazie danych istnieje już rekord o podanej nazwie - </span>".$dataToCheck;
                                                            };
								// CHECK IN DB
								
							}
							else
							{
								echo "<span style=\"color:red\">W polu występują niedozwolone symbole albo niepoprawna składnia - </span>".$dataToCheck;
							}
						break;
					default:
							// WRONG
							exit("Wrong type data to check");
						break;
		endswitch;
		
	//die('STOP');
}//user 
else
{
	//brak uprawnien
        echo '<div class="alert alert-danger row">';
	echo "[LOG_INTO_ZGL_PROJ] Brak uprawnien\n";
        echo "</div>";
}
