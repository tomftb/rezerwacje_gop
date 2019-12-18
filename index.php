<?php session_start();
$appName="Rezerwacje GOP";
$DOC_ROOT=filter_input(INPUT_SERVER,"DOCUMENT_ROOT");
require_once($DOC_ROOT.'/function/checkFile.php');
require_once($DOC_ROOT.'/function/checkPerm.php');
 
//if(checkFile($DOC_ROOT.'/modul/mValidUrl.php')) {include_once ($DOC_ROOT.'/modul/mValidUrl.php');} 
if(checkFile($DOC_ROOT.'/.cfg/config.php')) {require_once ($DOC_ROOT.'/.cfg/config.php');}
if(checkFile($DOC_ROOT.'/modul/mValidLogin.php')) {include($DOC_ROOT.'/modul/mValidLogin.php');}

$loginCheck=NEW validLogin();
$appLoadData=array();
$parm='';
$uid= uniqid();
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
        if(checkPerm('LOG_INTO_APP',$_SESSION['perm'],1)) ;             
	switch ($idPage):
                        // REZERWACJA KLASTRA[LOG_INTO_KLAST]
			default:  
                        case 1:
                                if(checkPerm('LOG_INTO_KLAST',$_SESSION['perm'],1)) ;
                                if(checkFile($DOC_ROOT.'/function/listaNod.php')) {include ($DOC_ROOT.'/function/listaNod.php');} 
                                if(checkFile($DOC_ROOT.'/view/rezerwacje.php')) {include($DOC_ROOT.'/view/rezerwacje.php');}
                                if(checkFile($DOC_ROOT.'/function/checkData.php')) {include ($DOC_ROOT.'/function/checkData.php');} 
                                if(checkFile($DOC_ROOT.'/view/v_listaNod.php')) {include($DOC_ROOT.'/view/v_listaNod.php');}
                                if(checkFile($DOC_ROOT.'/view/footer.php')) {include($DOC_ROOT.'/view/footer.php');} 
                                
                                /*
                                 * $parm='LOG_INTO_KLAST';
                                 * $appLoadData['FUNCTION']='/function/listaNod.php';
                                $appLoadData['VIEW']='/view/rezerwacje.php';
                                $appLoadData['FUNCTION1']='/function/checkData.php';
                                $appLoadData['VIEW1']='/view/v_listaNod.php';
                                 */
                                
                            break;
                        // ZGŁOŚ PROJEKT [LOG_INTO_ZGL_PROJ]
                            /* NOT USED
                        case 2:
                             *  $parm='LOG_INTO_ZGL_PROJ';
                                $appLoadData['VIEW']='/view/zglosProjekt.php';
                             *  $appLoadData['FUNCTION']='/function/ajaxCheck.php';
                             *  $appLoadData['MODUL']='/modul/addNewProject.php';
                            break;
                             */
                        // PROJEKTY [LOG_INTO_PROJ]    
                        case 3:
                                $parm='LOG_INTO_PROJ';
                                $appLoadData['VIEW']='/view/vProjekty.php';
                                $appLoadData['JS1']='/js/createHtmlElement.js';
                                $appLoadData['JS2']='/js/parseFieldValue.js';
                                $appLoadData['JS3']='/js/projekty.js';
                            break;
                         // PRACOWNICY [LOG_INTO_PRAC]
                        case 4:
                                $parm='LOG_INTO_PRAC';
                                $appLoadData['VIEW']='/view/vPracownicy.php';
                                $appLoadData['JS']='/js/pracownicy.js';
                            break;
                        // ADMINISTRATOR [LOG_INTO_APP]
                        case 5:
                                $parm='LOG_INTO_APP';
                                $appLoadData['VIEW']='/view/vAdministrator.php';
                            break;
                        // UZYTKOWNICY [LOG_INTO_UZYT]
                        case 6:
                                $parm='LOG_INTO_UZYT';
                                $appLoadData['VIEW']='/view/vUzytkownicy.php';
                                $appLoadData['JS']='/js/uzytkownicy.js';
                            break;
                        // UPRAWNIENIA [LOG_INTO_UPR]
                        case 7:
                                $parm='LOG_INTO_UPR';
                                $appLoadData['VIEW']='/view/vUprawnienia.php';
                                $appLoadData['JS']='/js/uprawnienia.js';
                            break;
                        // ROLE [LOG_INTO_ROLE]
                        case 8:
                                $parm='LOG_INTO_ROLE';
                                $appLoadData['VIEW']='/view/vRole.php';
                                $appLoadData['JS']='/js/role.js';
                            break;
                        // OPCJE [LOG_INTO_OPCJ]
                        case 9:
                                $parm='LOG_INTO_OPCJ';
                                $appLoadData['VIEW']='/view/vOpcje.php';
                                $appLoadData['JS']='/js/opcje.js';
                            break;
                        // PARAMETRY [LOG_INTO_PARM]
                        case 10:
                                $parm='LOG_INTO_PARM';
                                $appLoadData['VIEW']='/view/vParametry.php';
                                $appLoadData['JS']='/js/parametry.js';
                            break;
	endswitch;
        if($parm)
        {
            checkPerm($parm,$_SESSION['perm'],1);
            $appLoadData['FOOTER']='/view/footer.php';   
            loadFiles($appLoadData,$dbLink); 
        }
        
}

function loadFiles($files,$dbLink)
{
    $DOC_ROOT=filter_input(INPUT_SERVER,"DOCUMENT_ROOT");
    foreach($files as $key => $file)
    {
        if(checkFile($DOC_ROOT.$file))
        {
            loadFileDependinfOfType($key,$file,$dbLink);
        } 
    }
}
function loadFileDependinfOfType($key,$file,$dbLink)
{
    $HTTP_HOST=filter_input(INPUT_SERVER,"HTTP_HOST");
    $DOC_ROOT=filter_input(INPUT_SERVER,"DOCUMENT_ROOT");
    $HTTP = (filter_input(INPUT_SERVER,"HTTPS") ? "HTTPS://" : "HTTP://"); 
    $FURL=$HTTP.$HTTP_HOST;
    if(preg_match("/JS/i", $key))
    {
        echo '<script type="text/javascript" src="'.$FURL.$file.'"></script>';
    }
    else
    {
        include($DOC_ROOT.$file);
       
    }
}