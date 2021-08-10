<?php
final class Login extends Page{
    private $Log;
    private $mainPerm='LOG_INTO_APP';
    private $view=['vLogin.php'];
    private $js=[
                'jquery-3.3.1.min.js',
                'jquery-ui-1.10.1.custom.min.js',
                'bootstrap-4.5.3.min.js'];
    private $css=[
        'bootstrap.min.4.5.3.css',
        'gt-admin.css'
    ];
    private $meta=[
                    'http-equiv="content-type" content="text/html; charset=UTF-8"',
                    'name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"'
            ];

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
        parent::setCSS($this->css);
        parent::setView($this->view);
        parent::setMeta($this->meta);
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
