<?php

final class Projekty extends Page{
    private $Log;
    private $mainPerm='LOG_INTO_PROJ';
    private $view=['/Main/AdaptedModal.html','vProjekty.php'];
    private $js=['projekty_raport.js','projekty.js','projekty_zespol.js'];

	
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
