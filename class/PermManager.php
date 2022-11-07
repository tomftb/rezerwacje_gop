<?php
final class PermManager{
    private $mainPerm='LOG_INTO_APP';
	private $Log;
    
    public function __construct(){
		$this->Log = Logger::init(__FILE__);
		$this->Log->log(0,"[".__METHOD__."]");
    }
    public function checkPermission($perm='')
    {	
        self::checkSession();
        self::check($this->mainPerm);
        self::check($perm); 
    }
    private function check($perm){
        if(!in_array($perm,$_SESSION['perm'])){
           throw new Exception('['.$perm.']NO PERMISSION',0);
        }
    }
    private function checkSession(){
        $this->Log->log(0,$_SESSION);
        $this->Log->log(0,count($_SESSION));
        if(count($_SESSION)===0){
             throw new Exception('Sesja wygasła. Zaloguj się ponownie.',0);
        }
        //if(!isset($_SESSION)){
          //  throw new Exception('NO SESSION',1);
        //}
        if(!isset($_SESSION['perm'])){
            throw new Exception('NO SESSION PERM KEY',1);
        }
    }
    function __destruct(){      }
}
