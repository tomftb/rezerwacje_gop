<?php

final class Opcje extends Page{
    private $Log;
    private $mainPerm='LOG_INTO_OPCJ';
    private $view=['vOpcje.php'];
    private $js=['opcje.js'];

	
    public function __construct(){
        parent::__construct();	
        self::setPage();
        parent::load();
    }
    public function setPage(){
		$this->Log=Logger::init();
		$this->Log->log(0,__METHOD__);
		parent::setJs($this->js);
        parent::setView($this->view);
        parent::setMainPerm($this->mainPerm);
    }
    public function __destruct(){}

}
