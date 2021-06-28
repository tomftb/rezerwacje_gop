<?php

final class Login extends Page{
    private $Log;
    private $mainPerm='LOG_INTO_UZYT';
    private $view=['headerLogin.php','vLogin.php','footerLogin.php'];
    private $js=[];
    private $loginErr='';
    private $loginBgColor='';
	
    public function __construct(){
        $this->Log=Logger::init();
        parent::__construct();	
        if(!self::checkLogin()){
            self::setPage();
            $this->err=$this->loginErr;
            $this->bgColor=$this->loginBgColor;
            parent::load();
            exit();
        }
    }
    public function setPage(){
	$this->Log->log(0,"[".__METHOD__."]");
	parent::setJs($this->js);
        parent::setView($this->view);
        parent::setMainPerm($this->mainPerm);
    }
    public function checkLogin(){
        $this->Log->log(0,"[".__METHOD__."]");
        $loginCheck=NEW ValidLogin();
        if(!$loginCheck->checkLoginData()){
            $this->loginBgColor=$loginCheck->getBgColorValue();
            $this->loginErr=$loginCheck->getInfoValue();
            $this->Log->log(0,"[".__METHOD__."] login err => ".$this->loginErr);
            return 0;
        }
        return 1;
    }
    public function getErr(){
        return $this->err;
    }
    public function __destruct(){}

}
