<?php
class validPerm extends errorConfirm {
    //put your code here
    function __construct(){
        parent::__construct();
        parent::log(0,"[".__METHOD__."]");
		
        //$this->checkLoggedUserPerm('LOG_INTO_APP');
        //$this->checkLoggedUserPerm($this->taskPerm['name']);        
    }
    public function checkLoggedUserPerm($perm)
    {
        parent::log(0,"[".__METHOD__."]".$perm);
        if(!isset($_SESSION)){
            parent::setError(0,"[${perm}] Brak uprawnienia");
            return false;
        }
        else if(!isset($_SESSION['perm'])){
            parent::setError(0,"[${perm}] Brak uprawnienia");
            return false;
        }
        else if(!in_array($perm,$_SESSION['perm'])){
           parent::setError(0,"[${perm}] Brak uprawnienia");
           return false;
        }
        return true;
    }
    function __destruct(){
        parent::log(2,"[".__METHOD__."]");           
    }
}
