<?php
/*
    Static ABSTRACT Factory
*/

class PageManager
{
    private static $Log;
    public static function load($idPage=0){
        self::$Log=Logger::init(__METHOD__);
        self::loadLoginPage();
        self::loadHead();
        self::loadBody($idPage);
        self::loadFooter();
    }
    private function loadHead(){
        include (DR_PUBLIC.'/view/header.php');
        include(DR_PUBLIC.'/view/infoHeader.php');
    }
    private static function loadBody($idPage){
        switch ($idPage):
                        default:  
                        case 1:
                                New RezerwujKlaster();
                            break;    
                        case 3:
                                New Projekty();
                            break;
                        case 4:
                                New Pracownicy();
                            break;
                        case 5:
                                New Administrator();
                            break;
                        case 6:
                                New Uzytkownik();
                            break;
                        case 7: 
                                New Uprawnienia();
                            break;
                        case 8:
                                New Role();
                            break;
                        case 9:
                                New Opcje();
                            break;
                        case 10:
                                New Parametry();
                            break;
                        case 11:
                                New Etapy();
                            break;
	endswitch;
    }
    private function loadFooter(){
        include (DR_PUBLIC.'/view/vBody.html');
        include (DR_PUBLIC.'/view/footer.php');
    }
    private function loadLoginPage(){
        self::$Log->log(0,__METHOD__);
        New Login();  
    }
}