<?php
session_start();
$DOC_ROOT=filter_input(INPUT_SERVER,"DOCUMENT_ROOT");
require_once($DOC_ROOT."/function/redirectToLoginPage.php");
require_once($DOC_ROOT.'/function/checkPerm.php');
//date_default_timezone_set("Europe/Warsaw");
require($DOC_ROOT.'/function/checkFile.php');
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

if(checkFile($DOC_ROOT.'/.cfg/config.php')) include($DOC_ROOT.'/.cfg/config.php');
		
/*############################################################################################## END INCLUDE CONFIG DATABASE ##########################################################################################*/

	if (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS']!=0)
	{
		//echo "HTTPS - ON </br>";
		$baseurl='https://'.$_SERVER['SERVER_NAME'].substr(__DIR__,strlen($_SERVER['DOCUMENT_ROOT']));
		
	} 
	else 
	{
		//echo "HTTPS - OFF </br>";
		$baseurl='http://'.$_SERVER['SERVER_NAME'].substr(__DIR__,strlen($_SERVER['DOCUMENT_ROOT']));
	};
	//echo $baseurl."<br/>";
	
    $basedir=substr(__DIR__,strlen($_SERVER['DOCUMENT_ROOT']));
    if (isset($_POST["from_url"]) && $_POST["from_url"]<>"") { $from_url=$_POST["from_url"]; } else { if (isset($_GET["from_url"])) { $from_url=$_GET["from_url"]; } else { $from_url=$_SERVER['HTTP_REFERER']; } }
    $from_url=str_replace('&','%26',$from_url);
	//echo $from_url."<br/>";
    if (! ((strlen($from_url)>strlen($baseurl)+1) && (strcmp(substr($from_url,0,strlen($baseurl)),$baseurl) == 0) && (strcmp(substr($from_url,strlen($baseurl)+1,9),"index.php")<>0)) ) { $from_url=""; $rel_from_url=""; } else { $rel_from_url=substr($from_url,strlen($baseurl)+1); }
		
		
		$appses = "rezerwacjegop_";
		session_name ($appses.$basedir);
		session_start();
		header('Content-Type: text/html; charset=utf-8');
if(!isset($_SESSION["PHPV"]))
{
	$ver=(float)phpversion();
	$_SESSION["PHPV"]=$ver;
	$_SESSION["PHPK"]="PHP v. $ver";
	// test
	//$_SESSION["PHPV"]=5;

};
	$user_logged_in = false;
	$user_is_admin = false;	
	
if(isset($_GET['username'])) 
{	
	if(checkFile($_SERVER['DOCUMENT_ROOT'].'/.cfg/users.php')) include($_SERVER['DOCUMENT_ROOT'].'/.cfg/users.php');
	
	if(in_array($_GET["username"],$conf['validusers']))
	{
		$user_logged_in = true;
	}
	else
	{
		$user_logged_in = FALSE;
	};
	//die('STOP');	
}//isset session username
else
{
	$user_logged_in = false;
};		
//print_r($_SESSION);
//die('STOP3<br/>');
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
