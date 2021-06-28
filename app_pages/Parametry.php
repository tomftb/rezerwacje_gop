<?php

final class Parametry extends Page{
    private $Log;
    private $mainPerm='LOG_INTO_PARM';
    private $view=['vParametry.php'];
    private $js=['parametry.js'];

	
    public function __construct(){
        parent::__construct();	
        self::setPage();
		parent::loadMainJs();
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
