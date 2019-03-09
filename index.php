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
                            /* NOT USED
                        case 2:
                                checkPerm('LOG_INTO_ZGL_PROJ',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/zglosProjekt.php')) {include($DOC_ROOT.'/view/zglosProjekt.php');}
                                if(checkFile($DOC_ROOT.'/function/ajaxCheck.php')) {include($DOC_ROOT.'/function/ajaxCheck.php');}
                                if(checkFile($DOC_ROOT.'/modul/addNewProject.php')) {include($DOC_ROOT.'/modul/addNewProject.php');}
                            break;
                             */
                        // PROJEKTY [LOG_INTO_PROJ]    
                        case 3:
                                checkPerm('LOG_INTO_PROJ',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vProjekty.php')) {include($DOC_ROOT.'/view/vProjekty.php');}
                                if(checkFile($DOC_ROOT.'/js/projekty.js'))
                                {
                                    echo '<script type="text/javascript" src="'.$URL.'/js/projekty.js"></script>';
                                };
                            break;
                        // PRACOWNICY [LOG_INTO_PRAC]
                        case 4:
                                checkPerm('LOG_INTO_PRAC',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vPracownicy.php')) {include($DOC_ROOT.'/view/vPracownicy.php');}
                                if(checkFile($DOC_ROOT.'/js/pracownicy.js'))
                                {
                                    echo '<script type="text/javascript" src="'.$URL.'/js/pracownicy.js"></script>';
                                };
                            break;
                        // UZYTKOWNICY [LOG_INTO_UZYT]
                        case 6:
                                checkPerm('LOG_INTO_UZYT',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vUzytkownicy.php')) {include($DOC_ROOT.'/view/vUzytkownicy.php');}
                                if(checkFile($DOC_ROOT.'/js/uzytkownicy.js'))
                                {
                                    echo '<script type="text/javascript" src="'.$URL.'/js/uzytkownicy.js"></script>';
                                }
                            break;
                        // UPRAWNIENIA [LOG_INTO_UPR]
                        case 7:
                                checkPerm('LOG_INTO_UPR',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vUprawnienia.php')) {include($DOC_ROOT.'/view/vUprawnienia.php');}
                                if(checkFile($DOC_ROOT.'/js/uprawnienia.js'))
                                {
                                    echo '<script type="text/javascript" src="'.$URL.'/js/uprawnienia.js"></script>';
                                }
                            break;
                        // ROLE [LOG_INTO_ROLE]
                        case 8:
                                checkPerm('LOG_INTO_ROLE',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vRole.php')) {include($DOC_ROOT.'/view/vRole.php');}
                                if(checkFile($DOC_ROOT.'/js/role.js'))
                                {
                                    echo '<script type="text/javascript" src="'.$URL.'/js/role.js"></script>';
                                }
                            break;
                        // OPCJE [LOG_INTO_OPCJ]
                        case 9:
                                checkPerm('LOG_INTO_OPCJ',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vOpcje.php')) {include($DOC_ROOT.'/view/vOpcje.php');}
                                if(checkFile($DOC_ROOT.'/js/opcje.js'))
                                {
                                    echo '<script type="text/javascript" src="'.$URL.'/js/opcje.js"></script>';
                                }
                            break;
                        // PARAMETRY [LOG_INTO_PARM]
                        case 10:
                                checkPerm('LOG_INTO_PARM',$_SESSION['perm'],1);
                                if(checkFile($DOC_ROOT.'/view/vParametry.php')) {include($DOC_ROOT.'/view/vParametry.php');}
                                if(checkFile($DOC_ROOT.'/js/parametry.js'))
                                {
                                    echo '<script type="text/javascript" src="'.$URL.'/js/parametry.js"></script>';
                                }
                            break;
	endswitch;
       
        if(checkFile($DOC_ROOT.'/view/footer.php')) {include ($DOC_ROOT.'/view/footer.php');} 
}
