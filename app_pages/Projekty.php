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
        'Main/Utilities.js',
        'Main/Ajax.js',
        'Main/Xhr.js',
        'Utilities/Department.js',
        'Utilities/Parse.js',
        'Main/StageDataUtilities.js',
        'Main/headerView.js',
        'Main/Table.js',
        'Main/ErrorStack.js',
        'Main/Glossary.js',
        'Main/StageData.js',
        'Utilities/ToolFields.js',
        'Utilities/Tool.js',
        'Page/ProjectStageToolFile.js',
        'Page/ProjectStageTool.js',
        'Page/ProjectReport/ProjectReportManagePrototype.js',
        'Page/ProjectReport/ProjectReportManageHeading.js',
        'Page/ProjectReport/ProjectReportManageFooter.js',
        'Page/ProjectReport/ProjectReportManage.js',
        'Page/ProjectReport/ProjectReportVariableImageAction.js',
        'Page/ProjectReport/ProjectReportVariableAction.js',
        'Page/ProjectReport/ProjectReportVariable.js',
        'Page/ProjectReport/ProjectReportView.js',
        'Page/ProjectReport/ProjectReport.js',
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
