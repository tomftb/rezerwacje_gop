<?php session_start();
$appName="Rezerwacje GOP";
$DOC_ROOT=filter_input(INPUT_SERVER,"DOCUMENT_ROOT");
require_once($DOC_ROOT.'/function/checkFile.php');
require_once($DOC_ROOT.'/function/checkPerm.php');
 
if(checkFile($DOC_ROOT.'/modul/mValidUrl.php')) {include_once ($DOC_ROOT.'/modul/mValidUrl.php');} 
if(checkFile($DOC_ROOT.'/.cfg/config.php')) {require_once ($DOC_ROOT.'/.cfg/config.php');}
if(checkFile($DOC_ROOT.'/modul/mValidLogin.php')) {include($DOC_ROOT.'/modul/mValidLogin.php');}

$loginCheck=NEW validLogin();

if(!$loginCheck->checkLoginData())
{    
    $bgColor=$loginCheck->getBgColorValue();
    $err=$loginCheck->getInfoValue();
    if(checkFile($DOC_ROOT.'/view/headerLogin.php')) {include ($DOC_ROOT.'/view/headerLogin.php');} 
    if(checkFile($DOC_ROOT.'/view/vLogin.php')) {include($DOC_ROOT.'/view/vLogin.php');}
    if(checkFile($DOC_ROOT.'/view/footerLogin.php')) {include ($DOC_ROOT.'/view/footerLogin.php');} 
}
else
{
        $idPage=filter_input(INPUT_GET,"id", FILTER_VALIDATE_INT);
        if(checkFile($DOC_ROOT.'/view/header.php')) {include ($DOC_ROOT.'/view/header.php');} 
        if(checkFile($DOC_ROOT.'/view/infoHeader.php')) {include($DOC_ROOT.'/view/infoHeader.php');}
        if(checkPerm('LOG_INTO_APP',$_SESSION['perm'],1));                     
	switch ($idPage):
                        // REZERWACJA KLASTRA[LOG_INTO_KLAST]
			default:  
                        case 1:
                                checkPerm('LOG_INTO_KLAST',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/function/listaNod.php')) {include($DOC_ROOT.'/function/listaNod.php');}
                                if(checkFile($DOC_ROOT.'/view/rezerwacje.php')) {include($DOC_ROOT.'/view/rezerwacje.php');}
                                if(checkFile($DOC_ROOT.'/function/checkData.php')) {include($DOC_ROOT.'/function/checkData.php');}
                                if(checkFile($DOC_ROOT.'/view/v_listaNod.php')) {include($DOC_ROOT.'/view/v_listaNod.php');}
                            break;
                        // ZGŁOŚ PROJEKT [LOG_INTO_ZGL_PROJ]
                        case 2:
                                checkPerm('LOG_INTO_ZGL_PROJ',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/zglosProjekt.php')) {include($DOC_ROOT.'/view/zglosProjekt.php');}
                                if(checkFile($DOC_ROOT.'/function/ajaxCheck.php')) {include($DOC_ROOT.'/function/ajaxCheck.php');}
                                if(checkFile($DOC_ROOT.'/modul/addNewProject.php')) {include($DOC_ROOT.'/modul/addNewProject.php');}
                            break;
                        // PROJEKTY [LOG_INTO_PROJ]    
                        case 3:
                                checkPerm('LOG_INTO_PROJ',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vProjekty.php')) {include($DOC_ROOT.'/view/vProjekty.php');}
                            break;
                        // PRACOWNICY [LOG_INTO_PRAC]
                        case 4:
                                checkPerm('LOG_INTO_PRAC',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vPracownicy.php')) {include($DOC_ROOT.'/view/vPracownicy.php');}
                            break;
                        // UZYTKOWNICY [LOG_INTO_UZYT]
                        case 5:
                                checkPerm('LOG_INTO_UZYT',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vUzytkownicy.php')) {include($DOC_ROOT.'/view/vUzytkownicy.php');}
                            break;
	endswitch;
        if(checkFile($DOC_ROOT.'/view/footer.php')) {include ($DOC_ROOT.'/view/footer.php');} 
}