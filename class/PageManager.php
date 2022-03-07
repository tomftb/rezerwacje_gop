<?php
/*
    Static ABSTRACT Factory
*/

class PageManager
{
    private static $Log;
    private static $pagePerm=[
        1=>'LOG_INTO_CLUSTR',
        3=>'LOG_INTO_PROJ',
        4=>'LOG_INTO_EMPL',
        5=>'',
        6=>'LOG_INTO_USER',
        7=>'LOG_INTO_PERM',
        8=>'LOG_INTO_ROLE',
        9=>'LOG_INTO_OPCJ',
        10=>'LOG_INTO_PARM',
        11=>'LOG_INTO_STAGE'
    ];
    public static function load($idPage=0){
        self::$Log=Logger::init(__METHOD__);
        self::loadLoginPage();
        self::loadNoAccessPage($idPage);
        self::loadPage($idPage);
    }
    private static function loadPage($idPage){
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
                                //New Etapy();
                                New ProjectItems();
                            break;
	endswitch;
    }
    private function loadLoginPage(){
        self::$Log->log(0,__METHOD__);
        New Login();  
    }
    private function loadNoAccessPage($idPage){
        self::$Log->log(0,__METHOD__);
        New NoAccess($idPage,self::$pagePerm);
    }
}