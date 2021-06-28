<?php
interface ErrorHandlerInterface{
    
    public function getError();
    public function setError($data,$lvl);
}
/*
 * Error class is predefined for PHP
 */
class ErrorHandler implements ErrorHandlerInterface{
    private $error='';
    public function __construct(){}
    public function setError($data,$errLvl=0){
        /*
         * lvl = 0 user error
         * lvl = 1 appliaction error
	 * lvl = 2 critical error die()      
         */
        $this->parseErrLvl($data,$errLvl);
    }
    private function parseErrLvl($d='',$l=0)
    {
        if ($l===0){
            self::firstError($d);
	}
	else if($l===1){
            $this->error.="[ERROR] Wystąpił błąd aplikacji! Skontaktuj się z Administratorem!";
        }
        else if($l===2){
            $this->error.="[ERROR] Wystąpił krytyczny błąd aplikacji! Skontaktuj się z Administratorem!";
            die($this->getError());
        }
        else{
            die($this->getError());
        }
    }
    public function getError(){
        return $this->error;
    }
    private function firstError($d){
        $sep='';
        if($this->error!==''){
            $sep='<br/>';
        }
        $this->error.=$sep.$d;
    }
}
