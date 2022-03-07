<?php

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ProjectItems
 *
 * @author tborczynski
 */
final class ProjectItems extends Page{
    private $Log;
    private $mainPerm='LOG_INTO_STAGE';
    private $view=[
        'Main/PageLink.php',
        'vProjectItems.php',
        'Main/Table.html',
        'Main/AdaptedModal.html',
        'Main/Footer.php'
        ];
    private $js=[
        'Main/Html.js',
        'Main/TableNew.js',
        'Main/Modal.js',
        'Main/Xhr.js',
        'Main/headerView.js',
        'Page/ProjectStageCreateText.js',
        'Page/ProjectStageCreateTable.js',
        'Page/ProjectStageCreateImage.js',
        'Page/ProjectStageCreateList.js',
        'Page/ProjectStageTable.js',
        'Page/ProjectStage.js',
        'Page/ProjectConstTable.js',
        'Page/ProjectConst.js',
        'Page/ProjectItems.js',
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
