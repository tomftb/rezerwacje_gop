<?php

final class Etapy extends Page{
    private $Log;
    private $mainPerm='LOG_INTO_STAGE';
    private $view=[
        'Main/PageLink.php',
        'vEtapy.php',
        'Main/Table.html',
        'Main/AdaptedModal.html',
        'Main/Footer.php'
        ];
    private $js=[
        'Main/Ajax.js',
        'Main/headerView.js',
        'Main/Table.js',
        'Page/projekty_etapy.js',
        'Page/projekty_etapy_stale.js',
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