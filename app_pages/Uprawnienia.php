<?php

final class Uprawnienia extends Page{
    private $Log;
    private $mainPerm='LOG_INTO_UPR';
    private $view=[
        'Main/PageLink.php',
        'vUprawnienia.php',
        'Main/Table.html',
        'Main/AdaptedModal.html',
        'Main/Footer.php'
        ];
    private $js=[
        'bootstrap-datepicker.min.js',
        'fontawesome.min.js',
        'Main/createHtmlElement.js',
        'Main/parseFieldValue.js',
        'Main/Error.js',
        'Main/Ajax.js',
        'Main/Utilities.js',
        'Page/uprawnienia.js'
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
