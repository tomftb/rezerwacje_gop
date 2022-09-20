<?php

final class Projekty extends Page{
    private $Log;
    private $mainPerm='LOG_INTO_PROJ';
    private $view=[
        'Main/PageLink.php',
        'vProjekty.php',
        'Main/Table.html',
        'Main/AdaptedModal.html',
        'Main/Footer.php'
        ];
    private $js=[
        'Main/Html.js',
        'Main/Modal.js',
        'Main/Ajax.js',
        'Main/headerView.js',
        'Main/Table.js',
        'Main/ErrorStack.js',
        'Page/ProjectReportView.js',
        'Page/ProjectReport.js',
        'Page/projekty.js',
        'Page/projekty_zespol.js'
        ];
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
