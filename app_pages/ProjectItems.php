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
        'Main/Utilities.js',
        'Main/Html.js',
        'Main/Modal.js',
        'Main/ErrorStack.js',
        'Main/Xhr.js',
        'Main/Table.js',
        'Main/Glossary.js',
        'Main/headerView.js',
        'Utilities/Department.js',
        'Utilities/Style.js',
        'Utilities/RomanList.js',
        'Utilities/AlphabeticalList.js',
        'Utilities/TabStop.js',
        'Utilities/ToolFields.js',
        'Utilities/Tool.js',
        'Main/StageData/StageDataRefill.js',
        'Main/StageData/StageDataUpdate.js',
        'Main/StageData/StageData.js',
        'Utilities/DocPreviewTabStop.js',
        'Utilities/DocPreviewParagraph.js',
        'Utilities/DocPreviewPage.js',
        'Utilities/DocPreview.js',
        'Utilities/Parse.js',
        'Page/ProjectStage/ProjectStageToolVariable.js',
        'Page/ProjectStage/ProjectStageToolFile.js',
        'Page/ProjectStage/ProjectStageTool.js',
        'Page/ProjectStage/ProjectStageProperty.js',
        'Page/ProjectStage/Row.js',
        'Page/ProjectStage/SubSection.js',
        'Page/ProjectStage/Section.js',
        'Page/ProjectStage/ProjectStageCreateHead.js',
        'Page/ProjectStage/ProjectStageCreate.js',
        //'Page/ProjectStageCreateText.js',
        'Page/ProjectStage/ProjectStageCreateTable.js',
        'Page/ProjectStage/ProjectStageCreateImage.js',
        //'Page/ProjectStageCreateList.js',
        'Page/ProjectStage/ProjectStageTable.js',
        'Page/ProjectStage/ProjectStage.js',
        'Page/ProjectConstantTable.js',
        'Page/ProjectConstantCreate.js',
        'Page/ProjectConstant.js',
        'Page/ProjectVariable/ProjectVariableTable.js',
        'Page/ProjectVariable/ProjectVariableCreate.js',
        'Page/ProjectVariable/ProjectVariable.js',
        //'Page/ProjectStage/HeadingTable.js',
        //'Page/ProjectStage/Heading.js',
        //'Page/ProjectStage/Footer.js',
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